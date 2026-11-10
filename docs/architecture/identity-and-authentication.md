# Identidade, perfis e autenticação — fundação inicial

## Modelo de identidade

- `users` representa a conta Zelora e mantém vínculo único com o Firebase UID.
- `user_roles` permite que a mesma conta tenha papel de contratante, profissional ou ambos.
- `contractor_profiles` e `professional_profiles` guardam dados específicos de cada papel.
- O papel não é uma declaração confiável enviada pelo navegador. A API deve conceder papéis por fluxo validado no servidor.
- Administradores e permissões operacionais não são autoatribuíveis e exigirão um modelo administrativo separado.

## PostgreSQL

A primeira migração está em `apps/api/migrations/001_create_identity_and_profiles.sql`.

Requisitos:
- PostgreSQL 13+ (usa `gen_random_uuid()`).
- Configurar `DATABASE_URL` somente no ambiente de execução.
- Opcionalmente ajustar `PG_POOL_MAX` (padrão 10, intervalo permitido 1–50).
- Executar migrações em ordem, uma única vez, por ferramenta de migração controlada. Nesta etapa ainda não existe runner automático nem tabela de controle de migrações.

Exemplo local (com PostgreSQL já instalado e banco criado):

```sh
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f apps/api/migrations/001_create_identity_and_profiles.sql
```

A API não abre conexão ao banco automaticamente. `createDatabasePool()` exige `DATABASE_URL` e deve ser usado apenas quando o serviço de persistência for integrado.

## Firebase Admin

O backend verifica Firebase ID tokens por meio de `verifyFirebaseIdToken(token)`, incluindo verificação de revogação. O SDK usa Application Default Credentials; configure-as no ambiente de execução conforme a documentação do Firebase Admin SDK. Não coloque service-account JSON, private keys ou credenciais em `.env.example`, no Git ou em variáveis `VITE_*`.

`extractBearerToken()` apenas interpreta o cabeçalho HTTP. A verificação criptográfica e de revogação é feita pelo Firebase Admin. A função ainda não está ligada a rotas: nenhuma rota de negócio deve ser exposta até a implementação de middleware de autenticação, sincronização segura da identidade e autorização por recurso.

## Privacidade e limites desta etapa

A migração inicial não coleta CPF, telefone, endereço residencial, documentos, dados de pagamento ou conteúdo de mensagens. Esses dados só devem ser modelados depois de definir finalidade, retenção, controles de acesso e auditoria. Não retornar Firebase UID em perfis públicos.

## Próximos passos

1. Adotar um runner de migrações com histórico e execução transacional apropriada.
2. Implementar middleware HTTP que exija Bearer token e converta erros Firebase em respostas 401 seguras.
3. Implementar sincronização de usuário e concessão de papéis no servidor, com testes de autorização.
4. Integrar persistência e encerrar pools durante shutdown.
5. Configurar Firebase e PostgreSQL reais por ambiente e validar com testes de integração.
