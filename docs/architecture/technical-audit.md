# Auditoria técnica — estado da fundação

**Data:** 10/11/2026  
**Escopo:** inspeção do conteúdo versionado na branch `main` e criação do primeiro esqueleto executável da API.  
**Limite:** esta auditoria é estática. Nenhum comando npm, build, typecheck ou teste foi executado em ambiente local nesta etapa.

## Estado encontrado antes das alterações

- O repositório tinha um workspace npm com apenas `apps/web`.
- O frontend era um placeholder React 19 + Vite 7 + TypeScript + Tailwind CSS 4, sem rotas, telas funcionais, cliente HTTP, autenticação ou integração com API.
- Não existiam `apps/api`, pacotes compartilhados, migrações SQL ou testes automatizados.
- Não havia lockfile npm versionado.
- A configuração de ambiente já reservava variáveis públicas do Firebase e URL da API, mas não havia integração real.
- A documentação descrevia PostgreSQL e Firebase Authentication como decisões de arquitetura, não como serviços configurados.

## Alterações realizadas nesta etapa

- Criado `apps/api` como workspace TypeScript em Node.js, sem framework adicional nesta primeira etapa.
- Criado servidor HTTP mínimo com:
  - `GET /health` retornando JSON e status 200;
  - resposta JSON 404 para rotas desconhecidas;
  - cabeçalhos básicos `X-Content-Type-Options: nosniff` e `Cache-Control: no-store`;
  - validação da variável `PORT` e encerramento gracioso por SIGINT/SIGTERM.
- Criados testes automatizados para o endpoint de saúde e rota inexistente, usando `node:test`.
- Registrados scripts raiz para desenvolvimento da API, build, typecheck e teste da API.
- Incluída a porta local da API no `.env.example`.

## O que ainda NÃO está implementado

1. Persistência PostgreSQL, schema, migrações e seeds.
2. Firebase Admin SDK e validação de ID token no backend.
3. Autorização por usuário, papel e recurso.
4. Domínios de negócio (perfis, residências, serviços, solicitações, chat, agenda, avaliações e assinaturas).
5. Validação de payloads, rate limiting, CORS com allowlist e política de erros.
6. Cliente HTTP no frontend, telas reais, roteamento e estados de carregamento/erro.
7. Pacotes compartilhados de tipos e schemas.
8. Testes de integração, segurança e CI.
9. Lockfile reproduzível e verificação automatizada de build no GitHub Actions.
10. Configuração de Firebase, PostgreSQL, hospedagem, storage, e-mail e monitoramento.

## Riscos e decisões pendentes

- **Node.js:** o root exige Node `>=22.12.0`; alinhar ambiente local e CI a essa versão.
- **Dependências:** gerar e versionar `package-lock.json` após instalar o workspace; não declarar build validado antes disso.
- **Autenticação:** o endpoint de saúde é público e não prova autenticação. Nenhuma rota de negócio deve ser criada sem middleware de validação Firebase e autorização no servidor.
- **Banco:** definir provedor PostgreSQL e estratégia de migração antes de criar conexão de produção. Não colocar credenciais no Git.
- **CORS:** ainda não há política CORS. Antes de expor endpoints de negócio ao navegador, definir origens permitidas por ambiente.
- **Dados pessoais:** não persistir CPF, endereço completo, documentos ou mensagens até existir modelo de acesso, retenção, logs e proteção apropriados.
- **Escopo MEI:** manter pendente a validação contábil/jurídica das atividades efetivamente exercidas pela Zelora.

## Próxima sequência técnica recomendada

1. Instalar dependências e gerar lockfile; executar build, typecheck e testes.
2. Escolher e configurar PostgreSQL; criar migrações iniciais para identidade e perfis, sem armazenar senhas Firebase.
3. Integrar Firebase Admin SDK e testar autenticação/autorização no servidor.
4. Criar pacote compartilhado de contratos e validação.
5. Implementar primeiro fluxo vertical: cadastro/perfil profissional e contratante, com persistência e testes.
6. Só então avançar para residências, busca e solicitações, mantendo endereço completo privado por padrão.

## Critério de conclusão

A fundação será considerada validada somente quando instalação limpa, build, typecheck e testes passarem em CI e quando as rotas privadas exigirem autenticação e autorização verificadas no backend.
