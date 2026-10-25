/**
 * Elevare PDI — Camada Central de Banco de Dados (Google Sheets)
 * Gerencia conexão com a planilha, mapeamento de cabeçalhos, operações em lote e concorrência via LockService.
 */

var Database = (function () {
  var PROP_SPREADSHEET_ID = 'SPREADSHEET_ID';
  var LOCK_TIMEOUT_MS = 30000; // 30 segundos

  // Definição dos cabeçalhos explícitos de cada uma das abas do sistema
  var TABLE_SCHEMAS = {
    PLANOS_PDI: [
      'id',
      'titulo',
      'objetivo_profissional',
      'descricao',
      'cargo_desejado',
      'pontos_fortes',
      'oportunidades_melhoria',
      'competencias_relacionadas',
      'data_inicio',
      'prazo_final',
      'status',
      'indicadores_sucesso',
      'observacoes',
      'custom_fields',
      'created_at',
      'updated_at'
    ],
    CONFIG: [
      'chave',
      'valor',
      'descricao',
      'tipo',
      'created_at',
      'updated_at'
    ],
    MODULOS: [
      'id',
      'nome',
      'icone',
      'ativo',
      'ordem',
      'descricao',
      'created_at',
      'updated_at'
    ],
    CAMPOS_CUSTOM: [
      'id',
      'modulo_id',
      'campo_nome',
      'campo_chave',
      'tipo',
      'obrigatorio',
      'opcoes',
      'ativo',
      'ordem',
      'created_at',
      'updated_at'
    ],
    FEEDBACKS: [
      'id',
      'titulo',
      'data',
      'origem',
      'contexto',
      'descricao',
      'pontos_fortes',
      'oportunidades_melhoria',
      'competencias_relacionadas',
      'acoes_acordadas',
      'prazo_acompanhamento',
      'status',
      'prioridade',
      'tema',
      'observacoes_privadas',
      'custom_fields',
      'created_at',
      'updated_at'
    ],
    COMPETENCIAS: [
      'id',
      'nome',
      'tipo',
      'categoria',
      'descricao',
      'nivel_atual',
      'nivel_desejado',
      'importancia',
      'meta_desenvolvimento',
      'evidencias_resumo',
      'ultima_avaliacao_data',
      'proxima_revisao_data',
      'status',
      'custom_fields',
      'created_at',
      'updated_at'
    ],
    AVALIACOES: [
      'id',
      'competencia_id',
      'data',
      'nivel',
      'justificativa',
      'evidencias',
      'origem',
      'created_at',
      'updated_at'
    ],
    METAS: [
      'id',
      'titulo',
      'descricao',
      'objetivo_relacionado',
      'resultado_esperado',
      'indicador',
      'valor_inicial',
      'valor_alvo',
      'valor_atual',
      'data_inicial',
      'prazo',
      'prioridade',
      'status',
      'competencias_relacionadas',
      'criterio_conclusao',
      'evidencias',
      'progresso_manual',
      'custom_fields',
      'created_at',
      'updated_at'
    ],
    ACOES: [
      'id',
      'meta_id',
      'titulo',
      'descricao',
      'prioridade',
      'data_inicio',
      'prazo',
      'status',
      'tempo_estimado_horas',
      'tempo_realizado_horas',
      'observacoes',
      'evidencias',
      'origem_tipo',
      'origem_id',
      'custom_fields',
      'created_at',
      'updated_at'
    ],
    EVIDENCIAS: [
      'id',
      'titulo',
      'descricao',
      'tipo',
      'data',
      'competencia_id',
      'meta_id',
      'resultado_alcancado',
      'indicador_antes',
      'indicador_depois',
      'link_externo',
      'observacoes',
      'custom_fields',
      'created_at',
      'updated_at'
    ],
    LIVROS: [
      'id',
      'titulo',
      'autor',
      'categoria',
      'capa_url',
      'capa_cor',
      'status',
      'total_paginas',
      'pagina_atual',
      'percentual_leitura',
      'data_inicio',
      'data_conclusao',
      'avaliacao_pessoal',
      'resumo',
      'principais_aprendizados',
      'competencias_relacionadas',
      'aplicacao_pratica',
      'favorito',
      'estante',
      'observacoes',
      'custom_fields',
      'created_at',
      'updated_at'
    ],
    LEITURAS: [
      'id',
      'livro_id',
      'data',
      'paginas_lidas',
      'pagina_final',
      'duracao_minutos',
      'notas_sessao',
      'created_at',
      'updated_at'
    ],
    APRENDIZADOS: [
      'id',
      'titulo',
      'conteudo',
      'tipo_anotacao',
      'data',
      'origem_tipo',
      'origem_id',
      'competencias_relacionadas',
      'aplicacao_pratica',
      'proxima_acao',
      'tags',
      'created_at',
      'updated_at'
    ],
    CURSOS: [
      'id',
      'nome',
      'instituicao',
      'categoria',
      'carga_horaria_horas',
      'data_inicio',
      'data_prevista_conclusao',
      'data_conclusao',
      'status',
      'competencias_desenvolvidas',
      'certificado_url',
      'observacoes',
      'custom_fields',
      'created_at',
      'updated_at'
    ],
    REUNIOES: [
      'id',
      'data',
      'pauta',
      'conquistas_recentes',
      'dificuldades_bloqueios',
      'feedbacks_discutidos',
      'competencias_abordadas',
      'decisoes',
      'acoes_acordadas',
      'proximos_passos',
      'data_proxima_reuniao',
      'status',
      'custom_fields',
      'created_at',
      'updated_at'
    ],
    HISTORICO: [
      'id',
      'operacao',
      'modulo',
      'registro_id',
      'resumo',
      'usuario_email',
      'created_at'
    ]
  };

  /**
   * Obtém a instância da planilha configurada via Script Properties.
   * Lança erro caso ainda não tenha sido configurada.
   * @return {GoogleAppsScript.Spreadsheet.Spreadsheet}
   */
  function getSpreadsheet() {
    var props = PropertiesService.getScriptProperties();
    var spreadsheetId = props.getProperty(PROP_SPREADSHEET_ID);
    
    if (!spreadsheetId) {
      throw new Error('SPREADSHEET_ID_NAO_CONFIGURADO');
    }
    
    try {
      return SpreadsheetApp.openById(spreadsheetId);
    } catch (e) {
      throw new Error('Não foi possível abrir a planilha vinculada (ID: ' + spreadsheetId + '). Verifique suas permissões.');
    }
  }

  /**
   * Retorna os cabeçalhos da primeira linha e seu mapa { nomeColuna: indice1Based }.
   * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet Aba da planilha
   * @return {{ headers: string[], map: Object.<string, number> }}
   */
  function getHeaderMap(sheet) {
    var lastCol = sheet.getLastColumn();
    if (lastCol === 0) {
      return { headers: [], map: {} };
    }
    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    var map = {};
    for (var i = 0; i < headers.length; i++) {
      var headerName = String(headers[i]).trim();
      if (headerName) {
        map[headerName] = i + 1; // 1-indexed para o Apps Script Range
      }
    }
    return { headers: headers, map: map };
  }

  /**
   * Inicializa o banco de dados de maneira idempotente.
   * Se nenhuma planilha for fornecida, cria uma dedicada no Google Drive.
   * Cria todas as 15 abas ausentes com seus cabeçalhos.
   * Nunca apaga dados existentes.
   * @param {string} [customSpreadsheetId] ID opcional de planilha existente
   * @return {Object} Resumo da inicialização
   */
  function setupDatabase(customSpreadsheetId) {
    var lock = LockService.getScriptLock();
    try {
      lock.waitLock(LOCK_TIMEOUT_MS);
    } catch (e) {
      throw new Error('Timeout ao aguardar lock do sistema para inicialização.');
    }

    try {
      var spreadsheet;
      var createdNew = false;
      var props = PropertiesService.getScriptProperties();

      if (customSpreadsheetId && customSpreadsheetId.trim()) {
        spreadsheet = SpreadsheetApp.openById(customSpreadsheetId.trim());
      } else {
        var existingId = props.getProperty(PROP_SPREADSHEET_ID);
        if (existingId) {
          try {
            spreadsheet = SpreadsheetApp.openById(existingId);
          } catch (e) {
            spreadsheet = null;
          }
        }
        if (!spreadsheet) {
          spreadsheet = SpreadsheetApp.create('Elevare PDI — Banco de Dados');
          createdNew = true;
        }
      }

      var ssId = spreadsheet.getId();
      props.setProperty(PROP_SPREADSHEET_ID, ssId);

      var sheetsCreated = [];
      var sheetsAlreadyExisted = [];

      // Itera por todas as 15 tabelas definidas no esquema
      var tableNames = Object.keys(TABLE_SCHEMAS);
      for (var t = 0; t < tableNames.length; t++) {
        var tableName = tableNames[t];
        var expectedHeaders = TABLE_SCHEMAS[tableName];
        var sheet = spreadsheet.getSheetByName(tableName);

        if (!sheet) {
          sheet = spreadsheet.insertSheet(tableName);
          // Grava cabeçalhos na linha 1
          sheet.getRange(1, 1, 1, expectedHeaders.length).setValues([expectedHeaders]);
          
          // Estiliza cabeçalho para melhor legibilidade
          var headerRange = sheet.getRange(1, 1, 1, expectedHeaders.length);
          headerRange.setFontWeight('bold');
          headerRange.setBackground('#1e293b');
          headerRange.setFontColor('#ffffff');
          sheet.setFrozenRows(1);
          
          sheetsCreated.push(tableName);
        } else {
          sheetsAlreadyExisted.push(tableName);
          // Verifica se há colunas ausentes e adiciona ao final sem mexer nos dados existentes
          var currentMap = getHeaderMap(sheet);
          var missingHeaders = [];
          for (var h = 0; h < expectedHeaders.length; h++) {
            var colName = expectedHeaders[h];
            if (!currentMap.map[colName]) {
              missingHeaders.push(colName);
            }
          }
          if (missingHeaders.length > 0) {
            var startCol = sheet.getLastColumn() + 1;
            sheet.getRange(1, startCol, 1, missingHeaders.length).setValues([missingHeaders]);
          }
        }
      }

      // Remove a aba padrão inicial ('Página1' ou 'Sheet1') se estiver vazia
      var defaultSheet = spreadsheet.getSheetByName('Página1') || spreadsheet.getSheetByName('Sheet1');
      if (defaultSheet && spreadsheet.getSheets().length > 1 && defaultSheet.getLastRow() <= 1) {
        try {
          spreadsheet.deleteSheet(defaultSheet);
        } catch (e) {
          // Ignora se não for possível deletar
        }
      }

      // Popula dados essenciais padrão se CONFIG estiver vazia
      seedDefaultConfigs(spreadsheet);
      seedDefaultModules(spreadsheet);

      // Registra evento no HISTORICO
      logHistory(spreadsheet, 'SETUP', 'BANCO', ssId, 'Inicialização do banco de dados concluída.');

      return {
        spreadsheetId: ssId,
        spreadsheetName: spreadsheet.getName(),
        spreadsheetUrl: spreadsheet.getUrl(),
        createdNew: createdNew,
        sheetsCreated: sheetsCreated,
        sheetsAlreadyExisted: sheetsAlreadyExisted,
        totalSheets: spreadsheet.getSheets().length
      };
    } finally {
      lock.releaseLock();
    }
  }

  /**
   * Popula valores iniciais de configuração caso a aba CONFIG esteja sem registros.
   */
  function seedDefaultConfigs(spreadsheet) {
    var sheet = spreadsheet.getSheetByName('CONFIG');
    if (!sheet) return;
    if (sheet.getLastRow() <= 1) {
      var now = Validation.nowISO();
      var defaultConfigs = [
        ['APP_NAME', 'Elevare PDI', 'Nome do aplicativo', 'string', now, now],
        ['THEME_DEFAULT', 'dark', 'Tema visual padrão da interface', 'string', now, now],
        ['SCALE_MIN', '1', 'Escala mínima de domínio de competências', 'number', now, now],
        ['SCALE_MAX', '5', 'Escala máxima de domínio de competências', 'number', now, now],
        ['SHEET_VERSION', '1.0.0', 'Versão do esquema de dados', 'string', now, now]
      ];
      sheet.getRange(2, 1, defaultConfigs.length, defaultConfigs[0].length).setValues(defaultConfigs);
    }
  }

  /**
   * Popula a lista inicial de módulos caso a aba MODULOS esteja sem registros.
   */
  function seedDefaultModules(spreadsheet) {
    var sheet = spreadsheet.getSheetByName('MODULOS');
    if (!sheet) return;
    if (sheet.getLastRow() <= 1) {
      var now = Validation.nowISO();
      var defaultModules = [
        ['mod_dashboard', 'Dashboard', 'layout-dashboard', true, 1, 'Visão geral e indicadores', now, now],
        ['mod_pdi', 'Meu PDI', 'compass', true, 2, 'Planos de desenvolvimento', now, now],
        ['mod_skills', 'Hard & Soft Skills', 'sparkles', true, 3, 'Matriz de competências e autoavaliação', now, now],
        ['mod_metas', 'Metas & Ações', 'target', true, 4, 'Metas SMART e plano de ação', now, now],
        ['mod_feedbacks', 'Feedbacks', 'message-square', true, 5, 'Registro e acompanhamento de feedbacks', now, now],
        ['mod_biblioteca', 'Biblioteca 3D', 'book-open', true, 6, 'Estante tridimensional de leituras', now, now],
        ['mod_evidencias', 'Evidências', 'award', true, 7, 'Repositório de comprovações de impacto', now, now],
        ['mod_aprendizados', 'Aprendizados', 'lightbulb', true, 8, 'Anotações e insights práticos', now, now],
        ['mod_cursos', 'Cursos & Certificações', 'graduation-cap', true, 9, 'Treinamentos e formações', now, now],
        ['mod_reunioes', 'Reuniões 1:1', 'users', true, 10, 'Acompanhamento com a liderança', now, now],
        ['mod_configuracoes', 'Configurações', 'settings', true, 11, 'Personalização de módulos e campos', now, now]
      ];
      sheet.getRange(2, 1, defaultModules.length, defaultModules[0].length).setValues(defaultModules);
    }
  }

  /**
   * Registra uma ação no histórico auditável.
   */
  function logHistory(spreadsheet, operacao, modulo, registroId, resumo) {
    try {
      var ss = spreadsheet || getSpreadsheet();
      var sheet = ss.getSheetByName('HISTORICO');
      if (!sheet) return;
      var now = Validation.nowISO();
      var id = Validation.generateUUID();
      var email = Security.getCurrentUserEmail();
      sheet.appendRow([id, operacao, modulo, String(registroId || ''), String(resumo || ''), email, now]);
    } catch (e) {
      // Falha de log não deve interromper fluxo primário, mas registra no console
      Logger.log('Erro ao gravar HISTORICO: ' + e.message);
    }
  }

  /**
   * Encontra o índice da linha (1-indexed) de um registro pelo ID.
   * Lê apenas a coluna do ID para otimizar desempenho.
   * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet Aba
   * @param {string} id ID buscado
   * @param {number} idColIndex Índice (1-indexed) da coluna ID
   * @return {number} Número da linha ou -1 se não encontrado
   */
  function findRowIndexById(sheet, id, idColIndex) {
    var lastRow = sheet.getLastRow();
    if (lastRow <= 1) return -1;
    var idValues = sheet.getRange(2, idColIndex, lastRow - 1, 1).getValues();
    for (var i = 0; i < idValues.length; i++) {
      if (String(idValues[i][0]) === String(id)) {
        return i + 2; // +2 porque o range começou na linha 2 (1-based)
      }
    }
    return -1;
  }

  /**
   * Garante que uma tabela permitida exista na planilha com seus cabeçalhos formatados.
   * Não apaga dados existentes.
   * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} ss Planilha
   * @param {string} tableName Nome da tabela
   * @return {GoogleAppsScript.Spreadsheet.Sheet}
   */
  function ensureTable(ss, tableName) {
    var sheet = ss.getSheetByName(tableName);
    if (!sheet) {
      var expectedHeaders = TABLE_SCHEMAS[tableName];
      if (!expectedHeaders) {
        throw new Error('Esquema não encontrado para tabela ' + tableName);
      }
      sheet = ss.insertSheet(tableName);
      sheet.getRange(1, 1, 1, expectedHeaders.length).setValues([expectedHeaders]);
      var headerRange = sheet.getRange(1, 1, 1, expectedHeaders.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#1e293b');
      headerRange.setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }
    return sheet;
  }

  /**
   * Insere um novo registro na tabela indicada.
   * @param {string} tableName Nome da tabela
   * @param {Object} record Objeto contendo os campos
   * @return {Object} Registro inserido com id e timestamps
   */
  function insertRecord(tableName, record) {
    var validTable = Security.assertAllowedTable(tableName);
    Validation.validateRecord(validTable, record, false);

    var lock = LockService.getScriptLock();
    try {
      lock.waitLock(LOCK_TIMEOUT_MS);
    } catch (e) {
      throw new Error('Lock timeout: não foi possível obter acesso de gravação exclusivo.');
    }

    try {
      var ss = getSpreadsheet();
      var sheet = ss.getSheetByName(validTable);
      if (!sheet) {
        sheet = ensureTable(ss, validTable);
      }

      var headerData = getHeaderMap(sheet);
      var headers = headerData.headers;
      var map = headerData.map;

      // Atribui UUID e timestamps
      var finalRecord = {};
      for (var key in record) {
        if (record.hasOwnProperty(key)) {
          finalRecord[key] = Security.sanitizeInput(record[key]);
        }
      }

      if (!finalRecord.id) {
        finalRecord.id = Validation.generateUUID();
      }
      var now = Validation.nowISO();
      finalRecord.created_at = now;
      finalRecord.updated_at = now;

      // Trata serialização de custom_fields e arrays para JSON
      if (typeof finalRecord.custom_fields === 'object') {
        finalRecord.custom_fields = JSON.stringify(finalRecord.custom_fields);
      }
      if (Array.isArray(finalRecord.competencias_relacionadas)) {
        finalRecord.competencias_relacionadas = JSON.stringify(finalRecord.competencias_relacionadas);
      }
      if (Array.isArray(finalRecord.competencias_desenvolvidas)) {
        finalRecord.competencias_desenvolvidas = JSON.stringify(finalRecord.competencias_desenvolvidas);
      }
      if (Array.isArray(finalRecord.competencias_abordadas)) {
        finalRecord.competencias_abordadas = JSON.stringify(finalRecord.competencias_abordadas);
      }

      // Monta linha conforme a ordem exata dos cabeçalhos
      var rowValues = new Array(headers.length);
      for (var h = 0; h < headers.length; h++) {
        var headerName = headers[h];
        var val = finalRecord[headerName];
        rowValues[h] = val !== undefined && val !== null ? val : '';
      }

      sheet.appendRow(rowValues);
      logHistory(ss, 'CRIAR', validTable, finalRecord.id, 'Registro criado na tabela ' + validTable);

      return finalRecord;
    } finally {
      lock.releaseLock();
    }
  }

  /**
   * Obtém um registro pelo ID.
   * @param {string} tableName Nome da tabela
   * @param {string} id ID do registro
   * @return {Object|null}
   */
  function getRecordById(tableName, id) {
    var validTable = Security.assertAllowedTable(tableName);
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName(validTable);
    if (!sheet) return null;

    var headerData = getHeaderMap(sheet);
    var idCol = headerData.map['id'] || headerData.map['chave'];
    if (!idCol) return null;

    var rowIndex = findRowIndexById(sheet, id, idCol);
    if (rowIndex === -1) return null;

    var rowValues = sheet.getRange(rowIndex, 1, 1, headerData.headers.length).getValues()[0];
    var obj = {};
    for (var i = 0; i < headerData.headers.length; i++) {
      var colName = headerData.headers[i];
      obj[colName] = rowValues[i];
    }
    return obj;
  }

  /**
   * Lista registros de uma tabela com suporte a filtros, ordenação e limite.
   * Lê todos os dados em lote com getValues().
   * @param {string} tableName Nome da tabela
   * @param {Object} [options] Opções de busca
   * @return {Array.<Object>}
   */
  function listRecords(tableName, options) {
    var validTable = Security.assertAllowedTable(tableName);
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName(validTable);
    if (!sheet) return [];

    var lastRow = sheet.getLastRow();
    var lastCol = sheet.getLastColumn();
    if (lastRow <= 1 || lastCol === 0) {
      return [];
    }

    var headerData = getHeaderMap(sheet);
    var headers = headerData.headers;
    var allData = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();

    var results = [];
    options = options || {};
    var filter = options.filter || {};

    for (var r = 0; r < allData.length; r++) {
      var row = allData[r];
      var item = {};
      var match = true;

      for (var c = 0; c < headers.length; c++) {
        var hName = headers[c];
        item[hName] = row[c];
      }

      // Aplica filtros se informados
      for (var fKey in filter) {
        if (filter.hasOwnProperty(fKey)) {
          if (String(item[fKey]) !== String(filter[fKey])) {
            match = false;
            break;
          }
        }
      }

      if (match) {
        results.push(item);
      }
    }

    // Ordenação (padrão: created_at desc se existir)
    var sortField = options.sortField || 'created_at';
    var sortOrder = options.sortOrder || 'desc';
    if (headerData.map[sortField]) {
      results.sort(function (a, b) {
        var valA = a[sortField] || '';
        var valB = b[sortField] || '';
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Paginação
    if (options.limit && options.limit > 0) {
      var offset = options.offset || 0;
      results = results.slice(offset, offset + options.limit);
    }

    return results;
  }

  /**
   * Atualiza um registro existente preservando campos inalterados.
   * @param {string} tableName Nome da tabela
   * @param {string} id ID do registro
   * @param {Object} updates Campos a atualizar
   * @return {Object} Registro atualizado
   */
  function updateRecord(tableName, id, updates) {
    var validTable = Security.assertAllowedTable(tableName);
    Validation.validateRecord(validTable, updates, true);

    var lock = LockService.getScriptLock();
    try {
      lock.waitLock(LOCK_TIMEOUT_MS);
    } catch (e) {
      throw new Error('Lock timeout ao atualizar registro.');
    }

    try {
      var ss = getSpreadsheet();
      var sheet = ss.getSheetByName(validTable);
      if (!sheet) throw new Error('Aba não encontrada.');

      var headerData = getHeaderMap(sheet);
      var idCol = headerData.map['id'] || headerData.map['chave'];
      if (!idCol) throw new Error('Coluna de identificador não encontrada.');

      var rowIndex = findRowIndexById(sheet, id, idCol);
      if (rowIndex === -1) {
        throw new Error('Registro com ID ' + id + ' não foi encontrado na tabela ' + validTable + '.');
      }

      var currentValues = sheet.getRange(rowIndex, 1, 1, headerData.headers.length).getValues()[0];
      var currentRecord = {};
      for (var i = 0; i < headerData.headers.length; i++) {
        currentRecord[headerData.headers[i]] = currentValues[i];
      }

      // Aplica atualizações
      for (var uKey in updates) {
        if (updates.hasOwnProperty(uKey) && uKey !== 'id' && uKey !== 'chave' && uKey !== 'created_at') {
          currentRecord[uKey] = Security.sanitizeInput(updates[uKey]);
        }
      }
      currentRecord.updated_at = Validation.nowISO();

      // Serializa campos complexos
      if (typeof currentRecord.custom_fields === 'object') {
        currentRecord.custom_fields = JSON.stringify(currentRecord.custom_fields);
      }

      var newRow = new Array(headerData.headers.length);
      for (var h = 0; h < headerData.headers.length; h++) {
        var hName = headerData.headers[h];
        newRow[h] = currentRecord[hName] !== undefined ? currentRecord[hName] : '';
      }

      // Gravação em lote de toda a linha atualizada
      sheet.getRange(rowIndex, 1, 1, headerData.headers.length).setValues([newRow]);
      logHistory(ss, 'EDITAR', validTable, id, 'Registro atualizado na tabela ' + validTable);

      return currentRecord;
    } finally {
      lock.releaseLock();
    }
  }

  /**
   * Exclui ou arquiva um registro.
   * @param {string} tableName Nome da tabela
   * @param {string} id ID do registro
   * @param {boolean} [softDelete=true] Se true, atualiza status para 'arquivado'. Se false, apaga a linha.
   * @return {boolean}
   */
  function deleteRecord(tableName, id, softDelete) {
    var validTable = Security.assertAllowedTable(tableName);
    var isSoft = softDelete !== false; // padrão é arquivamento seguro

    var lock = LockService.getScriptLock();
    try {
      lock.waitLock(LOCK_TIMEOUT_MS);
    } catch (e) {
      throw new Error('Lock timeout ao remover registro.');
    }

    try {
      var ss = getSpreadsheet();
      var sheet = ss.getSheetByName(validTable);
      if (!sheet) throw new Error('Aba não encontrada.');

      var headerData = getHeaderMap(sheet);
      var idCol = headerData.map['id'] || headerData.map['chave'];
      var rowIndex = findRowIndexById(sheet, id, idCol);
      if (rowIndex === -1) {
        throw new Error('Registro com ID ' + id + ' não encontrado para exclusão.');
      }

      if (isSoft && headerData.map['status']) {
        sheet.getRange(rowIndex, headerData.map['status']).setValue('arquivado');
        if (headerData.map['updated_at']) {
          sheet.getRange(rowIndex, headerData.map['updated_at']).setValue(Validation.nowISO());
        }
        logHistory(ss, 'ARQUIVAR', validTable, id, 'Registro arquivado na tabela ' + validTable);
      } else {
        sheet.deleteRow(rowIndex);
        logHistory(ss, 'EXCLUIR', validTable, id, 'Registro excluído fisicamente da tabela ' + validTable);
      }

      return true;
    } finally {
      lock.releaseLock();
    }
  }

  /**
   * Verifica a integridade e conectividade do banco de dados.
   * Retorna informações de diagnóstico e contagem de linhas por aba.
   * @return {Object}
   */
  function pingDatabase() {
    var props = PropertiesService.getScriptProperties();
    var spreadsheetId = props.getProperty(PROP_SPREADSHEET_ID);

    if (!spreadsheetId) {
      return {
        configured: false,
        status: 'NAO_CONFIGURADO',
        message: 'A planilha ainda não foi configurada. Execute a instalação inicial.'
      };
    }

    try {
      var ss = SpreadsheetApp.openById(spreadsheetId);
      var sheets = ss.getSheets();
      var sheetSummary = [];

      for (var s = 0; s < sheets.length; s++) {
        var sh = sheets[s];
        sheetSummary.push({
          name: sh.getName(),
          rows: Math.max(0, sh.getLastRow() - 1), // Desconsidera a linha de cabeçalho
          cols: sh.getLastColumn()
        });
      }

      return {
        configured: true,
        status: 'CONECTADO',
        spreadsheetId: spreadsheetId,
        spreadsheetName: ss.getName(),
        spreadsheetUrl: ss.getUrl(),
        currentUser: Security.getCurrentUserEmail(),
        totalSheets: sheets.length,
        sheets: sheetSummary,
        timestamp: Validation.nowISO()
      };
    } catch (e) {
      return {
        configured: true,
        status: 'ERRO_CONEXAO',
        spreadsheetId: spreadsheetId,
        error: e.message
      };
    }
  }

  return {
    setupDatabase: setupDatabase,
    getSpreadsheet: getSpreadsheet,
    getHeaderMap: getHeaderMap,
    insertRecord: insertRecord,
    getRecordById: getRecordById,
    listRecords: listRecords,
    updateRecord: updateRecord,
    deleteRecord: deleteRecord,
    pingDatabase: pingDatabase,
    logHistory: logHistory
  };
})();
