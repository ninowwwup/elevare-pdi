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
 * Executa uma verificação real de ponta a ponta da persistência no Google Sheets (Legado).
 */
function apiRunPersistenceTest(testNote) {
  return apiRunFullPersistenceValidation(testNote);
}

/**
 * Bateria completa de 7 testes de persistência real no Google Sheets.
 * Pode ser executada pelo editor do Apps Script (via runDatabaseDiagnostics) ou pelo frontend.
 *
 * 1. Conexão com a planilha
 * 2. Leitura dos cabeçalhos da tabela
 * 3. Criação de um registro de teste com prefixo TEST_
 * 4. Leitura imediata do registro criado
 * 5. Atualização do registro de teste
 * 6. Exclusão física do registro de teste
 * 7. Verificação de preservação dos demais registros (contagem antes == contagem depois)
 *
 * @param {string} [testNote] Nota opcional do teste
 * @return {Object} Envelope de resposta com o relatório dos 7 testes
 */
function apiRunFullPersistenceValidation(testNote) {
  try {
    var report = {
      timestamp: Validation.nowISO(),
      tests: [],
      allPassed: false
    };

    // TESTE 1: Conexão com a planilha
    var status = Database.pingDatabase();
    if (!status.configured || status.status !== 'CONECTADO') {
      throw new Error('Banco de dados não está configurado. Execute a função setupApplication() primeiro.');
    }
    report.tests.push({
      step: 1,
      name: 'Conexão com a Planilha',
      passed: true,
      detail: 'Conectado à planilha "' + status.spreadsheetName + '" (' + status.totalSheets + ' abas)'
    });

    var ss = Database.getSpreadsheet();
    var sheet = ss.getSheetByName('CONFIG');
    if (!sheet) {
      throw new Error('A aba CONFIG não foi encontrada na planilha.');
    }

    // Contagem inicial de linhas na aba CONFIG
    var initialRowCount = sheet.getLastRow();

    // TESTE 2: Leitura dos cabeçalhos da tabela
    var headerData = Database.getHeaderMap(sheet);
    if (!headerData.headers || headerData.headers.length === 0 || !headerData.map['chave']) {
      throw new Error('Cabeçalhos da aba CONFIG não puderam ser lidos corretamente.');
    }
    report.tests.push({
      step: 2,
      name: 'Leitura dos Cabeçalhos',
      passed: true,
      detail: 'Cabeçalhos identificados: ' + headerData.headers.join(', ')
    });

    // TESTE 3: Criação de um registro de teste explicitamente identificado
    var testKey = 'TEST_CONFIG_' + Validation.generateUUID().substring(0, 8);
    var note = testNote || 'Validação automatizada de persistência';
    var testRecord = {
      chave: testKey,
      valor: 'Valor inicial de teste: ' + note,
      descricao: 'Registro temporário para teste de persistência da Fase 1',
      tipo: 'string'
    };
    var inserted = Database.insertRecord('CONFIG', testRecord);
    report.tests.push({
      step: 3,
      name: 'Criação de Registro de Teste',
      passed: true,
      detail: 'Registro inserido com chave "' + testKey + '"'
    });

    // TESTE 4: Leitura do registro criado
    var readRecord = Database.getRecordById('CONFIG', testKey);
    if (!readRecord || readRecord.chave !== testKey || readRecord.valor !== testRecord.valor) {
      throw new Error('Falha ao recuperar o registro criado na aba CONFIG.');
    }
    report.tests.push({
      step: 4,
      name: 'Leitura do Registro Criado',
      passed: true,
      detail: 'Registro recuperado pelo ID com sucesso. Valor: "' + readRecord.valor + '"'
    });

    // TESTE 5: Atualização do registro criado
    var updatedValue = 'Valor atualizado com sucesso em ' + Validation.nowISO();
    var updated = Database.updateRecord('CONFIG', testKey, {
      valor: updatedValue
    });
    var readUpdated = Database.getRecordById('CONFIG', testKey);
    if (!readUpdated || readUpdated.valor !== updatedValue) {
      throw new Error('Falha ao validar a atualização do registro de teste.');
    }
    report.tests.push({
      step: 5,
      name: 'Atualização do Registro de Teste',
      passed: true,
      detail: 'Registro atualizado e confirmado. Novo valor: "' + readUpdated.valor + '"'
    });

    // TESTE 6: Exclusão física do registro de teste
    var deleted = Database.deleteRecord('CONFIG', testKey, false); // softDelete = false (exclusão física)
    var readAfterDelete = Database.getRecordById('CONFIG', testKey);
    if (readAfterDelete !== null) {
      throw new Error('O registro de teste ainda existe após o comando de exclusão.');
    }
    report.tests.push({
      step: 6,
      name: 'Exclusão do Registro de Teste',
      passed: true,
      detail: 'Registro temporário removido fisicamente da planilha com sucesso.'
    });

    // TESTE 7: Preservação dos demais registros
    var finalRowCount = sheet.getLastRow();
    if (finalRowCount !== initialRowCount) {
      throw new Error('A contagem de registros diverge (Inicial: ' + initialRowCount + ', Final: ' + finalRowCount + ').');
    }
    report.tests.push({
      step: 7,
      name: 'Preservação dos Demais Registros',
      passed: true,
      detail: 'Integridade confirmada. Total de linhas permaneceu idêntico (' + finalRowCount + '). Nenhum dado real foi alterado.'
    });

    report.allPassed = true;
    report.spreadsheetUrl = status.spreadsheetUrl;

    return Security.createSuccessResponse(report, 'Todos os 7 testes de persistência real no Google Sheets foram aprovados com 100% de sucesso!');
  } catch (err) {
    return Security.createErrorResponse(err);
  }
}

/**
 * Função utilitária para execução manual dos testes diretamente no editor do Apps Script.
 * Os resultados são impressos detalhadamente no Logger de execução.
 */
function runDatabaseDiagnostics() {
  Logger.log('====================================================');
  Logger.log('INICIANDO DIAGNÓSTICO DE PERSISTÊNCIA — ELEVARE PDI');
  Logger.log('====================================================');

  var response = apiRunFullPersistenceValidation('Diagnóstico via Editor Apps Script');
  if (response.success) {
    var rep = response.data;
    Logger.log('Status Geral: ✅ APROVADO');
    Logger.log('Planilha: ' + rep.spreadsheetUrl);
    for (var i = 0; i < rep.tests.length; i++) {
      var t = rep.tests[i];
      Logger.log('  [' + t.step + '/7] ✅ ' + t.name + ': ' + t.detail);
    }
    Logger.log('====================================================');
    Logger.log('TODOS OS TESTES FORAM CONCLUÍDOS COM SUCESSO!');
    Logger.log('====================================================');
  } else {
    Logger.log('Status Geral: ❌ FALHA');
    Logger.log('Erro: ' + response.error);
    Logger.log('====================================================');
  }
  return response;
}

