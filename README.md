# Zelora

Plataforma web para conectar contratantes a profissionais de serviços domésticos, com foco em confiança, privacidade e organização da contratação.

> **Status:** fundação e documentação inicial. Ainda não é uma aplicação pronta para produção.

## Produto
A Zelora terá perfis de Contratante e Profissional, busca, residências, solicitações e contrapropostas, chat, agenda, avaliações, favoritos, notificações e painel administrativo. No lançamento, o pagamento do serviço será combinado diretamente entre as partes; eventual assinatura da plataforma será separada.

## Arquitetura inicial
- Web: React + Vite + TypeScript.
- Backend: Node.js + TypeScript, API REST.
- Banco: PostgreSQL.
- Autenticação: Firebase Authentication; validação de tokens no backend.
- Mobile futuro: React Native + Expo, consumindo a mesma API.
- Compartilhamento: contratos, tipos e validações independentes de interface.

Consulte [ADR da stack](docs/architecture/decisions/0001-stack-inicial.md).

## Estrutura planejada
```text
apps/
  web/          # aplicação web
  api/          # backend
  mobile/       # etapa futura: Android e iOS
packages/
  shared/
  validation/
  api-client/
docs/
  product/
  architecture/
  legal/
  research/
  roadmap/
```

## Documentação
- [Visão do produto](docs/product/vision.md)
- [Requisitos](docs/product/requirements.md)
- [Papéis e permissões](docs/product/user-roles.md)
- [Regras de negócio](docs/product/business-rules.md)
- [Arquitetura](docs/architecture/overview.md)
- [Auditoria técnica e estado da fundação](docs/architecture/technical-audit.md)
- [Identidade e autenticação](docs/architecture/identity-and-authentication.md)
- [Decisão da stack](docs/architecture/decisions/0001-stack-inicial.md)
- [Termos de Uso — minuta](docs/legal/terms-of-use.md)
- [Política de Privacidade — minuta](docs/legal/privacy-policy.md)
- [Checklist jurídico](docs/legal/publication-checklist.md)
- [Pesquisa de referências](docs/research/marketplace-privacy-terms-review.md)
- [Roadmap](docs/roadmap/development-phases.md)

## Princípios de engenharia
1. Regras de negócio e autorização ficam no backend.
2. O frontend nunca é a autoridade para papéis, permissões, preços ou estados.
3. Endereços residenciais e documentos recebem proteção especial.
4. Migrações de banco e contratos de API são versionados.
5. Um módulo só é considerado pronto com persistência, validações, permissões, testes e documentação.
6. Segredos, chaves privadas e arquivos de ambiente reais nunca entram no Git.

## Desenvolvimento

Requisitos: Node.js `>=22.12.0` e npm compatível.

- `npm install` — instalar dependências do workspace.
- `npm run dev` — iniciar o frontend web.
- `npm run dev:api` — iniciar a API em `http://localhost:3000`.
- `npm run build` — compilar frontend e API.
- `npm run typecheck` — verificar os tipos de frontend e API.
- `npm run test:api` — executar os testes automatizados da API.

A API possui apenas o endpoint público `GET /health`. PostgreSQL e Firebase Admin têm módulos de integração preparados, mas ainda não estão conectados a rotas de negócio. Consulte [a auditoria técnica](docs/architecture/technical-audit.md) antes de tratar a fundação como pronta para produção.

## Documentos legais
Os documentos em `docs/legal` são minutas internas e **não estão aprovados para publicação**. Exigem preenchimento dos dados da pessoa jurídica, mapeamento real dos fornecedores e fluxos de dados e revisão jurídica brasileira antes de qualquer aceite de usuário.
