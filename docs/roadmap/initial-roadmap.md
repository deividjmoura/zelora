# Roadmap inicial da Zelora

Este roadmap organiza a construção por dependências. Datas e estimativas serão definidas após a escolha das ferramentas e a primeira implementação executável.

## Fase 0 — Fundação e decisões
- [x] Definir proposta de valor, públicos e módulos principais.
- [x] Registrar stack inicial web, API, PostgreSQL e Firebase Authentication.
- [x] Definir arquitetura preparada para React Native + Expo.
- [x] Criar minutas iniciais de Termos e Política de Privacidade.
- [ ] Definir framework backend, ORM, hospedagem e estratégia de deploy.
- [ ] Definir identidade visual, tokens e padrões de acessibilidade.
- [ ] Revisão jurídica e mapeamento LGPD.

## Fase 1 — Base técnica
- [ ] Configurar monorepo e workspaces TypeScript.
- [ ] Configurar aplicação web React + Vite.
- [ ] Configurar API Node.js e PostgreSQL.
- [ ] Configurar migrações, seeds e ambientes local/teste/produção.
- [ ] Integrar Firebase Authentication e validação de token no backend.
- [ ] Configurar lint, format, testes e CI.
- [ ] Criar logs, tratamento de erros e gestão de segredos.

## Fase 2 — Identidade e perfis
- [ ] Cadastro/login/logout/recuperação.
- [ ] Papéis Contratante e Profissional.
- [ ] Perfil de contratante.
- [ ] Perfil profissional, serviços, preços e regiões.
- [ ] Preferências de privacidade e controles de conta.

## Fase 3 — Descoberta e contratação
- [ ] Cadastro de residências e proteção de endereços.
- [ ] Busca e filtros.
- [ ] Favoritos e limites por plano.
- [ ] Solicitações, aceite, recusa e contraproposta.
- [ ] Confirmação de condições e histórico.

## Fase 4 — Comunicação e organização
- [ ] Chat associado à solicitação.
- [ ] Notificações.
- [ ] Agenda de ambas as partes.
- [ ] Disponibilidade, conflitos e recorrência.
- [ ] Avaliações mútuas após contratação elegível.

## Fase 5 — Administração e confiança
- [ ] Painel administrativo com acesso restrito.
- [ ] Denúncias, moderação e contestação.
- [ ] Auditoria de ações sensíveis.
- [ ] Fluxo de suporte e incidentes.
- [ ] Direitos LGPD e solicitação de exclusão/retificação.

## Fase 6 — Monetização
- [ ] Implementar limites Free.
- [ ] Implementar teste Premium de 15 dias sem cartão antecipado.
- [ ] Controle de um teste por pessoa, após validação jurídica e técnica.
- [ ] Pro e Plus, matriz final de benefícios e preços.
- [ ] Gateway, cobrança recorrente, cancelamento e reembolso.
- [ ] Avisos de expiração e downgrade automático para Free.

## Fase 7 — Preparação mobile
- [ ] Validar contratos e API para clientes nativos.
- [ ] Configurar Expo/React Native.
- [ ] Implementar autenticação nativa.
- [ ] Reaproveitar contracts, validation, api-client e tokens.
- [ ] Implementar navegação, push e recursos nativos.
- [ ] Testar Android e iOS e preparar publicação nas lojas.

## Critério de aceite por módulo

Nenhum módulo é concluído apenas porque a tela existe. Deve ter persistência real, autorização no backend, validação, estados de erro/vazio/carregamento, testes automatizados proporcionais, acessibilidade, telemetria segura e documentação.
