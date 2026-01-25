# BFF Stock Market

## 📖 Visão Geral

O **BFF (Backend for Frontend) Stock Market** é uma aplicação serverless desenvolvida para agregar, processar e formatar dados do mercado financeiro. Ele atua como uma camada intermediária eficiente entre interfaces de usuário e APIs externas, fornecendo dados consolidados sobre ações da Ibovespa e cotações de moedas.

Este projeto foi construído com foco em alta performance e baixa latência, aproveitando a infraestrutura global da Cloudflare.

## 🚀 Tecnologias Utilizadas

Este projeto utiliza tecnologias modernas para garantir escalabilidade e eficiência:

*   **[Cloudflare Workers](https://workers.cloudflare.com/)**: Plataforma serverless para execução de código na borda (edge), garantindo baixa latência global.
*   **[Hono](https://hono.dev/)**: Framework web ultra-leve e rápido, otimizado para ambientes Edge como Cloudflare Workers.
*   **[TypeScript](https://www.typescriptlang.org/)**: Superset do JavaScript que adiciona tipagem estática, aumentando a segurança e manutenibilidade do código.
*   **[Zod](https://zod.dev/)**: Biblioteca para declaração e validação de schemas, utilizada para garantir a integridade das variáveis de ambiente e dados.
*   **[Wrangler](https://developers.cloudflare.com/workers/wrangler/)**: Ferramenta de linha de comando (CLI) oficial da Cloudflare para desenvolvimento e deploy de Workers.
*   **[Node.js](https://nodejs.org/)**: Ambiente de execução JavaScript (necessário para o desenvolvimento local).

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

*   **[Node.js](https://nodejs.org/)** (versão 18 ou superior recomendada)
*   **[pnpm](https://pnpm.io/)** (Gerenciador de pacotes utilizado no projeto)
*   Uma conta na **[Cloudflare](https://dash.cloudflare.com/sign-up)** (para deploy)

## 🔧 Instalação e Configuração

1.  **Instale as dependências do projeto:**

    ```bash
    pnpm install
    ```

2.  **Configuração das Variáveis de Ambiente:**

    O projeto utiliza variáveis de ambiente para configurações sensíveis. Um arquivo de exemplo foi fornecido.

    Copie o arquivo `.dev.vars.example` para um novo arquivo chamado `.dev.vars`:

    ```bash
    cp .dev.vars.example .dev.vars
    ```
    *(No Windows, você pode usar `copy .dev.vars.example .dev.vars` ou renomear manualmente)*

    Edite o arquivo `.dev.vars` e preencha as chaves necessárias:

    ```env
    MARKET_API_KEY="sua_chave_market_api"
    CORS_ORIGIN="http://localhost:3000"
    CURRENCY_API_KEY="sua_chave_currency_api"
    ```

## ⚡ Como Executar

### Desenvolvimento Local

Para iniciar o servidor de desenvolvimento localmente com *hot reload*:

```bash
pnpm run dev
```

O servidor estará acessível geralmente em `http://localhost:8787`.

### Deploy

Para publicar sua aplicação na rede global da Cloudflare:

```bash
pnpm run deploy
```
