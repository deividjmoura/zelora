# Requisitos funcionais e não funcionais

## Requisitos funcionais
- RF-01: cadastro, login, logout e recuperação de senha.
- RF-02: verificação de e-mail e telefone e fluxo de validação de CPF.
- RF-03: aceite e versionamento de termos e política de privacidade.
- RF-04: criação e edição de perfis de contratante e profissional.
- RF-05: cadastro de serviços, preços, regiões, portfólio e disponibilidade.
- RF-06: cadastro e gestão de múltiplas residências.
- RF-07: busca de profissionais com filtros por região, distância, serviço, preço, disponibilidade, experiência e avaliações.
- RF-08: envio, aceite, recusa, contraproposta e cancelamento de solicitações.
- RF-09: chat interno vinculado às solicitações.
- RF-10: agendas diária, semanal e mensal, com bloqueios e recorrência.
- RF-11: avaliações mútuas vinculadas a contratações elegíveis.
- RF-12: favoritos e profissionais/clientes recorrentes.
- RF-13: notificações no produto e, quando configurado, por canais externos.
- RF-14: planos, limites, teste Premium e histórico de assinatura.
- RF-15: painel administrativo, denúncias, suporte, moderação e auditoria.
- RF-16: relatórios financeiros informativos para cada papel.

## Requisitos não funcionais
- RNF-01: autorização no servidor em todas as operações privadas.
- RNF-02: proteção de dados pessoais e conformidade com a LGPD.
- RNF-03: senhas armazenadas com algoritmo moderno de hash; nunca em texto puro.
- RNF-04: validação de entrada no servidor e proteção contra abuso.
- RNF-05: logs sem exposição desnecessária de dados sensíveis.
- RNF-06: interface responsiva, acessível e adequada a dispositivos móveis.
- RNF-07: testes automatizados para regras críticas e permissões.
- RNF-08: migrações de banco versionadas e reversíveis quando possível.
- RNF-09: backups e estratégia de recuperação documentados.
- RNF-10: observabilidade de erros, desempenho e eventos críticos.

## Critério de conclusão
Um módulo não será considerado concluído apenas por possuir telas. Deve incluir persistência, validação, autorização, estados de erro/carregamento, testes relevantes e documentação operacional.
