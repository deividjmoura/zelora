# Zelora — Política de Privacidade

**Minuta de trabalho — não publicar sem revisão jurídica e preenchimento dos campos pendentes.**  
Versão: 0.1 | Data da minuta: 10/11/2026

> Este documento é uma base de discussão e implementação, não constitui aconselhamento jurídico. Antes de disponibilizar a plataforma ao público, a Zelora deverá identificar a pessoa jurídica controladora, confirmar todos os fluxos reais de dados, definir bases legais e prazos de retenção e submeter o texto à revisão de profissional habilitado em direito digital e proteção de dados.

## 1. Quem somos e como falar conosco

A plataforma Zelora ("Zelora", "nós" ou "Plataforma") conecta pessoas que procuram serviços domésticos ("Contratantes") a profissionais independentes que oferecem esses serviços ("Profissionais").

- Controlador: **[RAZÃO SOCIAL A DEFINIR]**
- CNPJ: **[CNPJ A DEFINIR]**
- Endereço: **[ENDEREÇO COMERCIAL A DEFINIR]**
- Canal de privacidade: **[E-MAIL DE PRIVACIDADE A DEFINIR]**
- Encarregado pelo tratamento de dados, quando aplicável: **[IDENTIFICAÇÃO/CANAL A DEFINIR]**

Não publique esta política enquanto esses dados estiverem em aberto.

## 2. A quem esta política se aplica

Aplica-se a visitantes, Contratantes, Profissionais e pessoas que interajam com o suporte da Zelora por meio do site, dos aplicativos futuros ou de outros canais oficiais.

A plataforma é destinada a maiores de 18 anos. Não solicitamos intencionalmente cadastro de crianças ou adolescentes.

## 3. Dados que podemos tratar

A coleta dependerá da funcionalidade utilizada e deverá respeitar o princípio da necessidade.

| Categoria | Exemplos | Finalidade principal |
|---|---|---|
| Cadastro e conta | nome, e-mail, telefone, data de nascimento, papel na plataforma | criar e proteger a conta, prestar o serviço |
| Autenticação | identificador Firebase, registros de acesso e segurança | autenticar, prevenir fraude e recuperar conta |
| Identidade | CPF e dados estritamente necessários à validação, quando justificado | validação de identidade, prevenção de fraude e regra de um teste Premium por pessoa |
| Perfil profissional | foto, apresentação, experiência, serviços, preços, regiões atendidas e portfólio | publicar perfil e permitir que clientes encontrem profissionais |
| Residências | endereço, instruções de acesso e dados do imóvel informados pelo Contratante | organizar e realizar contratações |
| Contratação | serviço, data, horário, valor combinado, estado e histórico | conectar as partes e registrar acordos |
| Comunicação | mensagens, anexos e metadados do chat | permitir comunicação, suporte, segurança e resolução de disputas |
| Agenda | disponibilidade, compromissos e recorrências | evitar conflitos e organizar serviços |
| Reputação | notas, avaliações, respostas e denúncias | exibir experiências e moderar abusos |
| Assinatura | plano, status, datas, transações e identificador do provedor | administrar teste e assinatura |
| Uso técnico | IP, dispositivo, navegador, logs, cookies e eventos | segurança, diagnóstico, métricas e funcionamento |

Não coletaremos dados sensíveis, documentos, biometria ou dados bancários por padrão. Qualquer funcionalidade que venha a exigir esses dados deverá passar por avaliação específica de necessidade, base legal, segurança e transparência antes de ser lançada.

## 4. Para que usamos os dados e bases legais

Conforme o caso concreto, poderemos tratar dados para:
- criar e administrar a conta e executar funcionalidades solicitadas, com fundamento na execução de contrato ou procedimentos preliminares;
- autenticar usuários, prevenir fraude e proteger contas e transações, com fundamento legal apropriado e avaliação de necessidade;
- cumprir obrigações legais, regulatórias e ordens válidas;
- exercer ou defender direitos em processos;
- responder solicitações e prestar suporte;
- melhorar a plataforma com métricas proporcionais, preferencialmente agregadas ou anonimizadas;
- enviar comunicações operacionais necessárias ao serviço;
- enviar marketing quando houver base legal válida, respeitando preferências e descadastramento.

Quando o tratamento depender de consentimento, ele será específico, destacado, informado e revogável. O uso de uma funcionalidade não será tratado como consentimento genérico para qualquer finalidade.

## 5. Perfis públicos e dados privados

O perfil profissional poderá exibir ao público apenas os campos escolhidos e necessários para a divulgação do serviço, como nome de exibição, foto, apresentação, serviços, faixa de preço, região aproximada, disponibilidade disponibilizada e avaliações publicáveis.

Não exibiremos publicamente CPF, e-mail, telefone privado, endereço residencial completo, documentos, mensagens ou dados de autenticação.

O endereço completo de uma residência será tratado como informação restrita. O acesso pelo Profissional deverá ocorrer apenas quando necessário à contratação e conforme o estado do pedido, com informação clara às partes. A Zelora deverá evitar revelar localização exata antes da confirmação do serviço.

## 6. Chat, avaliações e segurança

Mensagens e metadados do chat serão acessíveis às partes da conversa e a pessoas autorizadas da Zelora quando necessário para suporte, investigação de denúncia, segurança ou cumprimento de obrigação legal, com controles de acesso e registro de operações.

Avaliações deverão estar vinculadas a uma contratação elegível. A pessoa avaliada não poderá apagar unilateralmente uma avaliação recebida. O autor poderá solicitar revisão; a Zelora poderá ocultar ou remover conteúdo que viole regras, contenha dados pessoais indevidos, ameaças, discriminação, fraude ou ilegalidade. Decisões de moderação deverão ser justificadas e registradas, com canal de contestação quando apropriado.

Não fotografe, filme ou divulgue residência, pertences, documentos ou imagem de outra pessoa sem autorização adequada. A Zelora poderá remover conteúdo e aplicar medidas proporcionais em caso de violação.

## 7. CPF e teste Premium de 15 dias

A proposta comercial é conceder um teste Premium de 15 dias, sem exigir cartão de crédito antecipado, uma única vez por pessoa. Ao final, a conta retorna ao plano gratuito se não houver assinatura; o usuário não perde acesso às funcionalidades essenciais.

A implementação deverá:
- informar claramente a finalidade da validação do CPF e a regra de elegibilidade antes da coleta;
- coletar CPF somente se for considerado necessário e proporcional após avaliação jurídica;
- restringir o acesso ao dado bruto a funções autorizadas, protegê-lo por criptografia e não o exibir no perfil;
- avaliar tokenização ou índice criptográfico com chave secreta para detectar reutilização, sem tratar hash simples como anonimização;
- definir prazo de retenção e descarte do CPF bruto;
- oferecer canal para correção e contestação de divergências;
- não bloquear o acesso à plataforma gratuita por falta de pagamento;
- não reutilizar o CPF para publicidade ou finalidades incompatíveis.

A base legal e a necessidade dessa verificação precisam ser confirmadas antes do lançamento. Não se deve presumir que a regra comercial, por si só, autoriza qualquer retenção de CPF.

## 8. Compartilhamento e operadores

Poderemos compartilhar dados estritamente necessários:
- entre Contratante e Profissional envolvidos em uma solicitação ou contratação;
- com provedores que hospedem a aplicação, banco de dados, autenticação, envio de e-mails/notificações, armazenamento, mapas, prevenção a fraude e cobrança de assinaturas;
- com suporte e prestadores contratados, sob deveres de confidencialidade e segurança;
- com autoridades, quando houver obrigação ou fundamento legal válido;
- em reorganização societária, com salvaguardas e comunicação cabíveis.

Não vendemos dados pessoais. Não autorizamos provedores a usar os dados da Zelora para finalidades próprias incompatíveis com a prestação contratada.

A lista de fornecedores, países de armazenamento e mecanismos de transferência internacional deverá ser mantida atualizada e disponibilizada de forma transparente.

## 9. Cookies e tecnologias semelhantes

A versão web poderá utilizar cookies estritamente necessários para autenticação, segurança e funcionamento. Cookies de análise, publicidade ou personalização não essenciais deverão depender de escolha válida do usuário, quando exigido, com opção de rejeitar e alterar preferências. A aplicação deverá oferecer aviso e mecanismo de gestão compatíveis com a legislação aplicável.

## 10. Retenção e descarte

Guardaremos dados apenas pelo período necessário às finalidades informadas, considerando obrigações legais, segurança, prevenção a fraude e exercício regular de direitos. Os prazos específicos por categoria serão definidos em uma tabela interna de retenção antes do lançamento.

Quando a finalidade terminar, os dados serão eliminados ou anonimizados, salvo hipóteses legais que autorizem sua conservação. Backups terão ciclo de expiração definido e controles de acesso.

## 11. Direitos dos titulares

Nos termos da LGPD, o titular poderá solicitar, conforme aplicável:
- confirmação da existência de tratamento e acesso aos dados;
- correção de dados incompletos, inexatos ou desatualizados;
- anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade;
- portabilidade, observados os regulamentos e segredos protegidos;
- informação sobre compartilhamentos;
- informação sobre a possibilidade de não consentir e consequências;
- revogação do consentimento;
- revisão de decisões tomadas unicamente com base em tratamento automatizado, nos termos legais.

Solicitações poderão ser encaminhadas a **[E-MAIL DE PRIVACIDADE]**. Poderemos solicitar informações proporcionais para confirmar a identidade do solicitante e proteger os dados contra acesso indevido.

## 12. Segurança e incidentes

Adotaremos medidas técnicas e administrativas proporcionais aos riscos, incluindo controle de acesso por função, autenticação segura, criptografia em trânsito e em repouso quando disponível, gestão de segredos, backups, logs protegidos, atualização de dependências, testes e plano de resposta a incidentes.

Em caso de incidente com risco ou dano relevante, a Zelora avaliará e realizará as comunicações à ANPD e aos titulares nos prazos e condições definidos pela regulamentação aplicável.

## 13. Transferências internacionais

Alguns fornecedores podem processar dados fora do Brasil. Antes de habilitar cada fornecedor, a Zelora deverá identificar países, suboperadores, medidas contratuais e mecanismo válido de transferência internacional, informando os titulares de maneira adequada.

## 14. Alterações desta política

Podemos atualizar esta política para refletir mudanças no serviço, na legislação ou nas operações. Mudanças relevantes serão comunicadas de forma destacada, com indicação da versão e data. Quando necessário, solicitaremos novo consentimento.

## 15. Contato

Dúvidas e solicitações de privacidade: **[E-MAIL DE PRIVACIDADE A DEFINIR]**.

---

## Pendências obrigatórias antes da publicação

- [ ] Definir razão social, CNPJ, endereço e canal de privacidade.
- [ ] Definir controlador, operadores e encarregado, conforme aplicável.
- [ ] Mapear dados reais coletados por cada tela, SDK e fornecedor.
- [ ] Confirmar bases legais por finalidade.
- [ ] Avaliar formalmente a necessidade de CPF para teste único e definir retenção.
- [ ] Definir tabela de retenção e descarte, inclusive chat, denúncias e logs.
- [ ] Revisar cookies, analytics e consentimento.
- [ ] Mapear transferência internacional e contratos com fornecedores.
- [ ] Definir processo de atendimento aos direitos dos titulares.
- [ ] Validar segurança, resposta a incidentes e controles administrativos.
- [ ] Revisão final por advogado(a) com experiência em LGPD e marketplace.
