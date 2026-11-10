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

## Próxima etapa
Converter o modelo conceitual em diagrama ER e migrações somente após fechar as regras de domínio pendentes.
