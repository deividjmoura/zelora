# Zelora

Marketplace digital que conecta pessoas que procuram serviços domésticos a profissionais independentes, com foco em confiança, transparência, organização e privacidade.

## Visão do produto

A Zelora começa como aplicação web responsiva. A arquitetura será preparada desde o início para aplicativos Android e iOS com React Native + Expo, reaproveitando contratos, tipos, validações, cliente da API e regras puras sempre que fizer sentido.

## Stack planejada

- Web: React + Vite + TypeScript
- UI: Tailwind CSS
- API: Node.js + TypeScript
- Banco: PostgreSQL
- Autenticação: Firebase Authentication
- Mobile futuro: React Native + Expo

## Módulos do produto

- Cadastro, autenticação e papéis
- Perfis de Contratantes e Profissionais
- Serviços, preços, regiões e disponibilidade
- Residências e endereços protegidos
- Busca, filtros e favoritos
- Solicitações, negociação e contratação
- Chat interno
- Agenda, recorrência e histórico
- Avaliações e reputação
- Notificações
- Planos Free, Pro e Plus
- Teste Premium de 15 dias, sem cartão antecipado
- Administração, suporte, denúncias e auditoria
- Privacidade, segurança e direitos LGPD

## Estrutura documental

- [Visão do produto](docs/product/vision.md)
- [Papéis e permissões](docs/product/user-roles.md)
- [Regras de negócio](docs/product/business-rules.md)
- [Requisitos](docs/product/requirements.md)
- [Visão de arquitetura](docs/architecture/overview.md)
- [Decisões técnicas](docs/architecture/technical-decisions.md)
- [Política de Privacidade — minuta](docs/legal/politica-de-privacidade.md)
- [Termos de Uso — minuta](docs/legal/termos-de-uso.md)
- [Benchmark de mercado](docs/research/benchmark-marketplaces.md)
- [Roadmap inicial](docs/roadmap/initial-roadmap.md)

## Estado atual

Este repositório contém documentação de produto, arquitetura, pesquisa e minutas jurídicas. A aplicação ainda não foi implementada. A Política de Privacidade e os Termos são documentos de trabalho e não devem ser publicados antes de preencher os dados da pessoa jurídica, validar os fluxos reais e obter revisão jurídica.

## Princípios de desenvolvimento

1. Regras de negócio e autorização no backend.
2. Não confiar em dados ou permissões enviados pelo frontend.
3. Nunca expor CPF, endereços completos, mensagens ou credenciais em perfis públicos/logs.
4. Funcionalidades essenciais de contratar, trabalhar, conversar e usar recursos de segurança permanecem no plano gratuito.
5. Encerrado o teste Premium, a conta retorna ao Free; não há bloqueio geral por falta de pagamento.
6. Cada módulo deve ter persistência, testes e documentação, não apenas telas.
