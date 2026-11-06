# Guia Completo de Preenchimento do Elevare PDI (+ Prompt para ChatGPT)

Este documento mapeia **todos os formulários e campos** presentes nas abas da aplicação web **Elevare PDI**. No final do documento, há um **Prompt Mestre pronto para copiar e colar no ChatGPT** para que ele gere todos os textos personalizados para o seu perfil profissional, exatamente no formato dos campos do aplicativo.

---

## 📋 1. Aba: Meu PDI (`PLANOS_PDI`)
**Objetivo:** Definir o seu ciclo macro de desenvolvimento profissional (ex.: Semestre ou Ano), onde você está hoje e qual cargo/patamar quer alcançar.

| Campo na Tela | Obrigatório | Opções / Formato | O que preencher |
| :--- | :---: | :--- | :--- |
| **Título do PDI** | Sim (`*`) | Texto livre | Nome do ciclo (ex.: *Ciclo 2026 — Transição para Tech Lead / Especialista*) |
| **Cargo ou Área Desejada** | Sim (`*`) | Texto livre | Próximo passo na carreira (ex.: *Engenheiro de Software Sênior / Coordenador*) |
| **Status** | Sim | `Ativo`, `Em Revisão`, `Concluído`, `Arquivado` | Estado atual do plano (padrão: `Ativo`) |
| **Objetivo Profissional Estratégico** | Sim (`*`) | Texto longo | Resumo claro do que você quer conquistar neste ciclo e por quê |
| **Pontos Fortes (Forças)** | Não | Texto longo | Seus principais diferenciais atuais que sustentam esse objetivo |
| **Oportunidades de Melhoria (Gaps)** | Não | Texto longo | O que ainda falta desenvolver para estar pronto para o cargo desejado |
| **Data de Início** | Não | Data (`DD/MM/AAAA`) | Quando começou o ciclo |
| **Prazo Final** | Não | Data (`DD/MM/AAAA`) | Data-alvo para avaliação do ciclo |
| **Indicadores de Sucesso** | Não | Texto livre | Como você saberá que o PDI deu certo (ex.: *Liderar 2 projetos críticos, nota 4+ na avaliação anual*) |
| **Observações Gerais** | Não | Texto longo | Acordos com liderança, contexto de carreira ou anotações extras |

---

## 🧩 2. Aba: Método SWOT (`SWOT`)
**Objetivo:** Mapear estrategicamente seus fatores internos (**Forças** e **Fraquezas**) e fatores externos do mercado/empresa (**Oportunidades** e **Ameaças**), criando estratégias cruzadas e convertendo-os em ações práticas.

### 2.1. Formulário: Novo Item da Matriz SWOT
| Campo na Tela | Obrigatório | Opções / Formato | O que preencher |
| :--- | :---: | :--- | :--- |
| **Quadrante SWOT** | Sim (`*`) | `💪 Força (Interno • Positivo)`<br>`🎯 Fraqueza (Interno • Ponto de Melhoria)`<br>`🚀 Oportunidade (Externo • Favorável)`<br>`🛡️ Ameaça (Externo • Risco a Mitigar)` | Em qual dos 4 quadrantes o fator se encaixa |
| **Nível de Impacto na Carreira** | Sim (`*`) | `Alto Impacto`, `Médio Impacto`, `Baixo Impacto` | Peso desse fator na sua evolução profissional |
| **Título / Fator Mapeado** | Sim (`*`) | Texto livre | Frase curta e direta (ex.: *Domínio técnico em automação* ou *Falta de prática em apresentações executivas*) |
| **Competência ou Área Relacionada** | Não | Texto livre | Competência ligada a esse item (ex.: *Comunicação Executiva*, *Arquitetura*, *Gestão de Tempo*) |
| **Status de Acompanhamento** | Sim | `Ativo`, `Em Ação no PDI`, `Resolvido / Consolidado`, `Arquivado` | Situação atual do item (muda automaticamente para `Em Ação no PDI` ao clicar em **+ Criar Ação**) |
| **Contexto e Análise do Fator** | Não | Texto longo | Explicação do porquê esse fator existe hoje e como ele afeta seu dia a dia |
| **Estratégia Cruzada** | Não | Texto longo | Como agir sobre o fator:<br>• **Força:** Como *Alavancar*?<br>• **Fraqueza:** Como *Corrigir/Mitigar*?<br>• **Oportunidade:** Como *Explorar*?<br>• **Ameaça:** Como *Defender/Neutralizar*? |

---

## ⭐ 3. Aba: Competências — Hard & Soft Skills (`COMPETENCIAS` e `AVALIACOES`)
**Objetivo:** Mapear as habilidades técnicas (*Hard Skills*) e comportamentais (*Soft Skills*) essenciais para o seu cargo atual e desejado, acompanhando o *gap* (lacuna) na escala de 1 a 5.

### Escala Oficial de Proficiência (1 a 5):
- **1 — Básico / Teórico:** Conhecimento conceitual, necessita de supervisão direta.
- **2 — Em Prática / Inicial:** Aplica em tarefas rotineiras com orientação pontual.
- **3 — Autônomo / Competente:** Executa com autonomia, consistência e boa qualidade.
- **4 — Avançado / Domínio Alto:** Resolve problemas complexos e orienta colegas.
- **5 — Especialista / Referência:** Referência técnica ou comportamental, define padrões e inova.

### 3.1. Formulário: Nova Competência
| Campo na Tela | Obrigatório | Opções / Formato | O que preencher |
| :--- | :---: | :--- | :--- |
| **Nome da Competência** | Sim (`*`) | Texto livre | Nome da habilidade (ex.: *Arquitetura em Nuvem*, *Negociação com Stakeholders*) |
| **Tipo** | Sim (`*`) | `Hard Skill (Técnica)`<br>`Soft Skill (Comportamental)` | Natureza da competência |
| **Categoria** | Não | Texto livre | Agrupamento (ex.: *Engenharia de Dados*, *Liderança*, *Produtividade*) |
| **Prioridade / Importância** | Sim | `Alta Prioridade`, `Média Prioridade`, `Baixa Prioridade` | Relevância para o seu objetivo atual |
| **Nível Atual (1 a 5)** | Sim (`*`) | `1`, `2`, `3`, `4` ou `5` | Seu nível real hoje |
| **Nível Desejado (Alvo 1 a 5)** | Sim (`*`) | `1`, `2`, `3`, `4` ou `5` | Nível que você quer atingir até o fim do PDI |
| **Descrição** | Não | Texto longo | O que significa dominar essa competência na sua função |
| **Plano de Desenvolvimento / Meta de Evolução** | Não | Texto longo | O que você fará na prática para sair do Nível Atual e chegar ao Nível Desejado |

### 3.2. Formulário: Avaliar Competência (Histórico em `AVALIACOES`)
| Campo na Tela | Obrigatório | Opções / Formato | O que preencher |
| :--- | :---: | :--- | :--- |
| **Novo Nível Avaliado (1 a 5)** | Sim (`*`) | Botões `1` a `5` | Novo nível atingido |
| **Justificativa da Avaliação** | Sim (`*`) | Texto longo | Por que você subiu ou manteve esse nível |
| **Evidências / Entregas Realizadas** | Não | Texto longo | Projetos, entregas ou feedbacks que comprovam essa evolução |

---

## 🎯 4. Aba: Metas & Ações (`METAS` e `ACOES`)
**Objetivo:** Transformar seus objetivos e gaps em **Metas SMART** (Específicas, Mensuráveis, Atingíveis, Relevantes e Temporais) e quebrar cada meta em um checklist de **Ações Práticas** (que calculam a barra de progresso de 0% a 100%).

### 4.1. Formulário: Nova Meta SMART
| Campo na Tela | Obrigatório | Opções / Formato | O que preencher |
| :--- | :---: | :--- | :--- |
| **Título da Meta** | Sim (`*`) | Texto livre | Objetivo específico (ex.: *Liderar o redesign do módulo financeiro até Q3*) |
| **Categoria / Objetivo Estratégico** | Não | Texto livre | Área estratégica (ex.: *Liderança Técnica*, *Certificação*, *Visibilidade*) |
| **Prioridade** | Sim | `Alta`, `Média`, `Baixa` | Urgência/importância da meta |
| **Data de Início** | Sim | Data (`DD/MM/AAAA`) | Quando inicia a execução |
| **Prazo Final** | Sim (`*`) | Data (`DD/MM/AAAA`) | Data limite para concluir a meta |
| **Status** | Sim | `Em Andamento`, `Planejada`, `Concluída`, `Cancelada` | Estado atual da meta |
| **Indicador de Sucesso** | Não | Texto livre | Métrica objetiva de conclusão (ex.: *100% dos módulos entregues no prazo / Exame aprovado com >= 75%*) |
| **Resultado Esperado** | Não | Texto longo | Qual transformação ou impacto será gerado ao bater essa meta |
| **Descrição Detalhada** | Não | Texto longo | Contexto, recursos necessários e etapas macro |

### 4.2. Formulário: Adicionar Ação à Meta (`ACOES`)
| Campo na Tela | Obrigatório | Opções / Formato | O que preencher |
| :--- | :---: | :--- | :--- |
| **Título da Ação** | Sim (`*`) | Texto livre | Tarefa prática acionável (ex.: *Fazer 2 simulados práticos até sexta-feira*) |
| **Prazo de Conclusão** | Sim | Data (`DD/MM/AAAA`) | Data limite da tarefa |
| **Prioridade** | Sim | `Alta`, `Média`, `Baixa` | Prioridade da ação |
| **Status** | Sim | `A Fazer`, `Em Progresso`, `Concluída`, `Impedimento` | Status da tarefa (também pode ser marcado direto no checkbox da meta) |
| **Descrição / Evidência Esperada** | Não | Texto longo | O que comprova que a ação foi bem executada |

---

## 💬 5. Aba: Feedbacks (`FEEDBACKS`)
**Objetivo:** Registrar alinhamentos 1:1, avaliações de desempenho, retornos de pares/gestores e autoavaliações, permitindo converter qualquer ponto de melhoria em uma ação no PDI com 1 clique.

| Campo na Tela | Obrigatório | Opções / Formato | O que preencher |
| :--- | :---: | :--- | :--- |
| **Título / Assunto** | Sim (`*`) | Texto livre | Assunto da conversa (ex.: *Feedback 1:1 Mensal — Entrega do Projeto X*) |
| **Origem / Autor** | Sim (`*`) | Texto livre | Quem deu o feedback (ex.: *Gestor Direto*, *Tech Lead*, *Par*, *Autoavaliação*) |
| **Data** | Sim (`*`) | Data (`DD/MM/AAAA`) | Data em que o feedback ocorreu |
| **Status** | Sim | `Novo`, `Em Acompanhamento`, `Implementado`, `Arquivado` | Estado atual |
| **Prioridade** | Sim | `Alta`, `Média`, `Baixa` | Relevância do alinhamento |
| **Contexto do Feedback** | Não | Texto livre | Situação ou projeto avaliado |
| **Pontos Fortes (Reconhecimento)** | Não | Texto longo | O que foi elogiado e deve continuar sendo feito |
| **Oportunidades de Melhoria** | Não | Texto longo | O que foi apontado como ponto de ajuste ou evolução |
| **Ações Acordadas / Plano** | Não | Texto longo | O que ficou combinado fazer após a conversa |
| **Prazo de Acompanhamento (Follow-up)** | Não | Data (`DD/MM/AAAA`) | Data da próxima conversa para revisar se houve evolução |

---

## 📚 6. Aba: Biblioteca 3D & Hub de Leituras (`LIVROS` e `LEITURAS`)
**Objetivo:** Gerenciar os livros técnicos, de liderança e desenvolvimento pessoal que apoiam seu PDI, exibindo-os na estante virtual 3D.

### 6.1. Formulário: Adicionar Livro
| Campo na Tela | Obrigatório | Opções / Formato | O que preencher |
| :--- | :---: | :--- | :--- |
| **Capa do Livro (Imagem Frontal 3D)** | Não | URL de imagem ou Upload | Link da capa ou arquivo de imagem do computador |
| **Título da Obra** | Sim (`*`) | Texto livre | Nome do livro (ex.: *Staff Engineer*, *Comunicação Não-Violenta*) |
| **Autor** | Sim (`*`) | Texto livre | Autor da obra |
| **Categoria** | Não | Texto livre | Tema do livro (ex.: *Liderança*, *Arquitetura*, *Carreira*) |
| **Cor Base / Lombada 3D** | Não | 8 cores disponíveis | Cor da lombada 3D na estante |
| **Total de Páginas** | Sim (`*`) | Número inteiro | Quantidade total de páginas do livro |
| **Página Atual** | Sim | Número inteiro | Página em que você está (0 se ainda não começou) |
| **Status da Leitura** | Sim | `Quero Ler`, `Lendo Agora`, `Concluído`, `Pausado` | Em qual prateleira da Estante 3D o livro ficará |
| **Avaliação Pessoal** | Não | `0` a `5 estrelas` | Sua nota para o livro |
| **Marcar como Leitura Favorita ⭐** | Não | Checkbox | Destaca o livro com fita dourada na capa 3D |
| **Resumo / Visão Geral** | Não | Texto longo | Sobre o que é o livro e por que você o escolheu para seu PDI |
| **Principais Aprendizados & Aplicações Práticas** | Não | Texto longo | Como aplicar os conceitos do livro no seu trabalho atual |

---

## 🤖 7. Prompt Mestre para o ChatGPT (Copie e Cole)

Copie o bloco abaixo, preencha os colchetes `[...]` no início com as suas informações reais e envie no ChatGPT. Ele vai gerar todo o conteúdo estruturado exatamente com os mesmos nomes de campos do seu aplicativo **Elevare PDI**:

```markdown
Atue como um Mentor Executivo de Carreira e Especialista em PDI (Plano de Desenvolvimento Individual).
Eu utilizo um aplicativo web próprio chamado **Elevare PDI** e preciso que você me ajude a preencher todas as abas do sistema de forma personalizada, prática, realista e estratégica com base no meu perfil atual.

### MEU PERFIL PROFISSIONAL ATUAL:
- **Meu Cargo / Função Atual:** [PREENCHA AQUI: ex: Desenvolvedor Pleno / Analista de Dados / Coordenador]
- **Minha Área / Setor:** [PREENCHA AQUI: ex: Tecnologia / Produto / Finanças / Operações]
- **Tempo de Experiência:** [PREENCHA AQUI: ex: 3 anos]
- **Cargo ou Patamar Desejado (Próximo Passo):** [PREENCHA AQUI: ex: Sênior / Tech Lead / Especialista / Gerente]
- **Prazo desejado para essa evolução:** [PREENCHA AQUI: ex: 6 a 12 meses]
- **Minhas principais habilidades atuais (o que já mando bem):** [PREENCHA AQUI]
- **Minhas maiores dificuldades ou desafios hoje (o que sinto que falta):** [PREENCHA AQUI]
- **Feedbacks recentes que já recebi (se houver):** [PREENCHA AQUI]

---

Com base nesse meu perfil, gere o conteúdo completo e pronto para eu copiar e colar em cada uma das 6 abas do meu aplicativo **Elevare PDI**, seguindo rigorosamente os campos abaixo:

### 1. ABA: MEU PDI (Gere 1 Plano Principal Completo)
- **Título do PDI:**
- **Cargo ou Área Desejada:**
- **Status:** Ativo
- **Objetivo Profissional Estratégico:**
- **Pontos Fortes (Forças):**
- **Oportunidades de Melhoria (Gaps):**
- **Data de Início e Prazo Final sugeridos:**
- **Indicadores de Sucesso:**
- **Observações Gerais:**

### 2. ABA: MÉTODO SWOT (Gere 8 itens no total: 2 Forças, 2 Fraquezas, 2 Oportunidades e 2 Ameaças)
Para cada item, preencha exatamente:
- **Quadrante SWOT:** (Força / Fraqueza / Oportunidade / Ameaça)
- **Nível de Impacto na Carreira:** (Alto Impacto / Médio Impacto / Baixo Impacto)
- **Título / Fator Mapeado:**
- **Competência ou Área Relacionada:**
- **Status de Acompanhamento:** Ativo
- **Contexto e Análise do Fator:**
- **Estratégia Cruzada (Como Alavancar, Corrigir, Explorar ou Defender):**

### 3. ABA: COMPETÊNCIAS — HARD & SOFT SKILLS (Gere 4 Hard Skills e 4 Soft Skills essenciais para o meu objetivo)
Para cada competência, preencha:
- **Nome da Competência:**
- **Tipo:** (Hard Skill ou Soft Skill)
- **Categoria:**
- **Prioridade / Importância:** (Alta / Média / Baixa)
- **Nível Atual sugerido (1 a 5):**
- **Nível Desejado (Alvo 1 a 5):**
- **Descrição:**
- **Plano de Desenvolvimento / Meta de Evolução:**

### 4. ABA: METAS SMART & AÇÕES VINCULADAS (Gere 3 Metas SMART completas e, dentro de cada meta, 3 Ações Práticas)
Para cada **Meta SMART**:
- **Título da Meta:**
- **Categoria / Objetivo Estratégico:**
- **Prioridade:** (Alta / Média / Baixa)
- **Data de Início e Prazo Final sugeridos:**
- **Status:** Em Andamento
- **Indicador de Sucesso:**
- **Resultado Esperado:**
- **Descrição Detalhada:**
  - **Ações Vinculadas (3 por meta):** Para cada ação, informe:
    - *Título da Ação:*
    - *Prazo sugerido:*
    - *Prioridade:* (Alta / Média / Baixa)
    - *Descrição / Evidência Esperada:*

### 5. ABA: FEEDBACKS (Gere 2 modelos estruturados: 1 de Autoavaliação Inicial e 1 roteiro para pedir Feedback ao meu Gestor)
Para cada registro:
- **Título / Assunto:**
- **Origem / Autor:**
- **Status:** Em Acompanhamento
- **Prioridade:** Alta
- **Contexto do Feedback:**
- **Pontos Fortes (Reconhecimento):**
- **Oportunidades de Melhoria:**
- **Ações Acordadas / Plano de Desenvolvimento:**

### 6. ABA: BIBLIOTECA 3D (Sugira 4 livros reais e altamente recomendados para o meu momento de carreira)
Para cada livro, informe:
- **Título da Obra:**
- **Autor:**
- **Categoria:**
- **Total aproximado de Páginas:**
- **Status da Leitura:** Quero Ler
- **Resumo / Visão Geral (Por que ler este livro no meu PDI):**
- **Principais Aprendizados & Aplicações Práticas esperadas no meu dia a dia:**
```

