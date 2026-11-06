/**
 * Elevare PDI — Provisionamento Idempotente do PDI Completo (Francisco de Lima Silva)
 * Cadastra e valida integralmente os 35 registros estruturados no Google Sheets
 * utilizando a camada oficial Database.insertRecord (com validação, UUID e auditoria),
 * preservando registros preexistentes e evitando duplicidades.
 */

var SeedPdi = (function () {
  var PROP_SEED_FLAG = 'FRANCISCO_PDI_SEEDED_V2';

  /**
   * Dados estruturados dos 35 registros do PDI de Francisco de Lima Silva.
   */
  function getPdiDataset() {
    return {
      // 1. ABA MEU PDI (1 registro)
      planosPdi: [
        {
          titulo: 'PDI Estratégico — Evolução para Especialista em Processos, Dados e Gestão Administrativa',
          cargo_desejado: 'Especialista em Processos e Performance Administrativa / Coordenador Administrativo',
          status: 'ativo',
          objetivo_profissional:
            'Desenvolver competências técnicas, analíticas, comportamentais e estratégicas para consolidar minha atuação como Analista Administrativo Sênior, ampliando minha capacidade de gestão de processos, análise de indicadores, planejamento administrativo, automação e tomada de decisão.\n\n' +
            'Busco evoluir de um perfil predominantemente operacional para um profissional com visão sistêmica do negócio, capacidade de identificar oportunidades, propor soluções estruturadas, liderar projetos de melhoria contínua e contribuir diretamente para os resultados organizacionais.\n\n' +
            'No médio prazo, pretendo estar preparado para assumir posições de Especialista ou Coordenação, exercendo influência estratégica, liderando iniciativas multidisciplinares e contribuindo para a eficiência operacional e administrativa da organização.',
          pontos_fortes:
            '- Mais de seis anos de experiência em operações, logística e produção.\n' +
            '- Experiência em coordenação de equipes.\n' +
            '- Capacidade analítica e resolução de problemas.\n' +
            '- Conhecimento em indicadores, KPIs e SLAs.\n' +
            '- Experiência em melhoria contínua e Lean Six Sigma.\n' +
            '- Especialização em Ciências de Dados.\n' +
            '- Conhecimentos em Excel, Power BI, SAP e Salesforce.\n' +
            '- Interesse em tecnologia e automação.\n' +
            '- Facilidade de adaptação.\n' +
            '- Visão prática dos processos operacionais.',
          oportunidades_melhoria:
            '- Aprofundar conhecimentos em gestão administrativa estratégica.\n' +
            '- Desenvolver domínio avançado de Excel, Power BI e SQL.\n' +
            '- Aprimorar planejamento e controle administrativo.\n' +
            '- Desenvolver capacidade de elaboração de relatórios executivos.\n' +
            '- Fortalecer comunicação com gerências e diretorias.\n' +
            '- Aprimorar gestão de projetos.\n' +
            '- Desenvolver domínio de governança e procedimentos administrativos.\n' +
            '- Ampliar capacidade de negociação e influência organizacional.',
          data_inicio: '2026-11-09',
          prazo_final: '2027-11-09',
          indicadores_sucesso:
            '1. Mapear e documentar 100% dos principais processos sob minha responsabilidade. ' +
            '2. Desenvolver pelo menos dois dashboards gerenciais. ' +
            '3. Implementar pelo menos duas melhorias ou automações. ' +
            '4. Desenvolver pelo menos um projeto de melhoria contínua. ' +
            '5. Realizar apresentações periódicas de resultados. ' +
            '6. Evoluir pelo menos um nível nas competências prioritárias. ' +
            '7. Receber feedback positivo da liderança quanto à autonomia e capacidade analítica. ' +
            '8. Demonstrar capacidade de conduzir projetos com planejamento e mensuração de resultados.',
          observacoes:
            'O desenvolvimento será conduzido por meio de aprendizado contínuo, aplicação prática dos conhecimentos e acompanhamento periódico dos resultados.\n\n' +
            'O sucesso do PDI será medido principalmente pela capacidade de aplicar conhecimentos, solucionar problemas, melhorar processos, gerar indicadores confiáveis e contribuir para decisões gerenciais.'
        }
      ],

      // 2. ABA MÉTODO SWOT (8 registros — 2 por quadrante)
      swot: [
        {
          quadrante: 'forca',
          impacto: 'alto',
          titulo: 'Experiência Operacional e Visão Sistêmica',
          competencia_relacionada: 'Gestão Operacional / Processos / Logística',
          status: 'ativo',
          descricao:
            'Experiência superior a seis anos em ambientes operacionais, logísticos e produtivos, incluindo atuação como Coordenador de Logística Reversa. Essa trajetória proporciona conhecimento prático sobre processos, gestão de equipes, indicadores, cumprimento de SLAs e resolução de problemas.',
          estrategia_cruzada:
            'Utilizar a experiência operacional como diferencial competitivo na atuação administrativa, conectando processos, indicadores e decisões gerenciais às necessidades reais da operação.'
        },
        {
          quadrante: 'forca',
          impacto: 'alto',
          titulo: 'Perfil Analítico e Afinidade com Tecnologia e Dados',
          competencia_relacionada: 'Ciência de Dados / Automação / Inteligência de Negócios',
          status: 'ativo',
          descricao:
            'Formação em Ciências de Dados, graduação em Análise e Desenvolvimento de Sistemas em andamento e interesse em ferramentas como Excel, Power BI, SQL, Python e inteligência artificial. Demonstra iniciativa na construção de soluções tecnológicas para resolver problemas operacionais.',
          estrategia_cruzada:
            'Transformar o conhecimento tecnológico em soluções aplicáveis à rotina administrativa, priorizando automação, confiabilidade de dados, dashboards e redução de atividades manuais.'
        },
        {
          quadrante: 'fraqueza',
          impacto: 'alto',
          titulo: 'Necessidade de Consolidação da Gestão Administrativa Estratégica',
          competencia_relacionada: 'Planejamento Administrativo / Governança / Gestão',
          status: 'ativo',
          descricao:
            'A trajetória profissional foi predominantemente construída em ambientes operacionais e logísticos. A transição para uma posição administrativa sênior exige aprofundamento em planejamento, controle administrativo, políticas corporativas, análise gerencial e visão estratégica.',
          estrategia_cruzada:
            'Aproveitar a experiência operacional para acelerar o aprendizado administrativo, estudando os processos internos, acompanhando profissionais experientes e assumindo gradualmente responsabilidades de maior complexidade.'
        },
        {
          quadrante: 'fraqueza',
          impacto: 'alto',
          titulo: 'Comunicação Executiva e Influência Organizacional',
          competencia_relacionada: 'Comunicação / Negociação / Gestão de Stakeholders',
          status: 'ativo',
          descricao:
            'A evolução para posições de especialista ou coordenação exige capacidade de apresentar informações de forma objetiva, defender propostas, negociar prioridades e influenciar decisões de diferentes níveis hierárquicos.',
          estrategia_cruzada:
            'Desenvolver comunicação orientada a resultados, participar de reuniões estratégicas, apresentar indicadores e praticar a construção de recomendações fundamentadas em dados.'
        },
        {
          quadrante: 'oportunidade',
          impacto: 'alto',
          titulo: 'Transformação Digital e Automação de Processos Administrativos',
          competencia_relacionada: 'Tecnologia / Automação / Inovação',
          status: 'ativo',
          descricao:
            'O ambiente corporativo apresenta oportunidades de otimização por meio de automação, integração de sistemas e digitalização de processos. O conhecimento em ferramentas tecnológicas pode ser convertido em diferenciais relevantes para a organização.',
          estrategia_cruzada:
            'Identificar processos repetitivos, mapear gargalos e desenvolver soluções que reduzam esforço manual, aumentem a produtividade e melhorem a confiabilidade das informações.'
        },
        {
          quadrante: 'oportunidade',
          impacto: 'alto',
          titulo: 'Ampliação da Atuação Estratégica na Organização',
          competencia_relacionada: 'Gestão de Projetos / Melhoria Contínua / Planejamento',
          status: 'ativo',
          descricao:
            'A posição de Analista Administrativo Sênior proporciona contato com diferentes áreas, processos e necessidades organizacionais. Existe potencial para ampliar a participação em projetos interdepartamentais e iniciativas de melhoria.',
          estrategia_cruzada:
            'Buscar participação em projetos estratégicos, assumir responsabilidade por melhorias e demonstrar resultados por meio de indicadores, relatórios e apresentações executivas.'
        },
        {
          quadrante: 'ameaca',
          impacto: 'alto',
          titulo: 'Defasagem Técnica diante da Evolução Tecnológica',
          competencia_relacionada: 'Dados / Tecnologia / Inteligência Artificial',
          status: 'ativo',
          descricao:
            'A transformação digital aumenta a exigência por profissionais capazes de interpretar dados, automatizar processos e utilizar ferramentas tecnológicas. A ausência de atualização contínua pode limitar a competitividade profissional.',
          estrategia_cruzada:
            'Manter uma rotina de atualização técnica, priorizando ferramentas aplicáveis ao negócio e desenvolvendo projetos práticos que comprovem a evolução das competências.'
        },
        {
          quadrante: 'ameaca',
          impacto: 'alto',
          titulo: 'Risco de Concentração Excessiva em Atividades Operacionais',
          competencia_relacionada: 'Gestão do Tempo / Planejamento Estratégico / Delegação',
          status: 'ativo',
          descricao:
            'A absorção excessiva por demandas operacionais e atividades recorrentes pode reduzir o tempo disponível para análises, planejamento, projetos e desenvolvimento de melhorias estruturais.',
          estrategia_cruzada:
            'Estruturar rotinas, padronizar atividades, automatizar controles e estabelecer critérios de priorização, reservando tempo para atividades analíticas e estratégicas.'
        }
      ],

      // 3. ABA COMPETÊNCIAS — HARD & SOFT SKILLS (8 registros)
      competencias: [
        {
          nome: 'Business Intelligence e Análise de Dados',
          tipo: 'hard_skill',
          categoria: 'Dados / Tecnologia / Inteligência de Negócios',
          importancia: 'alta',
          nivel_atual: 3,
          nivel_desejado: 5,
          descricao:
            'Capacidade de coletar, tratar, interpretar e transformar dados operacionais e administrativos em informações estratégicas para apoiar a tomada de decisão.',
          meta_desenvolvimento:
            'Aprofundar conhecimentos em Power BI, DAX, Power Query, SQL e modelagem de dados. Desenvolver dashboards com indicadores de desempenho, análises comparativas, tendências e identificação de desvios operacionais.',
          status: 'em_desenvolvimento'
        },
        {
          nome: 'Gestão e Mapeamento de Processos',
          tipo: 'hard_skill',
          categoria: 'Gestão Administrativa / Processos / Melhoria Contínua',
          importancia: 'alta',
          nivel_atual: 3,
          nivel_desejado: 5,
          descricao:
            'Capacidade de identificar, documentar, analisar e otimizar processos organizacionais, considerando eficiência, produtividade, padronização e redução de desperdícios.',
          meta_desenvolvimento:
            'Aprofundar conhecimentos em BPMN, SIPOC, PDCA, Lean Six Sigma e gestão por processos. Aplicar as metodologias aos processos administrativos da organização, desenvolvendo fluxogramas, procedimentos e propostas de melhoria.',
          status: 'em_desenvolvimento'
        },
        {
          nome: 'Planejamento e Controle Administrativo',
          tipo: 'hard_skill',
          categoria: 'Administração / Planejamento / Gestão',
          importancia: 'alta',
          nivel_atual: 2,
          nivel_desejado: 4,
          descricao:
            'Capacidade de planejar, organizar, acompanhar e controlar atividades administrativas, garantindo cumprimento de prazos, políticas, procedimentos, indicadores e objetivos organizacionais.',
          meta_desenvolvimento:
            'Estudar planejamento administrativo, gestão de orçamento, controles internos, indicadores de desempenho e governança. Desenvolver ferramentas de acompanhamento das demandas e relatórios gerenciais.',
          status: 'em_desenvolvimento'
        },
        {
          nome: 'Automação e Integração de Sistemas',
          tipo: 'hard_skill',
          categoria: 'Tecnologia / Automação / Inovação',
          importancia: 'alta',
          nivel_atual: 3,
          nivel_desejado: 5,
          descricao:
            'Capacidade de identificar atividades repetitivas e desenvolver soluções tecnológicas para automatizar processos, integrar informações e melhorar a produtividade organizacional.',
          meta_desenvolvimento:
            'Aprofundar conhecimentos em Power Automate, Google Apps Script, SQL e integração de APIs. Desenvolver soluções aplicadas à rotina administrativa, documentando ganhos de produtividade e redução de falhas.',
          status: 'em_desenvolvimento'
        },
        {
          nome: 'Comunicação Executiva',
          tipo: 'soft_skill',
          categoria: 'Comunicação / Influência / Relacionamento',
          importancia: 'alta',
          nivel_atual: 3,
          nivel_desejado: 5,
          descricao:
            'Capacidade de comunicar informações complexas de maneira clara, objetiva e estratégica, adaptando a linguagem ao público e à necessidade da organização.',
          meta_desenvolvimento:
            'Praticar apresentações executivas, desenvolver comunicação baseada em indicadores, estruturar recomendações e aprimorar a capacidade de sintetizar problemas, riscos e oportunidades.',
          status: 'em_desenvolvimento'
        },
        {
          nome: 'Pensamento Estratégico e Visão Sistêmica',
          tipo: 'soft_skill',
          categoria: 'Estratégia / Tomada de Decisão',
          importancia: 'alta',
          nivel_atual: 3,
          nivel_desejado: 5,
          descricao:
            'Capacidade de compreender o impacto das decisões nos diferentes processos e áreas da organização, antecipando riscos e identificando oportunidades de melhoria.',
          meta_desenvolvimento:
            'Participar de discussões interdepartamentais, analisar indicadores de diferentes áreas e desenvolver propostas que considerem impactos operacionais, administrativos e financeiros.',
          status: 'em_desenvolvimento'
        },
        {
          nome: 'Gestão de Stakeholders e Negociação',
          tipo: 'soft_skill',
          categoria: 'Relacionamento Interpessoal / Gestão / Negociação',
          importancia: 'alta',
          nivel_atual: 3,
          nivel_desejado: 5,
          descricao:
            'Capacidade de estabelecer relacionamentos profissionais produtivos, alinhar expectativas, negociar prioridades e conduzir demandas envolvendo diferentes áreas e níveis hierárquicos.',
          meta_desenvolvimento:
            'Conduzir reuniões estruturadas, aprimorar alinhamentos interdepartamentais, desenvolver técnicas de negociação e fortalecer a capacidade de administrar conflitos e expectativas.',
          status: 'em_desenvolvimento'
        },
        {
          nome: 'Gestão de Projetos e Liderança',
          tipo: 'soft_skill',
          categoria: 'Liderança / Gestão / Desenvolvimento Organizacional',
          importancia: 'alta',
          nivel_atual: 3,
          nivel_desejado: 5,
          descricao:
            'Capacidade de planejar, organizar e conduzir projetos, mobilizando pessoas e recursos para atingir objetivos definidos, gerenciando riscos, prazos e resultados.',
          meta_desenvolvimento:
            'Aplicar metodologias de gestão de projetos, desenvolver cronogramas, acompanhar entregáveis, conduzir reuniões de acompanhamento e liderar projetos de melhoria contínua.',
          status: 'em_desenvolvimento'
        }
      ],

      // 4. ABA METAS SMART (3 metas) & AÇÕES VINCULADAS (3 ações por meta = 9 ações)
      metasComAcoes: [
        {
          meta: {
            titulo: 'Mapear, Documentar e Estruturar os Processos Administrativos sob Minha Responsabilidade',
            objetivo_relacionado: 'Gestão Administrativa / Processos / Excelência Operacional',
            prioridade: 'alta',
            data_inicial: '2026-11-09',
            prazo: '2027-02-05',
            status: 'em_andamento',
            indicador:
              '100% dos principais processos sob minha responsabilidade identificados, fluxogramas prioritários elaborados, matriz de responsabilidades desenvolvida e principais gargalos documentados.',
            resultado_esperado:
              'Obter domínio sobre os processos administrativos da operação, garantindo maior organização, padronização, rastreabilidade e controle das atividades.',
            descricao:
              'Desenvolver um diagnóstico estruturado dos processos administrativos, identificando atividades, responsáveis, sistemas utilizados, entradas, saídas, indicadores, riscos e oportunidades de melhoria.'
          },
          acoes: [
            {
              titulo: 'Levantamento e Diagnóstico dos Processos',
              prazo: '2026-11-30',
              prioridade: 'alta',
              status: 'a_fazer',
              origem_tipo: 'meta',
              descricao:
                'Identificar os principais processos, atividades, responsáveis, sistemas, entradas, saídas e dificuldades operacionais. Evidência esperada: documento de diagnóstico e levantamento de processos.'
            },
            {
              titulo: 'Desenvolvimento dos Fluxogramas e Matriz de Responsabilidades',
              prazo: '2026-12-31',
              prioridade: 'alta',
              status: 'a_fazer',
              origem_tipo: 'meta',
              descricao:
                'Construir fluxogramas dos processos prioritários, identificar responsáveis e estabelecer pontos de controle. Evidência esperada: fluxogramas e matriz de responsabilidades documentados.'
            },
            {
              titulo: 'Identificação de Gargalos e Plano de Melhoria',
              prazo: '2027-02-05',
              prioridade: 'alta',
              status: 'a_fazer',
              origem_tipo: 'meta',
              descricao:
                'Avaliar os processos mapeados, identificar falhas, retrabalhos e oportunidades de padronização. Evidência esperada: relatório de diagnóstico com plano de ação priorizado.'
            }
          ]
        },
        {
          meta: {
            titulo: 'Desenvolver Estrutura de Business Intelligence para Gestão e Acompanhamento de Indicadores Administrativos',
            objetivo_relacionado: 'Business Intelligence / Gestão de Indicadores / Tomada de Decisão',
            prioridade: 'alta',
            data_inicial: '2026-11-09',
            prazo: '2027-03-06',
            status: 'em_andamento',
            indicador:
              'Pelo menos dois dashboards desenvolvidos, indicadores prioritários documentados, fontes de dados identificadas e relatórios gerenciais estruturados.',
            resultado_esperado:
              'Disponibilizar informações confiáveis e organizadas para acompanhamento da operação, identificação de desvios e tomada de decisão gerencial.',
            descricao:
              'Aprimorar a capacidade de análise de dados por meio da construção de painéis gerenciais, integrando informações operacionais e administrativas.'
          },
          acoes: [
            {
              titulo: 'Definição dos KPIs e Fontes de Dados',
              prazo: '2026-12-15',
              prioridade: 'alta',
              status: 'a_fazer',
              origem_tipo: 'meta',
              descricao:
                'Identificar indicadores relevantes, definir fórmulas de cálculo, periodicidade, responsáveis e fontes de informação. Evidência esperada: catálogo de indicadores.'
            },
            {
              titulo: 'Desenvolvimento de Dashboards Gerenciais em Power BI',
              prazo: '2027-02-15',
              prioridade: 'alta',
              status: 'a_fazer',
              origem_tipo: 'meta',
              descricao:
                'Construir dashboards com indicadores, filtros, análises comparativas e identificação de desvios. Evidência esperada: painéis funcionais e documentados.'
            },
            {
              titulo: 'Implantação e Apresentação dos Indicadores',
              prazo: '2027-03-06',
              prioridade: 'alta',
              status: 'a_fazer',
              origem_tipo: 'meta',
              descricao:
                'Apresentar os resultados à liderança, validar a utilidade dos indicadores e propor ações corretivas. Evidência esperada: apresentação gerencial e registro das decisões tomadas.'
            }
          ]
        },
        {
          meta: {
            titulo: 'Implementar Soluções de Automação e Melhoria Contínua para Otimização dos Processos Administrativos',
            objetivo_relacionado: 'Inovação / Automação / Eficiência Operacional / Lean Six Sigma',
            prioridade: 'alta',
            data_inicial: '2026-11-09',
            prazo: '2027-05-07',
            status: 'em_andamento',
            indicador:
              'Identificação de pelo menos três oportunidades de automação, implementação de pelo menos duas melhorias e mensuração dos ganhos de produtividade.',
            resultado_esperado:
              'Reduzir atividades manuais, aumentar a produtividade, melhorar a confiabilidade das informações e disponibilizar mais tempo para atividades analíticas e estratégicas.',
            descricao:
              'Aplicar conhecimentos em tecnologia, automação e melhoria contínua para identificar processos administrativos que possam ser simplificados ou automatizados.'
          },
          acoes: [
            {
              titulo: 'Identificação e Priorização de Oportunidades de Automação',
              prazo: '2027-01-31',
              prioridade: 'alta',
              status: 'a_fazer',
              origem_tipo: 'meta',
              descricao:
                'Identificar atividades repetitivas, controles manuais, consolidações de dados e processos com elevado potencial de automação. Evidência esperada: matriz de oportunidades com estimativa de impacto.'
            },
            {
              titulo: 'Desenvolvimento e Implementação de Soluções Automatizadas',
              prazo: '2027-03-31',
              prioridade: 'alta',
              status: 'a_fazer',
              origem_tipo: 'meta',
              descricao:
                'Desenvolver e implementar pelo menos duas soluções de automação aprovadas, documentando funcionamento, responsáveis e resultados. Evidência esperada: soluções implantadas e validadas.'
            },
            {
              titulo: 'Mensuração de Resultados e Padronização das Melhorias',
              prazo: '2027-05-07',
              prioridade: 'alta',
              status: 'a_fazer',
              origem_tipo: 'meta',
              descricao:
                'Comparar indicadores antes e depois das melhorias, mensurar horas economizadas, redução de erros e ganhos de produtividade. Evidência esperada: relatório de resultados e documentação dos processos atualizados.'
            }
          ]
        }
      ],

      // 5. ABA FEEDBACKS (2 registros)
      feedbacks: [
        {
          titulo: 'Autoavaliação Inicial — Diagnóstico de Competências e Evolução Profissional',
          origem: 'Autoavaliação — Francisco de Lima Silva',
          data: '2026-11-09',
          status: 'em_acompanhamento',
          prioridade: 'alta',
          contexto:
            'Avaliação inicial do momento profissional, considerando a transição de uma trajetória predominantemente operacional e logística para uma posição de Analista Administrativo Sênior. ' +
            'A experiência anterior proporciona uma base sólida em gestão operacional, resolução de problemas, indicadores e melhoria contínua. ' +
            'O principal desafio está em consolidar conhecimentos administrativos, ampliar a visão estratégica e desenvolver maior capacidade de análise e comunicação gerencial.',
          pontos_fortes:
            '- Experiência consistente em operações e processos.\n' +
            '- Capacidade de adaptação e aprendizado.\n' +
            '- Perfil analítico e orientado à resolução de problemas.\n' +
            '- Conhecimento de indicadores e melhoria contínua.\n' +
            '- Interesse por tecnologia, dados e automação.\n' +
            '- Experiência anterior em gestão de equipes.\n' +
            '- Iniciativa para desenvolver soluções e propor melhorias.',
          oportunidades_melhoria:
            '- Consolidar domínio dos processos administrativos.\n' +
            '- Desenvolver maior profundidade em análises gerenciais.\n' +
            '- Aprimorar comunicação executiva.\n' +
            '- Ampliar conhecimentos em planejamento e controle administrativo.\n' +
            '- Desenvolver capacidade de condução de projetos estratégicos.\n' +
            '- Fortalecer influência e relacionamento interdepartamental.',
          acoes_acordadas:
            'Executar o PDI estabelecido, realizar acompanhamento mensal das metas, buscar feedbacks periódicos da liderança e transformar oportunidades de melhoria em ações práticas com evidências mensuráveis.',
          prazo_acompanhamento: '2026-12-09'
        },
        {
          titulo: 'Feedback de Desenvolvimento — Alinhamento de Expectativas e Evolução para Especialista ou Coordenação',
          origem: 'Gestor Imediato — Feedback Solicitado',
          data: '2026-11-09',
          status: 'em_acompanhamento',
          prioridade: 'alta',
          contexto:
            'Solicitar uma conversa estruturada com a liderança para avaliar o desempenho na função de Analista Administrativo Sênior, identificar expectativas em relação à posição e compreender quais competências precisam ser desenvolvidas para ampliar a contribuição estratégica dentro da organização.',
          pontos_fortes:
            'Solicitar ao gestor que identifique e exemplifique:\n' +
            '- Quais entregas demonstram maior aderência às expectativas do cargo?\n' +
            '- Quais competências técnicas são percebidas como diferenciais?\n' +
            '- Em quais situações demonstrei boa capacidade de resolução de problemas?\n' +
            '- Onde minha experiência operacional agrega mais valor à área?\n' +
            '- Quais comportamentos devem ser preservados e potencializados?',
          oportunidades_melhoria:
            'Investigar com o gestor:\n' +
            '- Quais são minhas principais lacunas técnicas atualmente?\n' +
            '- O que preciso desenvolver para atuar com maior autonomia?\n' +
            '- Como posso melhorar minhas análises e apresentações gerenciais?\n' +
            '- Quais responsabilidades ainda preciso assumir?\n' +
            '- O que diferencia um bom Analista Sênior de um Especialista ou Coordenador nesta organização?',
          acoes_acordadas:
            'Realizar reuniões periódicas de acompanhamento, estabelecer prioridades de desenvolvimento em conjunto com a liderança, assumir projetos de maior complexidade e acompanhar a evolução das competências identificadas. Registrar os feedbacks recebidos e converter cada oportunidade de melhoria em uma ação com prazo e evidência de conclusão.',
          prazo_acompanhamento: '2026-12-15'
        }
      ],

      // 6. ABA BIBLIOTECA 3D (4 livros)
      livros: [
        {
          titulo: 'Os Primeiros 90 Dias',
          autor: 'Michael D. Watkins',
          categoria: 'Desenvolvimento de Carreira / Liderança / Gestão',
          total_paginas: 304,
          pagina_atual: 0,
          percentual_leitura: 0,
          status: 'quero_ler',
          estante: 'quero_ler',
          capa_cor: '#3b82f6',
          avaliacao_pessoal: 0,
          favorito: true,
          resumo:
            'A obra apresenta uma metodologia para profissionais que assumem novas responsabilidades ou posições, abordando como acelerar a adaptação, compreender o ambiente organizacional, estabelecer prioridades e conquistar credibilidade.',
          principais_aprendizados:
            '- Compreender rapidamente a cultura e os processos da organização.\n' +
            '- Identificar prioridades e expectativas da liderança.\n' +
            '- Construir relacionamentos estratégicos.\n' +
            '- Evitar decisões precipitadas durante a adaptação.\n' +
            '- Desenvolver um plano de atuação estruturado.\n' +
            '- Conquistar credibilidade por meio de entregas consistentes.\n' +
            'Aplicação prática: Utilizar os conceitos para consolidar minha atuação na Midea Carrier e acelerar o domínio dos processos administrativos.'
        },
        {
          titulo: 'Gestão de Alta Performance (Measure What Matters)',
          autor: 'John Doerr',
          categoria: 'Gestão Estratégica / Indicadores / Performance',
          total_paginas: 320,
          pagina_atual: 0,
          percentual_leitura: 0,
          status: 'quero_ler',
          estante: 'quero_ler',
          capa_cor: '#8b5cf6',
          avaliacao_pessoal: 0,
          favorito: true,
          resumo:
            'O livro apresenta a metodologia OKR (Objectives and Key Results), utilizada por organizações para estabelecer objetivos claros, resultados-chave mensuráveis e alinhamento entre equipes.',
          principais_aprendizados:
            '- Construir objetivos claros e mensuráveis.\n' +
            '- Definir resultados-chave.\n' +
            '- Acompanhar indicadores de desempenho.\n' +
            '- Priorizar atividades de maior impacto.\n' +
            '- Alinhar objetivos individuais e organizacionais.\n' +
            '- Desenvolver uma cultura de acompanhamento de resultados.\n' +
            'Aplicação prática: Utilizar OKRs para organizar projetos administrativos, indicadores e metas de melhoria.'
        },
        {
          titulo: 'Storytelling com Dados',
          autor: 'Cole Nussbaumer Knaflic',
          categoria: 'Business Intelligence / Comunicação / Análise de Dados',
          total_paginas: 288,
          pagina_atual: 0,
          percentual_leitura: 0,
          status: 'quero_ler',
          estante: 'quero_ler',
          capa_cor: '#06b6d4',
          avaliacao_pessoal: 0,
          favorito: true,
          resumo:
            'A obra apresenta técnicas para transformar dados em narrativas visuais claras e persuasivas. Ensina como construir gráficos, organizar informações e transmitir mensagens relevantes por meio de apresentações e dashboards.',
          principais_aprendizados:
            '- Construir dashboards mais objetivos.\n' +
            '- Escolher gráficos adequados para cada análise.\n' +
            '- Eliminar informações visuais desnecessárias.\n' +
            '- Destacar indicadores relevantes.\n' +
            '- Apresentar problemas e oportunidades com clareza.\n' +
            '- Transformar análises em recomendações gerenciais.\n' +
            'Aplicação prática: Aprimorar dashboards de Power BI e apresentações para coordenação e gerência.'
        },
        {
          titulo: 'A Meta (The Goal)',
          autor: 'Eliyahu M. Goldratt e Jeff Cox',
          categoria: 'Gestão de Processos / Lean / Melhoria Contínua',
          total_paginas: 384,
          pagina_atual: 0,
          percentual_leitura: 0,
          status: 'quero_ler',
          estante: 'quero_ler',
          capa_cor: '#10b981',
          avaliacao_pessoal: 0,
          favorito: true,
          resumo:
            'A obra apresenta a Teoria das Restrições por meio de uma narrativa empresarial. Demonstra como identificar gargalos, compreender limitações dos processos e melhorar o desempenho global de uma organização.',
          principais_aprendizados:
            '- Identificar gargalos operacionais.\n' +
            '- Compreender restrições de capacidade.\n' +
            '- Priorizar melhorias com maior impacto.\n' +
            '- Evitar otimizações isoladas que não melhoram o resultado global.\n' +
            '- Analisar processos de ponta a ponta.\n' +
            '- Desenvolver pensamento sistêmico.\n' +
            'Aplicação prática: Aplicar a Teoria das Restrições aos processos administrativos e operacionais, identificando pontos que comprometem produtividade, prazos e SLAs.'
        }
      ]
    };
  }

  function normalizeText(str) {
    return String(str || '').trim().toLowerCase();
  }

  function findByField(list, fieldName, targetValue) {
    var target = normalizeText(targetValue);
    for (var i = 0; i < list.length; i++) {
      if (normalizeText(list[i][fieldName]) === target) {
        return list[i];
      }
    }
    return null;
  }

  /**
   * Executa o cadastro idempotente dos 35 registros no Google Sheets.
   * @param {boolean} [forceVerify=false] Se true, verifica todas as 7 tabelas mesmo que a flag já exista
   * @return {Object} Relatório detalhado da execução e validação
   */
  function seedFranciscoPdi(forceVerify) {
    var props = PropertiesService.getScriptProperties();
    if (!forceVerify && props.getProperty(PROP_SEED_FLAG) === 'true') {
      return {
        alreadySeeded: true,
        seededNewCount: 0,
        totalExpected: 35
      };
    }

    // Garante que o banco e as abas estejam inicializados
    var dbStatus = Database.pingDatabase();
    if (!dbStatus.configured || dbStatus.status !== 'CONECTADO') {
      Database.setupDatabase();
    }

    var dataset = getPdiDataset();
    var seededNewCount = 0;
    var alreadyExistedCount = 0;

    // 1. PLANOS_PDI (1 registro)
    var existingPlanos = Database.listRecords('PLANOS_PDI');
    for (var p = 0; p < dataset.planosPdi.length; p++) {
      var planoItem = dataset.planosPdi[p];
      if (!findByField(existingPlanos, 'titulo', planoItem.titulo)) {
        Database.insertRecord('PLANOS_PDI', planoItem);
        seededNewCount++;
      } else {
        alreadyExistedCount++;
      }
    }

    // 2. SWOT (8 registros)
    var existingSwot = Database.listRecords('SWOT');
    for (var s = 0; s < dataset.swot.length; s++) {
      var swotItem = dataset.swot[s];
      if (!findByField(existingSwot, 'titulo', swotItem.titulo)) {
        Database.insertRecord('SWOT', swotItem);
        seededNewCount++;
      } else {
        alreadyExistedCount++;
      }
    }

    // 3. COMPETENCIAS (8 registros)
    var existingSkills = Database.listRecords('COMPETENCIAS');
    for (var c = 0; c < dataset.competencias.length; c++) {
      var skillItem = dataset.competencias[c];
      if (!findByField(existingSkills, 'nome', skillItem.nome)) {
        Database.insertRecord('COMPETENCIAS', skillItem);
        seededNewCount++;
      } else {
        alreadyExistedCount++;
      }
    }

    // 4. METAS (3 registros) & ACOES VINCULADAS (9 registros)
    var existingMetas = Database.listRecords('METAS');
    var existingAcoes = Database.listRecords('ACOES');

    for (var m = 0; m < dataset.metasComAcoes.length; m++) {
      var group = dataset.metasComAcoes[m];
      var foundMeta = findByField(existingMetas, 'titulo', group.meta.titulo);
      var metaId = '';

      if (!foundMeta) {
        var createdMeta = Database.insertRecord('METAS', group.meta);
        metaId = createdMeta.id;
        seededNewCount++;
      } else {
        metaId = foundMeta.id;
        alreadyExistedCount++;
      }

      for (var a = 0; a < group.acoes.length; a++) {
        var acaoTemplate = group.acoes[a];
        var foundAcao = findByField(existingAcoes, 'titulo', acaoTemplate.titulo);
        if (!foundAcao) {
          var acaoPayload = {
            meta_id: metaId,
            titulo: acaoTemplate.titulo,
            prazo: acaoTemplate.prazo,
            prioridade: acaoTemplate.prioridade,
            status: acaoTemplate.status,
            origem_tipo: acaoTemplate.origem_tipo,
            descricao: acaoTemplate.descricao
          };
          Database.insertRecord('ACOES', acaoPayload);
          seededNewCount++;
        } else {
          // Se a ação existir mas estiver sem meta_id, vincula à meta correta
          if (!foundAcao.meta_id && metaId) {
            Database.updateRecord('ACOES', foundAcao.id, { meta_id: metaId });
          }
          alreadyExistedCount++;
        }
      }
    }

    // 5. FEEDBACKS (2 registros)
    var existingFeedbacks = Database.listRecords('FEEDBACKS');
    for (var f = 0; f < dataset.feedbacks.length; f++) {
      var fbItem = dataset.feedbacks[f];
      if (!findByField(existingFeedbacks, 'titulo', fbItem.titulo)) {
        Database.insertRecord('FEEDBACKS', fbItem);
        seededNewCount++;
      } else {
        alreadyExistedCount++;
      }
    }

    // 6. LIVROS (4 registros)
    var existingLivros = Database.listRecords('LIVROS');
    for (var l = 0; l < dataset.livros.length; l++) {
      var livroItem = dataset.livros[l];
      if (!findByField(existingLivros, 'titulo', livroItem.titulo)) {
        Database.insertRecord('LIVROS', livroItem);
        seededNewCount++;
      } else {
        alreadyExistedCount++;
      }
    }

    props.setProperty(PROP_SEED_FLAG, 'true');

    var finalCounts = {
      PLANOS_PDI: Database.listRecords('PLANOS_PDI').length,
      SWOT: Database.listRecords('SWOT').length,
      COMPETENCIAS: Database.listRecords('COMPETENCIAS').length,
      METAS: Database.listRecords('METAS').length,
      ACOES: Database.listRecords('ACOES').length,
      FEEDBACKS: Database.listRecords('FEEDBACKS').length,
      LIVROS: Database.listRecords('LIVROS').length
    };

    var totalVerified =
      finalCounts.PLANOS_PDI +
      finalCounts.SWOT +
      finalCounts.COMPETENCIAS +
      finalCounts.METAS +
      finalCounts.ACOES +
      finalCounts.FEEDBACKS +
      finalCounts.LIVROS;

    return {
      alreadySeeded: false,
      seededNewCount: seededNewCount,
      alreadyExistedCount: alreadyExistedCount,
      totalExpected: 35,
      totalVerified: totalVerified,
      countsByTable: finalCounts
    };
  }

  return {
    getPdiDataset: getPdiDataset,
    seedFranciscoPdi: seedFranciscoPdi
  };
})();

