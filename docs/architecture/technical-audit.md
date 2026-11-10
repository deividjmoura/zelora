# Auditoria técnica — estado da fundação

**Data:** 10/11/2026  
**Escopo:** inspeção estática da branch `main` e preparação da fundação de identidade em branch de trabalho.  
**Limite:** a etapa anterior não executou npm install, build, typecheck ou testes localmente. A branch de trabalho atual ainda precisa de instalação e execução real para ser considerada validada.

## Estado confirmado na main antes desta etapa

- Monorepo npm com workspaces `apps/web` e `apps/api`.
- Frontend React 19 + Vite 7 + TypeScript + Tailwind CSS 4, ainda sem fluxo funcional integrado.
- API Node.js/TypeScript mínima, com `GET /health` e resposta JSON 404.
- Dois testes iniciais para health e 404.
- Sem lockfile, banco configurado, migrações, Firebase Admin, middleware de autenticação, autorização ou CI.
- Documentação de produto já prevê papéis de contratante e profissional, inclusive uma conta que pode exercer ambos.

## Fundação proposta nesta branch

- Configuração validada para porta, URL PostgreSQL opcional e tamanho do pool.
- Fábrica explícita de pool PostgreSQL: não conecta nem exige credenciais no boot da API.
- Primeira migração SQL para usuários, papéis e perfis de contratante/profissional.
- Integração isolada com Firebase Admin usando Application Default Credentials e verificação de revogação de ID tokens.
- Parser de Bearer token e testes unitários para configuração e parsing.
- Documentação dos limites: nenhum endpoint de negócio ou middleware de autorização foi habilitado.

## Limites e riscos ainda abertos

1. Não há runner nem histórico automático de migrações.
2. A migração SQL ainda precisa ser aplicada e testada contra PostgreSQL real.
3. Firebase Admin depende de credenciais ADC e projeto Firebase configurados fora do repositório.
4. Verificação de token não equivale a autorização por papel/recurso.
5. Ainda não existe sincronização transacional de Firebase UID com `users`.
6. Ainda não existem fluxos de cadastro, perfis, residências ou solicitações.
7. Lockfile, instalação limpa e CI continuam pendentes.
8. Não foi configurada hospedagem, banco gerenciado, Firebase, storage, e-mail ou monitoramento.

## Critério para considerar esta fundação validada

Instalação reproduzível, build, typecheck e testes passando; migração aplicada em PostgreSQL de teste; Firebase Admin validado com credenciais de ambiente; middleware e autorização testados antes de expor qualquer rota privada.
