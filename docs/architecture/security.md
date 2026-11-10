# Segurança, privacidade e LGPD

## Princípios
- Coletar somente os dados necessários para finalidades claras.
- Informar finalidade, base legal, retenção e compartilhamentos.
- Implementar direitos dos titulares e canal de contato.
- Aplicar menor privilégio e autorização no servidor.
- Proteger dados em trânsito e em repouso.
- Manter trilhas de auditoria para ações sensíveis.

## Controles mínimos
- Firebase Authentication para autenticação; backend valida ID tokens com Firebase Admin SDK.
- Hash seguro apenas para credenciais locais que eventualmente venham a existir; nunca armazenar senhas em texto puro.
- Verificação de e-mail/telefone com tokens de uso limitado e expiração.
- Validação e proteção especial de CPF.
- Controle de acesso por papel e por recurso, sempre no backend.
- Rate limiting em autenticação, mensagens, busca e solicitações.
- Validação de entrada e proteção contra XSS, CSRF, SQL injection e exposição de segredos.
- Validação de uploads, tipo, tamanho e conteúdo de arquivos.
- Logs sem conteúdo de mensagens, documentos, CPF ou endereço completo, salvo necessidade justificada e acesso restrito.
- Backups protegidos e teste periódico de restauração.
- Gestão de incidentes, procedimento de resposta e registro pelo período legal aplicável.

## Dados especialmente protegidos
CPF, endereço residencial, telefone, mensagens e documentos de identidade exigem acesso restrito, logs cuidadosos, minimização e retenção justificada.

## Incidentes
A Zelora deverá avaliar incidentes confirmados que envolvam dados pessoais e, quando puderem acarretar risco ou dano relevante, comunicar ANPD e titulares conforme a Resolução CD/ANPD nº 15/2024 e prazos aplicáveis. Manter registro dos incidentes conforme a regulamentação.

## Observação
Este documento é uma base técnica e não substitui revisão jurídica especializada dos termos, políticas, bases legais e procedimentos de resposta.
