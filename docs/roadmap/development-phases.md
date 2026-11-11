# Roadmap de desenvolvimento

## Fase 0 — Fundação e decisões
- [x] Criar repositório privado.
- [x] Documentar visão, requisitos, papéis e regras de negócio.
- [x] Registrar decisão inicial de arquitetura e stack.
- [x] Criar pesquisa de referências de mercado.
- [x] Preparar minutas de Termos de Uso e Política de Privacidade.
- [ ] Preencher dados da operadora e canais de contato.
- [ ] Revisão jurídica das minutas e validação dos fluxos reais.
- [ ] Fechar versões das dependências, runtime e hospedagem.
- [ ] Definir ambientes local, homologação e produção.

## Fase 1 — Fundação executável
- [x] Criar workspace npm com aplicação web React + Vite + TypeScript.
- [x] Criar esqueleto inicial da API Node.js + TypeScript e endpoint de saúde; a validação automatizada completa continua pendente.
- [ ] Expandir API REST com contratos, validação e tratamento padronizado de erros.
- [ ] Configurar PostgreSQL e migrações. _(schema, runner, histórico e migração inicial implementados; CI e execução em banco de desenvolvimento pendentes.)_
- [ ] Integrar Firebase Authentication e validação de token no backend. _(adaptador Admin e middleware implementados; CI e projeto Firebase real pendentes.)_
- [ ] Configurar lint, formatação, testes de integração e CI. _(workflow criado; typecheck passou, mas a primeira execução falhou antes de executar os testes. Correção enviada; nova execução pendente.)_
- [x] Versionar package-lock.json. (npm ci passou na primeira execução do GitHub Actions.)
- [ ] Configurar gestão de variáveis e segredos.

## Fase 2 — Identidade e perfis
- [ ] Cadastro, login, recuperação de senha e verificação de e-mail.
- [ ] Perfis de contratante e profissional.
- [ ] Serviços, preços, regiões, portfólio e disponibilidade.
- [ ] Controles de privacidade e consentimentos/avisos aplicáveis.

## Fase 3 — Descoberta e contratação
- [ ] Residências e proteção de endereços.
- [ ] Busca e filtros.
- [ ] Solicitações, estados e contrapropostas.
- [ ] Chat e notificações.

## Fase 4 — Organização e confiança
- [ ] Agenda e disponibilidade.
- [ ] Avaliações e reputação.
- [ ] Favoritos e recorrência.
- [ ] Denúncias, bloqueios e moderação.

## Fase 5 — Operação e monetização
- [ ] Painéis administrativos.
- [ ] Relatórios financeiros.
- [ ] Planos e limites.
- [ ] Teste Premium e assinaturas, após validação comercial.

## Fase 6 — Qualidade e lançamento
- [ ] Testes funcionais, integração, segurança e acessibilidade.
- [ ] Revisão LGPD e documentos legais finais.
- [ ] Backups e plano de recuperação.
- [ ] Homologação com usuários-piloto.
- [ ] Publicação gradual e monitoramento.

## Fase futura — Aplicativos móveis
- [ ] Aplicativo React Native + Expo para Android e iOS.
- [ ] Reutilização da API, contratos, validações e serviços compatíveis.
- [ ] Push notifications e recursos nativos.
- [ ] Publicação e manutenção nas lojas.

## Regra de aceite
Cada item precisa de critérios de aceite, testes e evidência de funcionamento antes de ser marcado como concluído.
