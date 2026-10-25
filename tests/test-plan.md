# Plano de Testes — Elevare PDI

Este documento registra os testes planejados, critérios de aceitação e os resultados reais de execução para cada fase de desenvolvimento.

---

## 1. Critérios de Aceitação Obrigatórios da Fase 1

- [ ] **T01 — Inicialização Idempotente do Banco:** Executar `setupApplication()` deve criar a planilha caso não exista, criar as 15 abas com cabeçalhos exatos e não duplicar nada nem apagar dados ao ser executado uma segunda vez.
- [ ] **T02 — Armazenamento Seguro de Propriedades:** O ID da planilha deve ser gravado em `ScriptProperties` e não ser exposto para o frontend.
- [ ] **T03 — Verificação de Conectividade:** A função `pingDatabase()` deve validar se a planilha está acessível e retornar o status das abas e contagem de registros.
- [ ] **T04 — Gravação e Leitura Real (CRUD Base):** Inserir um registro de teste na aba `CONFIG` ou `HISTORICO`, ler o registro de volta pelo ID e confirmar integridade de campos e timestamps (`created_at`, `updated_at`).
- [ ] **T05 — Tratamento de Erros e Timeouts:** Requisições inválidas ou tabelas não permitidas devem ser rejeitadas com mensagens seguras e compreensíveis.
- [ ] **T06 — Bloqueio de Concorrência (LockService):** Operações de escrita devem respeitar o lock de script.

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
