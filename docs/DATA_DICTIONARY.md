# Dicionário de Dados — Elevare PDI

Este documento especifica a estrutura do banco de dados relacional baseado em Google Sheets do **Elevare PDI**.

---

## 1. Princípios de Modelagem no Google Sheets

- **Mapeamento por Cabeçalho:** As colunas são lidas e escritas pelo nome do cabeçalho na primeira linha (Linha 1), nunca por índice fixo de coluna (A, B, C...).
- **Identificadores Únicos e Estáveis:** Todo registro possui uma coluna `id` preenchida com UUID estável gerado no momento da criação.
- **Rastreabilidade Temporal:** Todo registro possui `created_at` e `updated_at` em formato ISO 8601 (`YYYY-MM-DDTHH:mm:ss.sssZ`).
- **Campos Customizados:** Campos criados dinamicamente pelo usuário são persistidos na coluna `custom_fields` em formato JSON (`{"chave": "valor"}`), garantindo flexibilidade sem alterar as colunas essenciais do banco de dados.
- **Concorrência Protegida:** Toda escrita utiliza `LockService.getScriptLock()` para evitar condições de corrida (*race conditions*).

---

## 2. Relação de Abas e Esquema de Dados

### 2.1. CONFIG
Armazena parâmetros gerais de configuração do sistema e do usuário.

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
|---|---|---|---|---|
| `chave` | String (PK) | Sim | Nome identificador único da configuração | `APP_NAME`, `THEME_DEFAULT` |
| `valor` | String/JSON | Sim | Valor armazenado | `"Elevare PDI"`, `"dark"` |
| `descricao` | String | Não | Finalidade da configuração | `"Tema visual padrão"` |
| `tipo` | String | Sim | `string`, `number`, `boolean`, `json` | `"string"` |
| `created_at` | String | Sim | Data e hora de criação | `2026-10-25T19:50:00.000Z` |
| `updated_at` | String | Sim | Data e hora da última alteração | `2026-10-25T19:50:00.000Z` |

---

### 2.2. MODULOS
Controle de ativação, ordenação e nomenclatura dos módulos do sistema.

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
|---|---|---|---|---|
| `id` | String (PK) | Sim | Identificador único do módulo | `mod_metas`, `mod_biblioteca` |
| `nome` | String | Sim | Nome exibido na interface | `"Metas & Ações"`, `"Biblioteca 3D"` |
| `icone` | String | Sim | Identificador visual do ícone | `"target"`, `"book-open"` |
| `ativo` | Boolean | Sim | Se o módulo está ativado na navegação | `TRUE` ou `FALSE` |
| `ordem` | Number | Sim | Ordem de exibição no menu | `1`, `2`, `3` |
| `descricao` | String | Não | Descrição do módulo | `"Gestão de metas e plano de ação"` |
| `created_at` | String | Sim | Data/hora de criação | ISO 8601 |
| `updated_at` | String | Sim | Data/hora da última alteração | ISO 8601 |

---

### 2.3. CAMPOS_CUSTOM
Definição dos campos dinâmicos criados pelo usuário para cada módulo.

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
|---|---|---|---|---|
| `id` | String (PK) | Sim | UUID do campo customizado | `uuid` |
| `modulo_id` | String (FK) | Sim | ID do módulo a que pertence | `mod_feedbacks` |
| `campo_nome` | String | Sim | Rótulo exibido para o usuário | `"Área de Negócio"` |
| `campo_chave` | String | Sim | Identificador em snake_case | `"area_negocio"` |
| `tipo` | String | Sim | `text`, `number`, `date`, `select`, `multiselect`, `boolean`, `url` | `"select"` |
| `obrigatorio` | Boolean | Sim | Se o preenchimento é obrigatório | `TRUE` |
| `opcoes` | String | Não | Lista de opções (separada por vírgula ou JSON) | `"Tech, Produto, RH"` |
| `ativo` | Boolean | Sim | Se o campo está ativo | `TRUE` |
| `ordem` | Number | Sim | Posição de ordenação no formulário | `1` |
| `created_at` | String | Sim | Data/hora de criação | ISO 8601 |
| `updated_at` | String | Sim | Data/hora da última alteração | ISO 8601 |

---

### 2.4. FEEDBACKS
Registros detalhados de feedbacks recebidos e seus desdobramentos.

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
|---|---|---|---|---|
| `id` | String (PK) | Sim | UUID | `uuid` |
| `titulo` | String | Sim | Título resumo do feedback | `"Alinhamento Q3 com a Gestora"` |
| `data` | String | Sim | Data do feedback (YYYY-MM-DD) | `"2026-10-15"` |
| `origem` | String | Sim | Gestora, Par, Autoavaliação, Cliente, Liderados | `"Gestora"` |
| `contexto` | String | Não | Situação ou projeto em que ocorreu | `"Entrega do projeto X"` |
| `descricao` | String | Não | Conteúdo principal do feedback | `"Excelente liderança técnica..."` |
| `pontos_fortes` | String | Não | Destaques positivos | `"Comunicação clara, pontualidade"` |
| `oportunidades_melhoria` | String | Não | Pontos a desenvolver | `"Delegação de tarefas operacionais"` |
| `competencias_relacionadas` | JSON Array | Não | Lista de IDs de competências associadas | `["comp-1", "comp-2"]` |
| `acoes_acordadas` | String | Não | Ações combinadas na conversa | `"Montar matriz de delegação"` |
| `prazo_acompanhamento` | String | Não | Próxima revisão (YYYY-MM-DD) | `"2026-11-15"` |
| `status` | String | Sim | `novo`, `em_acompanhamento`, `concluido`, `arquivado` | `"em_acompanhamento"` |
| `prioridade` | String | Sim | `baixa`, `media`, `alta` | `"alta"` |
| `tema` | String | Não | Categoria temática | `"Liderança"` |
| `observacoes_privadas` | String | Não | Notas de reflexão pessoal | `"Aprofundar nas reuniões 1:1"` |
| `custom_fields` | JSON | Não | Dados de campos customizados | `{"area_negocio": "Tech"}` |
| `created_at` | String | Sim | Data/hora de criação | ISO 8601 |
| `updated_at` | String | Sim | Data/hora da última alteração | ISO 8601 |

---

### 2.5. COMPETENCIAS
Catálogo de Hard e Soft Skills com autoavaliação e metas de evolução.

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
|---|---|---|---|---|
| `id` | String (PK) | Sim | UUID | `uuid` |
| `nome` | String | Sim | Nome da competência | `"Comunicação Assertiva"` |
| `tipo` | String | Sim | `hard_skill` ou `soft_skill` | `"soft_skill"` |
| `categoria` | String | Não | Agrupamento funcional | `"Liderança"` |
| `descricao` | String | Não | Descrição detalhada da habilidade | `"Capacidade de alinhar expectativas"` |
| `nivel_atual` | Number | Sim | Escala 1 a 5 | `3` |
| `nivel_desejado` | Number | Sim | Escala 1 a 5 | `5` |
| `importancia` | String | Sim | `baixa`, `media`, `alta`, `critica` | `"critica"` |
| `meta_desenvolvimento` | String | Não | O que precisa ser feito para evoluir | `"Praticar feedback não violento"` |
| `evidencias_resumo` | String | Não | Resumo dos fatos que comprovam o nível | `"Apresentações em fóruns técnicos"` |
| `ultima_avaliacao_data` | String | Não | Data da última revisão (YYYY-MM-DD) | `"2026-10-01"` |
| `proxima_revisao_data` | String | Não | Próxima data de revisão (YYYY-MM-DD) | `"2026-12-01"` |
| `status` | String | Sim | `ativa`, `em_desenvolvimento`, `dominada`, `arquivada` | `"em_desenvolvimento"` |
| `custom_fields` | JSON | Não | Valores de campos dinâmicos | `{}` |
| `created_at` | String | Sim | Data/hora de criação | ISO 8601 |
| `updated_at` | String | Sim | Data/hora da última alteração | ISO 8601 |

---

### 2.6. AVALIACOES
Histórico imutável de avaliações de competências ao longo do tempo.

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
|---|---|---|---|---|
| `id` | String (PK) | Sim | UUID | `uuid` |
| `competencia_id` | String (FK) | Sim | ID da competência avaliada | `comp-uuid` |
| `data` | String | Sim | Data da avaliação (YYYY-MM-DD) | `"2026-10-25"` |
| `nivel` | Number | Sim | Nível registrado (1 a 5) | `4` |
| `justificativa` | String | Sim | Argumentos que sustentam o nível | `"Condução autônoma do comitê"` |
| `evidencias` | String | Não | Referências de entregas | `"Gravação do workshop X"` |
| `origem` | String | Sim | Autoavaliação, Feedback Gestora, Reunião 1:1 | `"Autoavaliação"` |
| `created_at` | String | Sim | Data/hora de criação | ISO 8601 |
| `updated_at` | String | Sim | Data/hora da alteração | ISO 8601 |

---

### 2.7. METAS
Metas SMART e objetivos inspirados em OKRs.

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
|---|---|---|---|---|
| `id` | String (PK) | Sim | UUID | `uuid` |
| `titulo` | String | Sim | Título da meta | `"Conquistar certificação Google Cloud"` |
| `descricao` | String | Não | Detalhamento | `"Preparação e exame PCA"` |
| `objetivo_relacionado` | String | Não | Objetivo de carreira associado | `"Evoluir para Engenheiro Sênior"` |
| `resultado_esperado` | String | Não | Critério mensurável de sucesso | `"Aprovação no exame oficial"` |
| `indicador` | String | Não | Métrica | `"Pontuação do simulado"` |
| `valor_inicial` | Number | Não | Ponto de partida | `0` |
| `valor_alvo` | Number | Não | Meta final | `100` |
| `valor_atual` | Number | Não | Progresso atual | `45` |
| `data_inicial` | String | Sim | Data início (YYYY-MM-DD) | `"2026-10-01"` |
| `prazo` | String | Sim | Prazo final (YYYY-MM-DD) | `"2026-12-15"` |
| `prioridade` | String | Sim | `baixa`, `media`, `alta`, `urgente` | `"alta"` |
| `status` | String | Sim | `nao_iniciada`, `em_andamento`, `em_risco`, `concluida`, `cancelada`, `arquivada` | `"em_andamento"` |
| `competencias_relacionadas` | JSON Array | Não | IDs das competências envolvidas | `["comp-1"]` |
| `criterio_conclusao` | String | Não | Critério exato para fechamento | `"Certificado emitido"` |
| `evidencias` | String | Não | Registro comprobatório | `"Link do badge"` |
| `progresso_manual` | Number | Não | Ajuste manual de 0 a 100 se necessário | `50` |
| `custom_fields` | JSON | Não | Campos dinâmicos | `{}` |
| `created_at` | String | Sim | Data/hora de criação | ISO 8601 |
| `updated_at` | String | Sim | Data/hora da alteração | ISO 8601 |

---

### 2.8. ACOES
Plano de ação operacional vinculado a metas, feedbacks, cursos ou avulso.

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
|---|---|---|---|---|
| `id` | String (PK) | Sim | UUID | `uuid` |
| `meta_id` | String (FK) | Não | ID da meta relacionada (se houver) | `meta-uuid` |
| `titulo` | String | Sim | Título da tarefa de ação | `"Completar módulo 3 do curso GCP"` |
| `descricao` | String | Não | Instruções da ação | `"Focar em arquitetura de dados"` |
| `prioridade` | String | Sim | `baixa`, `media`, `alta` | `"media"` |
| `data_inicio` | String | Não | Início (YYYY-MM-DD) | `"2026-10-26"` |
| `prazo` | String | Sim | Prazo (YYYY-MM-DD) | `"2026-10-31"` |
| `status` | String | Sim | `a_fazer`, `em_progresso`, `concluida`, `bloqueada`, `cancelada` | `"em_progresso"` |
| `tempo_estimado_horas` | Number | Não | Estimativa em horas | `8` |
| `tempo_realizado_horas` | Number | Não | Horas reais gastas | `4` |
| `observacoes` | String | Não | Impedimentos ou anotações | `"Faltou tempo na quarta-feira"` |
| `evidencias` | String | Não | Link ou notas de entrega | `"Exercício submetido"` |
| `origem_tipo` | String | Sim | `avulsa`, `meta`, `feedback`, `reuniao`, `livro`, `curso` | `"meta"` |
| `origem_id` | String | Não | ID do registro de origem | `origem-uuid` |
| `custom_fields` | JSON | Não | Campos dinâmicos | `{}` |
| `created_at` | String | Sim | Data/hora de criação | ISO 8601 |
| `updated_at` | String | Sim | Data/hora da alteração | ISO 8601 |

---

### 2.9. EVIDENCIAS
Repositório central de artefatos comprobatórios de desenvolvimento e impacto.

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
|---|---|---|---|---|
| `id` | String (PK) | Sim | UUID | `uuid` |
| `titulo` | String | Sim | Título da evidência | `"Apresentação Tech Talk Arquitetura"` |
| `descricao` | String | Não | Contexto e importância | `"Compartilhamento com time de 30 devs"` |
| `tipo` | String | Sim | `documento`, `projeto`, `feedback`, `apresentacao`, `metrica`, `outro` | `"apresentacao"` |
| `data` | String | Sim | Data da realização (YYYY-MM-DD) | `"2026-10-20"` |
| `competencia_id` | String (FK) | Não | ID da competência relacionada | `comp-uuid` |
| `meta_id` | String (FK) | Não | ID da meta relacionada | `meta-uuid` |
| `resultado_alcancado` | String | Não | Impacto gerado | `"Score de satisfação 9.8/10"` |
| `indicador_antes` | String | Não | Cenário anterior | `"Dúvidas frequentes sobre microsserviços"` |
| `indicador_depois` | String | Não | Cenário posterior | `"Padrão adotado em 4 novos projetos"` |
| `link_externo` | String | Não | Link no Google Drive, GitHub, etc. | `"https://docs.google.com/..."` |
| `observacoes` | String | Não | Anotações adicionais | `""` |
| `custom_fields` | JSON | Não | Campos dinâmicos | `{}` |
| `created_at` | String | Sim | Data/hora de criação | ISO 8601 |
| `updated_at` | String | Sim | Data/hora da alteração | ISO 8601 |

---

### 2.10. LIVROS
Biblioteca de leituras e estante virtual tridimensional.

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
|---|---|---|---|---|
| `id` | String (PK) | Sim | UUID | `uuid` |
| `titulo` | String | Sim | Título da obra | `"Clean Code"` |
| `autor` | String | Não | Autor(es) | `"Robert C. Martin"` |
| `categoria` | String | Não | Categoria temática | `"Engenharia de Software"` |
| `capa_url` | String | Não | Link da capa | `"https://..."` |
| `capa_cor` | String | Não | Cor de fallback da lombada em hex | `"#1e293b"` |
| `status` | String | Sim | `quero_ler`, `lendo`, `concluido`, `favorito`, `abandonado` | `"lendo"` |
| `total_paginas` | Number | Sim | Total de páginas | `464` |
| `pagina_atual` | Number | Sim | Página atual | `230` |
| `percentual_leitura` | Number | Sim | % calculado | `49.57` |
| `data_inicio` | String | Não | Início da leitura (YYYY-MM-DD) | `"2026-10-01"` |
| `data_conclusao` | String | Não | Fim da leitura (YYYY-MM-DD) | `""` |
| `avaliacao_pessoal` | Number | Não | 1 a 5 estrelas | `5` |
| `resumo` | String | Não | Resenha da obra | `"Princípios para código limpo"` |
| `principais_aprendizados` | String | Não | Lições extraídas | `"Nomes significativos e funções pequenas"` |
| `competencias_relacionadas` | JSON Array | Não | IDs das competências | `["comp-1"]` |
| `aplicacao_pratica` | String | Não | Como aplicou no dia a dia | `"Refatoração do módulo X"` |
| `favorito` | Boolean | Sim | Se está nos favoritos | `TRUE` |
| `estante` | String | Sim | `favoritos`, `quero_ler`, `lendo_agora`, `concluidos` | `"lendo_agora"` |
| `observacoes` | String | Não | Notas gerais | `""` |
| `custom_fields` | JSON | Não | Campos dinâmicos | `{}` |
| `created_at` | String | Sim | Data/hora de criação | ISO 8601 |
| `updated_at` | String | Sim | Data/hora da alteração | ISO 8601 |

---

### 2.11. LEITURAS
Histórico de sessões de leitura diárias para acompanhamento de ritmo.

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
|---|---|---|---|---|
| `id` | String (PK) | Sim | UUID | `uuid` |
| `livro_id` | String (FK) | Sim | ID do livro lido | `livro-uuid` |
| `data` | String | Sim | Data da sessão (YYYY-MM-DD) | `"2026-10-25"` |
| `paginas_lidas` | Number | Sim | Páginas lidas nesta sessão | `25` |
| `pagina_final` | Number | Sim | Página em que parou | `230` |
| `duracao_minutos` | Number | Não | Tempo de leitura em minutos | `40` |
| `notas_sessao` | String | Não | Pensamentos e anotações rápidas | `"Capítulo sobre tratamento de erros"` |
| `created_at` | String | Sim | Data/hora de criação | ISO 8601 |
| `updated_at` | String | Sim | Data/hora da alteração | ISO 8601 |

---

### 2.12. APRENDIZADOS
Base de conhecimento de anotações, metodologias e insights acionáveis.

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
|---|---|---|---|---|
| `id` | String (PK) | Sim | UUID | `uuid` |
| `titulo` | String | Sim | Título da anotação | `"Matriz Eisenhower para Priorização"` |
| `conteudo` | String | Sim | Texto do aprendizado | `"Dividir tarefas em 4 quadrantes..."` |
| `tipo_anotacao` | String | Sim | `insight`, `resumo`, `citacao`, `metodologia`, `outro` | `"metodologia"` |
| `data` | String | Sim | Data (YYYY-MM-DD) | `"2026-10-22"` |
| `origem_tipo` | String | Sim | `livro`, `curso`, `mentoria`, `trabalho`, `outro` | `"livro"` |
| `origem_id` | String | Não | ID da entidade de origem | `livro-uuid` |
| `competencias_relacionadas` | JSON Array | Não | IDs de competências | `["comp-2"]` |
| `aplicacao_pratica` | String | Não | Onde usar | `"Planejamento semanal de segunda-feira"` |
| `proxima_acao` | String | Não | Tarefa derivada | `"Criar template no Notion"` |
| `tags` | String | Não | Palavras-chave separadas por vírgula | `"produtividade, organizacao"` |
| `created_at` | String | Sim | Data/hora de criação | ISO 8601 |
| `updated_at` | String | Sim | Data/hora da alteração | ISO 8601 |

---

### 2.13. CURSOS
Registro de treinamentos, cursos, workshops e certificações.

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
|---|---|---|---|---|
| `id` | String (PK) | Sim | UUID | `uuid` |
| `nome` | String | Sim | Nome do curso | `"Google Cloud Professional Architect"` |
| `instituicao` | String | Não | Plataforma ou escola | `"Coursera / Google Cloud"` |
| `categoria` | String | Não | Área de conhecimento | `"Cloud & DevOps"` |
| `carga_horaria_horas` | Number | Não | Duração em horas | `40` |
| `data_inicio` | String | Não | Início (YYYY-MM-DD) | `"2026-09-01"` |
| `data_prevista_conclusao` | String | Não | Previsão (YYYY-MM-DD) | `"2026-11-30"` |
| `data_conclusao` | String | Não | Fim efetivo (YYYY-MM-DD) | `""` |
| `status` | String | Sim | `planejado`, `em_andamento`, `concluido`, `abandonado` | `"em_andamento"` |
| `competencias_desenvolvidas` | JSON Array | Não | IDs das competências | `["comp-1"]` |
| `certificado_url` | String | Não | Link público do certificado | `""` |
| `observacoes` | String | Não | Notas sobre a qualidade do curso | `""` |
| `custom_fields` | JSON | Não | Campos dinâmicos | `{}` |
| `created_at` | String | Sim | Data/hora de criação | ISO 8601 |
| `updated_at` | String | Sim | Data/hora da alteração | ISO 8601 |

---

### 2.14. REUNIOES
Planejamento e ata de reuniões 1:1 de desenvolvimento com liderança.

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
|---|---|---|---|---|
| `id` | String (PK) | Sim | UUID | `uuid` |
| `data` | String | Sim | Data da reunião (YYYY-MM-DD) | `"2026-10-27"` |
| `pauta` | String | Sim | Tópicos a conversar | `"Revisão das metas Q4 e certificação"` |
| `conquistas_recentes` | String | Não | Destaques desde a última conversa | `"Subida de versão sem incidentes"` |
| `dificuldades_bloqueios` | String | Não | Pontos que precisam de apoio | `"Acesso ao ambiente de testes"` |
| `feedbacks_discutidos` | String | Não | Conversas de alinhamento | `"Reconhecimento pela entrega rápida"` |
| `competencias_abordadas` | JSON Array | Não | Competências debatidas | `["comp-1", "comp-2"]` |
| `decisoes` | String | Não | O que ficou definido | `"Foco total no exame até dezembro"` |
| `acoes_acordadas` | String | Não | Tarefas que geram plano de ação | `"Solicitar voucher corporativo"` |
| `proximos_passos` | String | Não | Expectativas para o próximo ciclo | `"Realizar 2 simulados"` |
| `data_proxima_reuniao` | String | Não | Data da próxima 1:1 (YYYY-MM-DD) | `"2026-11-10"` |
| `status` | String | Sim | `planejada`, `realizada`, `cancelada` | `"planejada"` |
| `custom_fields` | JSON | Não | Campos dinâmicos | `{}` |
| `created_at` | String | Sim | Data/hora de criação | ISO 8601 |
| `updated_at` | String | Sim | Data/hora da alteração | ISO 8601 |

---

### 2.15. HISTORICO
Log auditável e transparente de operações realizadas na aplicação.

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
|---|---|---|---|---|
| `id` | String (PK) | Sim | UUID | `uuid` |
| `operacao` | String | Sim | `CRIAR`, `EDITAR`, `EXCLUIR`, `ARQUIVAR`, `SETUP` | `"CRIAR"` |
| `modulo` | String | Sim | Nome da aba/módulo afetado | `"METAS"` |
| `registro_id` | String | Sim | ID do registro envolvido | `meta-uuid` |
| `resumo` | String | Sim | Descrição concisa da ação | `"Criada meta: Certificação GCP"` |
| `usuario_email` | String | Sim | E-mail do usuário autenticado no Apps Script | `"usuario@gmail.com"` |
| `created_at` | String | Sim | Data e hora exata do evento | ISO 8601 |
