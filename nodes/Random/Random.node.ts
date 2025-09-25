import { IExecuteFunctions, INodeType, INodeTypeDescription, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import axios from 'axios';

export class Random implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Random',
        name: 'random',
        icon: 'file:random.svg', 
        group: ['transform'],
        version: 1,
        description: 'Gera um número inteiro aleatório usando o Random.org.',
        defaults: {
            name: 'Random',
        },
        inputs: ['main'],
        outputs: ['main'],
        properties: [
            {
                displayName: 'Operação',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                default: 'randomNumber',
                options: [
                    {
                        name: 'True Random Number Generator',
                        value: 'randomNumber',
                        action: 'Gerar número aleatório',
                    },
                ],
            },
            {
                displayName: 'Mínimo',
                name: 'min',
                type: 'number',
                typeOptions: {
                    minValue: 1,
                },
                default: 1,
                description: 'O valor mínimo do intervalo.',
                placeholder: '1',
            },
            {
                displayName: 'Máximo',
                name: 'max',
                type: 'number',
                typeOptions: {
                    minValue: 1,
                },
                default: 100,
                description: 'O valor máximo do intervalo.',
                placeholder: '100',
            },
            // --- Campos extras para demonstrar conhecimento dos tipos da UI ---
            {
                displayName: 'Opções Avançadas',
                name: 'advancedOptions',
                type: 'collection',
                placeholder: 'Adicionar Opção',
                default: {},
                options: [
                    {
                        displayName: 'Senha Falsa',
                        name: 'password',
                        type: 'string',
                        typeOptions: {
                            password: true,
                        },
                        default: '',
                        description: 'Este é um campo de senha apenas para demonstração.',
                    },
                    {
                        displayName: 'Data e Hora',
                        name: 'dateTime',
                        type: 'dateTime',
                        default: '',
                        description: 'Um campo de data e hora para demonstração.',
                    },
                    {
                        displayName: 'Cor de Fundo',
                        name: 'backgroundColor',
                        type: 'color',
                        default: '#DE5D17',
                        description: 'Um seletor de cores para demonstração.',
                    },
                    {
                        displayName: 'Filtrar por Tipo',
                        name: 'type',
                        type: 'multiOptions',
                        options: [
                            { name: 'Tipo A', value: 'typeA' },
                            { name: 'Tipo B', value: 'typeB' },
                        ],
                        default: [],
                        description: 'Um seletor de múltiplas opções para demonstração.',
                    },
                    {
                        displayName: 'Ativar Recurso',
                        name: 'enableFeature',
                        type: 'boolean',
                        default: false,
                        description: 'Um seletor de verdadeiro ou falso para demonstração.',
                    },
                    {
                        displayName: 'Comentários',
                        name: 'comments',
                        type: 'string',
                        typeOptions: {
                            rows: 4,
                        },
                        default: '',
                        description: 'Um campo de texto com várias linhas para demonstração.',
                    },
                ],
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        for (let i = 0; i < items.length; i++) {
            try {
                const min = this.getNodeParameter('min', i) as number;
                const max = this.getNodeParameter('max', i) as number;

                if (min > max) {
                    throw new NodeOperationError(this.getNode(), `'Mínimo' não pode ser maior que 'Máximo'.`, { itemIndex: i });
                }

                const url = `https://www.random.org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`;

                const response = await axios.get(url);
                const randomNumber = parseInt(response.data.trim(), 10);

                const newItem: INodeExecutionData = {
                    json: {
                        randomNumber: randomNumber,
                        min: min,
                        max: max,
                    },
                };
                returnData.push(newItem);

            } catch (error: unknown) {
                if (this.continueOnFail()) {
                    const errorMessage = (error instanceof Error) ? error.message : String(error);
                    returnData.push({ json: { error: errorMessage } });
                } else {
                    throw error;
                }
            }
        }

        return [returnData];
    }
}