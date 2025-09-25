# Conector n8n - Gerador de Números Aleatórios (Random.org)

Este projeto contém um conector (custom node) para a plataforma de automação de workflows n8n. O objetivo deste conector é integrar-se com a API pública do [Random.org]( https://www.random.org/integers/?num=1&min=1&max=60&col=1&base=10&format=plain&rnd=new) para gerar um número inteiro verdadeiramente aleatório dentro de um fluxo de trabalho.

Este desenvolvimento foi realizado como parte de um desafio técnico para um processo seletivo, demonstrando a capacidade de estender a plataforma n8n com funcionalidades customizadas.

## Features

* **Integração com API Externa:** Consome o endpoint de inteiros do Random.org para buscar um número aleatório.
* **Interface Simples:** Fornece campos na UI do n8n para que o usuário defina facilmente os valores de **Mínimo** e **Máximo**.
* **Fluxo de Dados:** Mantém os dados recebidos de nós anteriores, adicionando o número aleatório gerado em um novo campo (`randomNumber`).
* **Ícone Personalizado:** Inclui um ícone SVG customizado para fácil identificação do nó na plataforma.

## Tecnologias Utilizadas

* **n8n:** Plataforma de automação de workflows.
* **Docker & Docker Compose:** Para criar um ambiente de desenvolvimento e execução conteinerizado e reproduzível.
* **PostgreSQL:** Banco de dados utilizado pela instância do n8n.
* **Node.js:** Ambiente de execução.
* **TypeScript:** Linguagem principal para o desenvolvimento do conector.
* **NVM (Node Version Manager):** Utilizado para gerenciar as versões do Node.js necessárias para o desenvolvimento.

---
##  Guia de Instalação e Execução

Para configurar e rodar este projeto localmente, siga os passos abaixo.

### Pré-requisitos

Antes de começar, garanta que você tem as seguintes ferramentas instaladas:

* **Git:** Para clonar o repositório.
* **Docker e Docker Compose:** Para rodar o ambiente n8n. [Instale aqui](https://www.docker.com/products/docker-desktop/).
* **NVM (Node Version Manager):** Essencial para gerenciar as versões do Node.js. Para Windows, recomenda-se o [nvm-windows](https://github.com/coreybutler/nvm-windows/releases).

### Passo a Passo

**1. Clone o Repositório**
```bash
git clone [https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git](https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git)
cd SEU-REPOSITORIO
```

**2. Configure o Ambiente Node.js com NVM**
O template do n8n pode requerer diferentes versões do Node.js para diferentes tarefas. O NVM facilita esse gerenciamento.

```bash
# Instala as versões necessárias
nvm install 22
nvm install 18

# Define a versão 22 como a padrão para este terminal
nvm use 22
```

**3. Inicie o Ambiente n8n com Docker**
O arquivo `docker-compose.yml` neste repositório irá configurar e iniciar uma instância do n8n junto com um banco de dados PostgreSQL.

```bash
# A partir da raiz do projeto, execute:
docker-compose up -d
```
Aguarde 1-2 minutos para os serviços iniciarem. Você poderá acessar a interface do n8n em **`http://localhost:5678`**. Crie sua conta de administrador na primeira vez.

**4. Compile e Conecte o Conector ao n8n**
Este processo irá compilar seu código e criar um link simbólico para que a instância do n8n em Docker possa encontrá-lo.

```bash
# Garanta que está na versão 22 do Node
nvm use 22

# Instale as dependências do projeto
npm install

# Compile o código
npm run build

# Crie um link global a partir da pasta do seu projeto
npm link

# Navegue até a pasta 'custom' do n8n (se não existir, crie com 'mkdir custom')
cd ../n8n_data/custom

# Use o link criado (o nome do pacote vem do package.json)
npm link n8n-nodes-random
```

**5. Reinicie o n8n para Carregar o Conector**
O n8n só carrega conectores customizados na inicialização.

```bash
# Volte para a pasta raiz onde está o docker-compose.yml
cd ..

# Reinicie o container do n8n
docker-compose restart n8n
```

**6. Verificação Final**
Acesse novamente o n8n em **`http://localhost:5678`**. Crie um novo workflow, clique para adicionar um nó e pesquise por **`Random`**. Seu conector customizado deverá aparecer na lista.

## Fluxo de Desenvolvimento

Para fazer alterações no código do conector:
1.  Abra o arquivo `nodes/Random/Random.node.ts` e faça suas modificações.
2.  Em um terminal, na pasta do projeto, rode o comando de compilação novamente: `npm run build`.
3.  Em outro terminal, na pasta raiz, reinicie o n8n para carregar as alterações: `docker-compose restart n8n`.
