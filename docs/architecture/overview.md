# Visão de arquitetura

## Estado
Documento inicial. A escolha definitiva de stack, hospedagem, autenticação, armazenamento e serviços externos deverá ser registrada após uma decisão técnica explícita.

## Diretrizes
- Separar interface, lógica de aplicação e persistência.
- Centralizar regras de negócio no backend.
- Tratar autorização como responsabilidade do servidor.
- Versionar contratos e migrações.
- Preferir componentes e módulos com responsabilidades claras.
- Projetar notificações e tarefas assíncronas para falhas e repetição segura.
- Manter segredos fora do repositório.

## Domínios sugeridos
1. Identidade e autenticação.
2. Usuários, papéis e perfis.
3. Residências e endereços.
4. Catálogo de serviços e preços.
5. Busca e descoberta.
6. Solicitações e contratação.
7. Conversas e mensagens.
8. Agenda e disponibilidade.
9. Avaliações e reputação.
10. Favoritos e recorrência.
11. Planos e assinaturas.
12. Notificações.
13. Administração, moderação e auditoria.
14. Relatórios.

## Integrações a avaliar
- Provedor de e-mail e SMS/WhatsApp.
- Armazenamento de imagens.
- Mapas/geocodificação para busca por região.
- Provedor de cobrança recorrente para assinaturas.
- Monitoramento de erros e logs.

Nenhuma integração deve ser considerada contratada ou configurada até sua seleção e validação.
