/**
 * Elevare PDI — Módulo de Validação e Integridade
 * Garante que os registros atendam às regras de negócio antes de serem gravados.
 */

var Validation = (function () {
  /**
   * Gera um identificador único universal (UUID v4) seguro e estável.
   * @return {string} UUID v4
   */
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      var v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Obtém a data e hora atual em formato ISO 8601.
   * @return {string} ISO 8601 string
   */
  function nowISO() {
    return new Date().toISOString();
  }

  /**
   * Valida o formato de uma data (YYYY-MM-DD).
   * @param {string} dateStr Data como texto
   * @return {boolean}
   */
  function isValidDateString(dateStr) {
    if (!dateStr || typeof dateStr !== 'string') return false;
    var regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr)) return false;
    var d = new Date(dateStr);
    return d instanceof Date && !isNaN(d.getTime());
  }

  /**
   * Validações de campos obrigatórios por tabela.
   */
  var REQUIRED_FIELDS = {
    PLANOS_PDI: ['titulo', 'objetivo_profissional', 'status'],
    SWOT: ['quadrante', 'titulo', 'impacto', 'status'],
    CONFIG: ['chave', 'valor'],
    MODULOS: ['id', 'nome', 'ativo', 'ordem'],
    CAMPOS_CUSTOM: ['modulo_id', 'campo_nome', 'campo_chave', 'tipo'],
    FEEDBACKS: ['titulo', 'data', 'origem', 'status', 'prioridade'],
    COMPETENCIAS: ['nome', 'tipo', 'nivel_atual', 'nivel_desejado', 'importancia', 'status'],
    AVALIACOES: ['competencia_id', 'data', 'nivel', 'justificativa', 'origem'],
    METAS: ['titulo', 'data_inicial', 'prazo', 'prioridade', 'status'],
    ACOES: ['titulo', 'prazo', 'prioridade', 'status', 'origem_tipo'],
    EVIDENCIAS: ['titulo', 'tipo', 'data'],
    LIVROS: ['titulo', 'status', 'total_paginas', 'pagina_atual'],
    LEITURAS: ['livro_id', 'data', 'paginas_lidas', 'pagina_final'],
    APRENDIZADOS: ['titulo', 'conteudo', 'tipo_anotacao', 'data', 'origem_tipo'],
    CURSOS: ['nome', 'status'],
    REUNIOES: ['data', 'pauta', 'status'],
    HISTORICO: ['operacao', 'modulo', 'resumo']
  };

  /**
   * Valida um registro antes de salvar.
   * @param {string} tableName Nome da tabela
   * @param {Object} record Objeto com os dados
   * @param {boolean} isUpdate Indica se é uma atualização
   */
  function validateRecord(tableName, record, isUpdate) {
    if (!record || typeof record !== 'object') {
      throw new Error('Dados do registro inválidos.');
    }

    var required = REQUIRED_FIELDS[tableName] || [];
    
    // Na criação, verifica campos obrigatórios
    if (!isUpdate) {
      for (var i = 0; i < required.length; i++) {
        var field = required[i];
        if (record[field] === undefined || record[field] === null || record[field] === '') {
          throw new Error('O campo obrigatório "' + field + '" não foi preenchido na tabela ' + tableName + '.');
        }
      }
    }

    // Regras de negócio específicas
    if (tableName === 'COMPETENCIAS' || tableName === 'AVALIACOES') {
      if (record.nivel_atual !== undefined) {
        var n = Number(record.nivel_atual);
        if (isNaN(n) || n < 1 || n > 5) {
          throw new Error('O nível atual da competência deve ser um número entre 1 e 5.');
        }
      }
      if (record.nivel_desejado !== undefined) {
        var nd = Number(record.nivel_desejado);
        if (isNaN(nd) || nd < 1 || nd > 5) {
          throw new Error('O nível desejado da competência deve ser um número entre 1 e 5.');
        }
      }
      if (record.nivel !== undefined) {
        var niv = Number(record.nivel);
        if (isNaN(niv) || niv < 1 || niv > 5) {
          throw new Error('O nível da avaliação deve ser um número entre 1 e 5.');
        }
      }
    }

    if (tableName === 'LIVROS') {
      var total = Number(record.total_paginas);
      var atual = Number(record.pagina_atual);
      if (!isNaN(total) && !isNaN(atual)) {
        if (atual > total && total > 0) {
          throw new Error('A página atual (' + atual + ') não pode ser maior que o total de páginas (' + total + ').');
        }
        if (atual < 0 || total < 0) {
          throw new Error('O número de páginas não pode ser negativo.');
        }
      }
    }

    if (tableName === 'LEITURAS') {
      var lidas = Number(record.paginas_lidas);
      if (!isNaN(lidas) && lidas < 0) {
        throw new Error('A quantidade de páginas lidas não pode ser negativa.');
      }
    }

    if (tableName === 'SWOT' && record.quadrante !== undefined) {
      var quadrantesValidos = ['forca', 'fraqueza', 'oportunidade', 'ameaca'];
      if (quadrantesValidos.indexOf(String(record.quadrante).toLowerCase()) === -1) {
        throw new Error('Quadrante SWOT inválido. Use: forca, fraqueza, oportunidade ou ameaca.');
      }
    }

    return true;
  }

  return {
    generateUUID: generateUUID,
    nowISO: nowISO,
    isValidDateString: isValidDateString,
    validateRecord: validateRecord
  };
})();
