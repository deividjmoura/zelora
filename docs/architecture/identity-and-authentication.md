# Identidade, perfis e autenticação

## Responsabilidades

- **Firebase Authentication** é a autoridade para credenciais, login, recuperação de senha e emissão de ID tokens.
- **PostgreSQL** mantém a identidade de domínio da Zelora, estado da conta, papéis e dados de perfil.
- **A API** valida o ID token no servidor e consulta o PostgreSQL para decidir se a conta existe, está ativa e possui o papel exigido.
- O frontend nunca define nem concede papéis por conta própria.

## Modelo inicial

| Tabela | Responsabilidade |
| --- | --- |
| `users` | Identidade de domínio, UID Firebase único, e-mail e estado (`active`, `suspended`, `deleted`). |
| `roles` | Catálogo de papéis: `contractor`, `professional` e `admin`. |
| `user_roles` | Relação N:N entre usuários e papéis; permite que uma mesma conta atue como contratante e profissional. |
| `contractor_profiles` | Perfil específico do contratante, ligado 1:1 ao usuário. |
| `professional_profiles` | Perfil profissional, ligado 1:1 ao usuário, com nome público, título, biografia e indicador de publicação. |

A migração inicial não armazena senha, CPF, endereço residencial completo, documentos ou dados de pagamento. Esses domínios exigem desenho separado de finalidade, acesso, retenção e auditoria antes de serem adicionados.

## Fluxo de autenticação nas rotas privadas

1. O cliente envia `Authorization: Bearer <Firebase ID token>`.
2. O adaptador Firebase Admin verifica a assinatura e a validade do token.
3. A API usa o `uid` verificado para localizar o usuário em `users` e carregar seus papéis de `user_roles`.
4. A API permite o acesso somente se o usuário existir e seu estado for `active`.
5. Middleware adicional pode exigir um ou mais papéis. Os papéis são lidos do banco, nunca aceitos do corpo da requisição nem confiados a claims controladas pelo cliente.

Respostas esperadas da fundação:
- `401 unauthorized`: token ausente.
- `401 invalid_token`: token rejeitado pelo Firebase Admin.
- `403 user_not_provisioned`: identidade Firebase válida sem usuário de domínio.
- `403 account_inactive`: conta suspensa ou excluída.
- `403 forbidden`: usuário ativo sem o papel necessário.
- `503 auth_not_configured` ou `503 database_not_configured`: dependência de infraestrutura não configurada.

## Estado dos endpoints

- `GET /health`: público; indica que o processo HTTP responde, não que banco ou Firebase estejam disponíveis.
- `GET /me`: privado; retorna somente ID de domínio, e-mail, confirmação de e-mail, estado e papéis.
- `GET /admin/diagnostics`: rota mínima protegida por `admin`, atualmente sem diagnósticos operacionais detalhados; não deve ser tratada como painel administrativo.

Não existe nesta etapa endpoint de cadastro, provisionamento, atribuição de papéis ou criação de perfis. Portanto, um usuário autenticado no Firebase ainda não recebe acesso à Zelora até que exista um processo administrativo seguro para provisionar sua linha em `users` e atribuir papéis. Não habilitar cadastro público nem inserir usuários automaticamente com papel privilegiado.

## Configuração

- `DATABASE_URL`: conexão PostgreSQL no backend.
- `AUTO_MIGRATE=false`: por padrão, migrações são executadas explicitamente pela CLI. Ativar `true` somente em ambiente no qual o processo da aplicação tenha permissão e janela operacional para migrar o schema.
- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL` e `FIREBASE_PRIVATE_KEY`: credenciais de serviço do Firebase Admin, somente no backend.
- `FIREBASE_AUTH_EMULATOR_HOST`: alternativa local para o emulador; exige `FIREBASE_PROJECT_ID`.

O projeto Firebase e o banco PostgreSQL ainda precisam ser provisionados por ambiente. Em desenvolvimento, a API e o Vite carregam o arquivo `.env` da raiz; crie-o copiando `.env.example`. Não colocar chaves, senhas, arquivos de service account ou URLs reais com credenciais no repositório. `.env.example` contém somente nomes de variáveis e instruções.

## Limites antes de produção

- Definir e testar o processo de provisionamento e desativação de usuários.
- Definir CORS com allowlist, rate limiting e limites de requisição.
- Definir auditoria de concessão/revogação de papéis e operações administrativas.
- Validar verificação de revogação de tokens e política de sessão conforme o risco do produto.
- Configurar segredos e rotação de credenciais por ambiente.
- Repetir os testes de integração em um banco de desenvolvimento provisionado; o CI já executa os testes contra PostgreSQL 18 efêmero e está verde.
- Revisar o modelo LGPD, retenção e controles de acesso antes de adicionar dados pessoais ou residenciais.
