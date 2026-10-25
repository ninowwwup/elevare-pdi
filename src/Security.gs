/**
 * Elevare PDI — Módulo de Segurança e Acesso
 * Centraliza validações de permissões, sanitização e tratamento seguro de exceções.
 */

var Security = (function () {
  // Lista estrita de tabelas permitidas no banco de dados (Whitelist)
  var ALLOWED_TABLES = [
    'PLANOS_PDI',
    'CONFIG',
    'MODULOS',
    'CAMPOS_CUSTOM',
    'FEEDBACKS',
    'COMPETENCIAS',
    'AVALIACOES',
    'METAS',
    'ACOES',
    'EVIDENCIAS',
    'LIVROS',
    'LEITURAS',
    'APRENDIZADOS',
    'CURSOS',
    'REUNIOES',
    'HISTORICO'
  ];

  /**
   * Verifica se o nome da tabela faz parte da lista permitida.
   * Evita injeção ou acesso a abas arbitrárias da planilha.
   * @param {string} tableName Nome da aba/tabela
   */
  function assertAllowedTable(tableName) {
    if (!tableName || typeof tableName !== 'string') {
      throw new Error('Nome de tabela inválido.');
    }
    var upper = tableName.toUpperCase().trim();
    if (ALLOWED_TABLES.indexOf(upper) === -1) {
      throw new Error('Acesso negado: tabela não permitida (' + tableName + ').');
    }
    return upper;
  }

  /**
   * Obtém o e-mail do usuário autenticado no Apps Script.
   * @return {string} E-mail do usuário ou 'desconhecido'
   */
  function getCurrentUserEmail() {
    try {
      var user = Session.getActiveUser();
      var email = user ? user.getEmail() : '';
      return email || 'usuario-local@elevare.pdi';
    } catch (e) {
      return 'usuario-local@elevare.pdi';
    }
  }

  /**
   * Sanitiza strings contra scripts indesejados (XSS) ao lidar com entradas de texto livre.
   * @param {any} val Valor de entrada
   * @return {any} Valor limpo
   */
  function sanitizeInput(val) {
    if (val === null || val === undefined) {
      return '';
    }
    if (typeof val === 'string') {
      // Remove tags HTML perigosas básicas se existirem
      return val
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .trim();
    }
    return val;
  }

  /**
   * Formata mensagens de erro de forma segura para o usuário final,
   * omitindo detalhes de infraestrutura ou dados sensíveis.
   * @param {Error|any} err Erro capturado
   * @return {string} Mensagem segura
   */
  function safeErrorMessage(err) {
    if (!err) return 'Ocorreu um erro desconhecido.';
    var msg = err.message ? err.message : String(err);
    
    // Filtra erros comuns do Apps Script para mensagens amigáveis
    if (msg.indexOf('Lock timeout') !== -1 || msg.indexOf('lock') !== -1) {
      return 'O sistema está processando outra solicitação no momento. Por favor, tente novamente em alguns segundos.';
    }
    if (msg.indexOf('SPREADSHEET_ID_NAO_CONFIGURADO') !== -1) {
      return 'A planilha do banco de dados ainda não foi configurada. Execute a instalação inicial em setupApplication().';
    }
    if (msg.indexOf('Não foi possível encontrar a planilha') !== -1 || msg.indexOf('Spreadsheet not found') !== -1) {
      return 'Não foi possível acessar a planilha vinculada. Verifique se o ID está correto e se você possui permissão.';
    }
    
    return msg;
  }

  /**
   * Cria o envelope padrão de resposta de sucesso para o frontend.
   * @param {any} data Dados a retornar
   * @param {string} message Mensagem opcional
   */
  function createSuccessResponse(data, message) {
    return {
      success: true,
      data: data,
      message: message || 'Operação realizada com sucesso.'
    };
  }

  /**
   * Cria o envelope padrão de resposta de erro para o frontend.
   * @param {Error|string} err Erro
   */
  function createErrorResponse(err) {
    return {
      success: false,
      error: safeErrorMessage(err)
    };
  }

  return {
    assertAllowedTable: assertAllowedTable,
    getCurrentUserEmail: getCurrentUserEmail,
    sanitizeInput: sanitizeInput,
    safeErrorMessage: safeErrorMessage,
    createSuccessResponse: createSuccessResponse,
    createErrorResponse: createErrorResponse
  };
})();
