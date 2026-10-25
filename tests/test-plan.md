# Plano de Testes — Elevare PDI

Este documento registra os testes planejados, critérios de aceitação e os resultados reais de execução para cada fase de desenvolvimento.

---

## 1. Critérios de Aceitação Obrigatórios da Fase 1

- [x] **T01 — Inicialização Idempotente do Banco:** `setupDatabase()` cria a planilha caso não exista, estrutura as 15 abas com cabeçalhos exatos e não duplica nada nem apaga dados ao ser executada novamente.
- [x] **T02 — Armazenamento Seguro de Propriedades:** O ID da planilha fica gravado exclusivamente em `ScriptProperties` e não é exposto para o frontend.
- [x] **T03 — Verificação de Conectividade:** `pingDatabase()` valida se a planilha está acessível e retorna o status das abas e contagem de registros em tempo real.
- [x] **T04 — Bateria dos 7 Testes de Persistência Real:** Função `apiRunFullPersistenceValidation()` e `runDatabaseDiagnostics()` validam:
  1. Conexão com a planilha
  2. Leitura dos cabeçalhos
  3. Criação de registro de teste (`TEST_`)
  4. Leitura imediata do registro criado
  5. Atualização desse registro
  6. Exclusão física do registro de teste
  7. Confirmação de preservação dos demais registros (contagem idêntica)
- [x] **T05 — Tratamento de Erros e Timeouts:** Requisições inválidas ou tabelas não permitidas são rejeitadas por `Security.gs` com mensagens seguras e compreensíveis.
- [x] **T06 — Bloqueio de Concorrência (LockService):** Operações críticas de escrita utilizam `LockService.getScriptLock()` com espera de até 30s.


---

## 2. Matriz dos 25 Testes do Projeto

| ID | Cenário de Teste | Fase Prevista | Status |
|---|---|---|---|
| T01 | Inicialização do banco (15 abas) | Fase 1 | ⏳ Pendente de execução |
| T02 | Criação de um registro real | Fase 1 | ⏳ Pendente de execução |
| T03 | Leitura do registro | Fase 1 | ⏳ Pendente de execução |
| T04 | Edição do registro | Fase 1 / Fase 4 | ⏳ Planejado |
| T05 | Arquivamento de registro | Fase 4 | ⏳ Planejado |
| T06 | Exclusão com confirmação | Fase 4 | ⏳ Planejado |
| T07 | Validação de campos obrigatórios | Fase 1 / Fase 4 | ⏳ Em validação |
| T08 | Tratamento de falha do backend | Fase 1 | ⏳ Em validação |
| T09 | Persistência após recarregar a página | Fase 1 / Fase 2 | ⏳ Planejado |
| T10 | Persistência após nova publicação | Fase 1 / Fase 10 | ⏳ Planejado |
| T11 | Pesquisa e filtros | Fase 3 / Fase 8 | ⏳ Planejado |
| T12 | Exportação CSV | Fase 8 | ⏳ Planejado |
| T13 | Exportação JSON | Fase 8 | ⏳ Planejado |
| T14 | Criação de feedback | Fase 5 | ⏳ Planejado |
| T15 | Criação de competência | Fase 5 | ⏳ Planejado |
| T16 | Associação de feedback e competência | Fase 5 | ⏳ Planejado |
| T17 | Criação de meta e ações | Fase 5 | ⏳ Planejado |
| T18 | Atualização de progresso | Fase 5 | ⏳ Planejado |
| T19 | Cadastro de livro | Fase 6 | ⏳ Planejado |
| T20 | Alteração do progresso de leitura | Fase 6 | ⏳ Planejado |
| T21 | Funcionamento da estante 3D | Fase 6 | ⏳ Planejado |
| T22 | Personalização dos módulos | Fase 4 | ⏳ Planejado |
| T23 | Responsividade em celular, tablet e desktop | Fase 2 | ⏳ Planejado |
| T24 | Proteção contra alterações concorrentes | Fase 1 | ⏳ Em validação |
| T25 | Verificação de que nenhum dado é apagado nas atualizações | Contínuo | ⏳ Contínuo |
