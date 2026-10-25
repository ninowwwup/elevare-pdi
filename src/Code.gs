/**
 * Elevare PDI — Ponto de Entrada Principal (Google Apps Script)
 * Roteia requisições doGet(), gerencia templates e expõe a API para o frontend via google.script.run.
 */

/**
 * Ponto de entrada Web App (GET).
 * Entrega a aplicação web responsiva em HTML5.
 */
function doGet(e) {
  var template = HtmlService.createTemplateFromFile('Index');
  
  // Passa dados iniciais seguros de contexto se necessário
  template.appTitle = 'Elevare PDI — Personal Development Hub';
  template.userEmail = Security.getCurrentUserEmail();

  return template
    .evaluate()
    .setTitle('Elevare PDI — Personal Development Hub')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
    .addMetaTag('description', 'Hub pessoal de desenvolvimento profissional, competências, metas e biblioteca 3D')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Função utilitária para inclusão modular de arquivos HTML (CSS, componentes e scripts).
 * Utilizada dentro do Index.html com a sintaxe: <?!= include('NomeDoArquivo'); ?>
 * @param {string} filename Nome do arquivo sem a extensão .html
 * @return {string} Conteúdo HTML puro
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Instalação e verificação inicial da aplicação.
 * Pode ser executada manualmente no editor pelo proprietário ou via interface.
 * Cria/vincula a planilha dedicada, configura as 15 abas e popula dados essenciais.
 * @return {Object} Resumo com status da instalação
 */
function setupApplication() {
  try {
    Logger.log('Iniciando setupApplication do Elevare PDI...');
    var result = Database.setupDatabase();
    Logger.log('✅ Instalação concluída com sucesso!');
    Logger.log('Planilha: ' + result.spreadsheetName);
    Logger.log('URL: ' + result.spreadsheetUrl);
    Logger.log('Total de abas: ' + result.totalSheets);
    return Security.createSuccessResponse(result, 'Instalação da aplicação concluída com sucesso.');
  } catch (err) {
    Logger.log('❌ Falha na instalação: ' + err.message);
    return Security.createErrorResponse(err);
  }
}

// ============================================================================
// API RPC EXPOSTA PARA O FRONTEND (CHAMADA VIA google.script.run)
// ============================================================================

/**
 * Teste simples de conexão (Ping/Pong).
 */
function apiPing() {
  try {
    return Security.createSuccessResponse({
      pong: true,
      user: Security.getCurrentUserEmail(),
      timestamp: Validation.nowISO()
    });
  } catch (err) {
    return Security.createErrorResponse(err);
  }
}

/**
 * Executa o setup a partir da interface do usuário.
 * @param {string} [customSpreadsheetId] ID opcional de planilha existente
 */
function apiSetup(customSpreadsheetId) {
  try {
    var result = Database.setupDatabase(customSpreadsheetId);
    return Security.createSuccessResponse(result, 'Banco de dados configurado com sucesso.');
  } catch (err) {
    return Security.createErrorResponse(err);
  }
}

/**
 * Retorna o status de conexão e estatísticas das abas da planilha.
 */
function apiGetDatabaseStatus() {
  try {
    var status = Database.pingDatabase();
    return Security.createSuccessResponse(status);
  } catch (err) {
    return Security.createErrorResponse(err);
  }
}

/**
 * Obtém a lista dos módulos ativos para renderizar a barra de navegação.
 */
function apiGetActiveModules() {
  try {
    var modules = Modules.getActiveModules();
    return Security.createSuccessResponse(modules);
  } catch (err) {
    return Security.createErrorResponse(err);
  }
}

/**
 * Lista registros de uma tabela com filtros e paginação opcionais.
 * @param {string} tableName Nome da tabela
 * @param {Object} [options] Opções de filtro/ordenação
 */
function apiListRecords(tableName, options) {
  try {
    var records = Database.listRecords(tableName, options);
    return Security.createSuccessResponse(records);
  } catch (err) {
    return Security.createErrorResponse(err);
  }
}

/**
 * Obtém um único registro pelo seu identificador.
 * @param {string} tableName Nome da tabela
 * @param {string} id ID do registro
 */
function apiGetRecord(tableName, id) {
  try {
    var record = Database.getRecordById(tableName, id);
    if (!record) {
      return Security.createErrorResponse(new Error('Registro não encontrado.'));
    }
    return Security.createSuccessResponse(record);
  } catch (err) {
    return Security.createErrorResponse(err);
  }
}

/**
 * Cria um novo registro com validação e lock de concorrência.
 * @param {string} tableName Nome da tabela
 * @param {Object} record Dados do registro
 */
function apiCreateRecord(tableName, record) {
  try {
    var created = Database.insertRecord(tableName, record);
    return Security.createSuccessResponse(created, 'Registro cadastrado com sucesso.');
  } catch (err) {
    return Security.createErrorResponse(err);
  }
}

/**
 * Atualiza um registro existente.
 * @param {string} tableName Nome da tabela
 * @param {string} id ID do registro
 * @param {Object} updates Dados alterados
 */
function apiUpdateRecord(tableName, id, updates) {
  try {
    var updated = Database.updateRecord(tableName, id, updates);
    return Security.createSuccessResponse(updated, 'Registro atualizado com sucesso.');
  } catch (err) {
    return Security.createErrorResponse(err);
  }
}

/**
 * Exclui ou arquiva um registro.
 * @param {string} tableName Nome da tabela
 * @param {string} id ID do registro
 * @param {boolean} [softDelete=true] Se deve apenas arquivar
 */
function apiDeleteRecord(tableName, id, softDelete) {
  try {
    var success = Database.deleteRecord(tableName, id, softDelete);
    return Security.createSuccessResponse({ deleted: success }, 'Registro processado com sucesso.');
  } catch (err) {
    return Security.createErrorResponse(err);
  }
}

/**
 * Executa uma verificação real de ponta a ponta da persistência no Google Sheets.
 * Grava um registro real, lê-o de volta, confere os dados e grava o teste no histórico.
 */
function apiRunPersistenceTest(testNote) {
  try {
    var status = Database.pingDatabase();
    if (!status.configured || status.status !== 'CONECTADO') {
      throw new Error('Banco de dados não está pronto para o teste. Execute a configuração inicial primeiro.');
    }

    var testId = Validation.generateUUID();
    var note = testNote || 'Teste de validação de persistência da Fase 1';
    
    // Inserção real
    var inserted = Database.insertRecord('HISTORICO', {
      id: testId,
      operacao: 'TESTE_PERSISTENCIA',
      modulo: 'SISTEMA',
      registro_id: testId,
      resumo: note,
      usuario_email: Security.getCurrentUserEmail()
    });

    // Leitura real imediata do registro gravado
    var readBack = Database.getRecordById('HISTORICO', testId);
    if (!readBack || readBack.id !== testId) {
      throw new Error('Falha de verificação: O registro gravado não pôde ser recuperado.');
    }

    return Security.createSuccessResponse({
      verified: true,
      insertedRecord: inserted,
      readRecord: readBack,
      timestamp: Validation.nowISO(),
      spreadsheetUrl: status.spreadsheetUrl
    }, 'Teste de gravação e leitura real no Google Sheets executado com 100% de sucesso!');
  } catch (err) {
    return Security.createErrorResponse(err);
  }
}
