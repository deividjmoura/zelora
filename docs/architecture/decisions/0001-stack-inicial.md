# ADR 0001 — Stack inicial da Zelora

- **Status:** Proposta aprovada para iniciar a aplicação web; revisar antes do primeiro deploy.
- **Data:** 2026-11-10

## Contexto
A primeira entrega será uma aplicação web responsiva. Android e iOS serão etapas posteriores, mas a arquitetura deve permitir que ambos consumam a mesma API e reutilizem tipos, validações e serviços independentes de interface.

## Decisão
- **Web:** React + Vite + TypeScript.
- **Estilos:** Tailwind CSS.
- **Backend:** Node.js + TypeScript, API REST.
- **Banco:** PostgreSQL com migrações versionadas.
- **Autenticação:** Firebase Authentication; o backend valida os ID tokens com Firebase Admin SDK.
- **Contratos compartilhados:** pacote TypeScript para tipos, schemas de validação e cliente HTTP, sem importar componentes web no mobile.
- **Mobile futuro:** React Native + Expo, consumindo a mesma API.

## Limites e responsabilidades
- Firebase autentica a identidade; o PostgreSQL mantém o cadastro de domínio, papéis, perfis e permissões da Zelora.
- O backend é a autoridade para autorização, regras de negócio, limites de plano, privacidade de endereços e transições de contratação.
- Nunca confiar em papel, preço, estado de contratação ou permissão enviados pelo cliente sem validação no servidor.
- Senhas e credenciais não serão armazenadas no PostgreSQL quando geridas pelo Firebase.
- Segredos e chaves privadas nunca entram no Git.

## Estrutura planejada
```text
apps/
  web/          # React + Vite
  api/          # Node.js API
  mobile/       # futuro: React Native + Expo
packages/
  shared/       # tipos e contratos sem dependência de plataforma
  validation/   # schemas compartilhados
  api-client/   # cliente tipado da API
docs/
```

## Consequências
- A web pode ser entregue primeiro sem acoplar regras de negócio à interface.
- O app mobile futuro reutiliza API, contratos e validações compatíveis, mas terá interface nativa própria.
- Firebase, PostgreSQL e hospedagem exigem configuração de projetos/credenciais fora do repositório.
- A escolha de bibliotecas concretas, versões, hospedagem, storage e provedor de e-mail será registrada antes de implementar os módulos.

## Segurança mínima antes de produção
HTTPS; validação de tokens no servidor; autorização por recurso; rate limiting; validação de entrada; migrações; logs sem dados sensíveis; backups; política de retenção; monitoramento; testes de permissões e revisão de segurança.
