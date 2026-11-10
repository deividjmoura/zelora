# Decisões técnicas iniciais

Status: **proposta aprovada para orientar a fundação; validar versões e detalhes durante a implementação.**

## Objetivo de plataforma

Entregar primeiro a aplicação web responsiva, mantendo desde o início uma arquitetura preparada para clientes Android e iOS. Os aplicativos nativos serão uma etapa posterior; não vamos transformar a aplicação web em um site encapsulado e chamá-lo de aplicativo.

## Stack proposta

- **Web:** React + Vite + TypeScript.
- **Estilos:** Tailwind CSS, com tokens e componentes próprios da Zelora.
- **Backend:** Node.js + TypeScript, API REST versionada.
- **Banco:** PostgreSQL.
- **Autenticação:** Firebase Authentication. O backend valida os Firebase ID tokens e aplica autorização própria.
- **Aplicativos futuros:** React Native + Expo + TypeScript.
- **Testes:** testes unitários, integração de API e fluxos ponta a ponta.
- **Infraestrutura:** definir provedor após avaliar custo, região, backups, observabilidade e requisitos de privacidade.

## Monorepo

```text
apps/
  web/                 # aplicação web inicial
  api/                 # backend Node.js
  mobile/              # futuro React Native + Expo
packages/
  contracts/           # contratos e tipos compartilhados
  validation/          # schemas e validações compartilháveis
  api-client/          # cliente tipado da API
  design-tokens/       # cores, espaçamentos, tipografia
docs/
  product/
  architecture/
  legal/
  research/
  roadmap/
infrastructure/
```

A estrutura acima é o destino arquitetural. Não criar pastas vazias sem necessidade; implementar cada workspace quando houver código real.

## Limites de compartilhamento web/mobile

Compartilhar quando fizer sentido: tipos, contratos da API, schemas de validação independentes de UI, regras puras, formatação, constantes e tokens de design.

Não forçar compartilhamento de componentes visuais DOM com React Native. As interfaces web e nativa terão componentes próprios, mantendo consistência visual e de experiência.

## Segurança e identidade

1. Firebase Authentication cuida da autenticação; PostgreSQL mantém o cadastro de domínio, papéis, estado da conta e preferências.
2. O backend valida cada token com o Firebase Admin SDK e verifica status, papel e autorização no banco.
3. Nunca confiar em papel, plano, CPF, propriedade de recurso ou preço enviados pelo cliente sem validação do servidor.
4. Segredos e credenciais ficam em variáveis de ambiente/secret manager, nunca no Git.
5. CPF não deve ser usado como senha, identificador público ou campo de busca. Avaliar armazenamento mínimo, criptografia e tokenização para elegibilidade de teste.
6. Endereços completos de residências e conversas são dados privados; só podem ser acessados por usuários autorizados e conforme o estado da contratação.
7. Ações administrativas e mudanças de assinatura/identidade devem gerar trilha de auditoria.

## Domínios de negócio

Identidade; contas e papéis; perfis; serviços e preços; áreas de atendimento; residências; busca; solicitações/contratações; mensagens; agenda/disponibilidade; avaliações; favoritos; notificações; planos/testes/assinaturas; relatórios; denúncias/moderação; administração e auditoria.

## API e contratos

- Prefixo inicial: `/api/v1`.
- Contratos tipados e documentados (OpenAPI recomendado).
- Paginação, filtros e ordenação definidos de forma consistente.
- Erros com códigos estáveis, sem expor stack traces ou dados pessoais.
- Validação de entrada no servidor.
- Idempotência para operações que possam ser repetidas por rede/cliente.
- Eventos e notificações assíncronos devem tolerar repetição e falha.

## Decisões ainda pendentes

- Framework HTTP Node.js (avaliar Fastify ou NestJS).
- ORM/query builder e estratégia de migrações.
- Hospedagem de API, PostgreSQL e arquivos.
- Provedor de e-mail transacional e push.
- Serviço de mapas/geocodificação.
- Gateway de assinatura e regras fiscais.
- Monitoramento, logs, backups, recuperação e ambientes.
- Estratégia de moderação, verificação de identidade e suporte.

## Critério de qualidade

Uma funcionalidade só será considerada pronta quando tiver fluxo completo, validação, autorização no servidor, persistência, estados de carregamento/erro/vazio, acessibilidade, testes relevantes, logs sem dados sensíveis e documentação.
