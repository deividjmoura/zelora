# Diretrizes iniciais de dados

Este documento descreve entidades conceituais; não é ainda um schema SQL definitivo.

## Entidades
- User: identidade de domínio, estado e vínculo com o UID do Firebase.
- Role/Permission: papéis e permissões.
- ContractorProfile e ProfessionalProfile: dados específicos de cada papel.
- Residence: residências pertencentes ao contratante.
- Service e ProfessionalService: catálogo e serviços oferecidos.
- Price: modalidade e valor informado pelo profissional.
- ServiceArea: regiões atendidas.
- PortfolioItem: mídia do portfólio.
- AvailabilityRule e AvailabilityBlock: disponibilidade e bloqueios.
- BookingRequest: solicitação e estado da contratação.
- BookingEvent: histórico de transições.
- Conversation e Message: chat vinculado à solicitação.
- Review e ReviewResponse: avaliação e resposta.
- Favorite: relação de favorito.
- SubscriptionPlan, Subscription e Trial: planos e assinaturas.
- Notification: notificações.
- Report/ModerationCase: denúncias e moderação.
- AuditLog: trilha de ações administrativas e sensíveis.

## Integridade e privacidade
- Usar identificadores estáveis, chaves estrangeiras e restrições de integridade.
- Armazenar Firebase UID como identificador externo único; não armazenar senhas Firebase no PostgreSQL.
- Registrar timestamps e estados de forma consistente.
- Aplicar restrições contra avaliações duplicadas por contratação e conflitos de agenda.
- Separar dados públicos de dados privados.
- Proteger CPF e endereços com controles de acesso e minimização.
- Endereço completo não pode aparecer em consultas públicas ou respostas de busca.
- Evitar armazenar dados de cartão; delegar cobrança a provedor especializado.
- Definir retenção e exclusão conforme finalidade e obrigações legais.

## Migrações implementadas
A primeira migração (`apps/api/migrations/0001_identity_and_profiles.sql`) cobre identidade e perfis iniciais: `roles`, `users`, `user_roles`, `contractor_profiles` e `professional_profiles`. Ela não armazena senhas, CPF ou endereços.

O runner registra cada migração aplicada em `schema_migrations` com checksum SHA-256 cobrindo os arquivos `.sql` e `.down.sql`, detecta renomeações e alterações posteriores, usa bloqueio consultivo do PostgreSQL para evitar execuções concorrentes e pré-valida os arquivos antes de executar os rollbacks solicitados. Comandos: `npm run db:migrate`, `npm run db:status` e `npm run db:rollback --workspace @zelora/api -- --steps=1`.

## Próxima etapa
Converter as demais entidades conceituais em migrações incrementais somente após fechar as regras de domínio pendentes. Cada nova migração deve ter arquivo de rollback quando a reversão for segura.
