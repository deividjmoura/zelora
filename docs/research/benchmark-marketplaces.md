# Benchmark de marketplaces — aprendizados para a Zelora

Data da pesquisa: 10/11/2026  
Objetivo: identificar padrões públicos de plataformas de serviços domésticos e marketplaces e traduzi-los em requisitos próprios. Este material não substitui análise jurídica e não recomenda copiar textos de terceiros.

## Fontes consultadas

1. GetNinjas — Política de Privacidade: https://www.getninjas.com.br/politica-de-privacidade/site
2. GetNinjas — Política de Privacidade para diaristas: https://diarista.getninjas.com.br/politica-de-privacidade
3. Parafuzo — Termos de Uso: https://parafuzo.com/termos-de-uso/
4. Parafuzo — Política de Privacidade: https://taskerapp.parafuzo.com/politicas-privacidade/
5. Parafuzo — orientação de segurança sobre fotos, vídeos e áudios em locais de serviço: https://blog.parafuzo.com/%E2%9A%A0%EF%B8%8F-seguranca-nao-compartilhe-fotos-videos-e-audios-dos-locais-de-prestacao-de-servico/
6. Taskrabbit — Overview of Trust and Safety: https://support.taskrabbit.com/hc/en-us/articles/46260491906203-Overview-of-Trust-and-Safety
7. ANPD — Direitos dos Titulares: https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados/direito-dos-titulares
8. ANPD — Perguntas Frequentes sobre LGPD: https://www.gov.br/anpd/pt-br/acesso-a-informacao/perguntas-frequentes
9. Lei nº 13.709/2018 (LGPD), texto atualizado: https://www2.camara.leg.br/legin/fed/lei/2018/lei-13709-14-agosto-2018-787077-normaatualizada-pl.html

## Padrões observados

### GetNinjas
A política consultada descreve categorias de dados de cadastro e navegação, uso para identificação, funcionamento, localização aproximada, prevenção a fraude, suporte, métricas e comunicação. Também descreve compartilhamentos com prestadores envolvidos na operação e retenção para obrigações legais.

**Aplicação na Zelora:** manter inventário por categoria, finalidade e destinatário; explicar separadamente dados de cadastro, perfil público, localização, uso técnico e suporte; limitar compartilhamento ao necessário para uma solicitação.

### Parafuzo
Os Termos distinguem Cliente e Profissional, descrevem a plataforma como software/serviço de conexão e explicam que os serviços são prestados diretamente pelos profissionais. O texto também detalha conta, solicitações, remuneração e regras da relação. A política de privacidade descreve dados de cadastro, localização, histórico, avaliações e mensagens. Há orientação pública explícita para não registrar ou divulgar imagens/áudios do local de serviço sem autorização.

**Aplicação na Zelora:** explicar claramente papéis e responsabilidades; registrar escopo, preço, data e condições acordadas; tratar endereço e conteúdo do chat como dados restritos; proibir publicação de imagens de residências e pessoas sem autorização; definir regras próprias para assinatura e eventual remuneração.

A Parafuzo usa modelo comercial próprio com assinatura e comissão. A Zelora não deve copiar seus preços ou sua obrigatoriedade de assinatura: nosso planejamento prevê Free funcional para ambos os lados e planos opcionais com recursos avançados.

### Taskrabbit
A página pública de confiança e segurança descreve tratamento cuidadoso de informações pessoais, checagens de identidade e antecedentes em determinados mercados, proteção/assistência e canal para disputas. A disponibilidade e o escopo variam por país.

**Aplicação na Zelora:** comunicar precisamente qualquer verificação feita, sem prometer checagem que não exista; planejar canal de suporte e fluxo de incidentes/disputas; avaliar futuramente verificações de identidade proporcionais e juridicamente adequadas no Brasil.

## Requisitos derivados para a Zelora

1. **Transparência do marketplace:** explicar o papel da Zelora e o papel de cada parte sem tentar afastar direitos legais por cláusula genérica.
2. **Perfis públicos mínimos:** exibir somente dados necessários para descoberta e decisão de contratação.
3. **Endereço protegido:** não expor endereço residencial completo em busca ou perfil público; revelar apenas quando necessário e autorizado conforme a contratação.
4. **Chat com governança:** acesso restrito às partes, suporte autorizado e política clara de denúncia/retensão.
5. **Privacidade no local:** vedar fotos, vídeos e gravações de pessoas, residências e pertences sem autorização adequada.
6. **Reputação verificável:** permitir avaliações apenas após contratação elegível, resposta e moderação com justificativa.
7. **Segurança e suporte:** canal de denúncia, medidas graduais, processo de contestação e resposta a incidentes.
8. **Planos transparentes:** limites, preço, renovação, cancelamento e benefícios exibidos antes da compra; o fim do teste não bloqueia o plano gratuito.
9. **Dados pessoais minimizados:** coletar CPF somente após justificar necessidade, base legal, acesso, segurança e retenção.
10. **Fornecedores:** mapear hospedagem, autenticação, analytics, e-mail, mapas e cobrança, incluindo transferências internacionais.

## Alertas jurídicos

- Não copiar cláusulas de concorrentes: textos, modelos de negócio e obrigações são específicos de cada operação.
- Uma cláusula dizendo que o profissional é autônomo não resolve sozinha a classificação jurídica da relação; a prática operacional importa.
- Uma política de privacidade deve refletir os SDKs, cookies, dados, fornecedores e telas efetivamente usados pela Zelora.
- Não presumir consentimento como base legal universal. Definir a base adequada para cada finalidade.
- A regra de um teste por CPF precisa de análise de necessidade e proporcionalidade, prazo de retenção, segurança e mecanismo de contestação.
- Não prometer background check, seguro, garantia, mediação ou proteção financeira enquanto esses serviços não existirem e não houver regras operacionais.
