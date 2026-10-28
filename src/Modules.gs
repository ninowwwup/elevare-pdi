/**
 * Elevare PDI — Módulo de Gerenciamento de Módulos e Personalização
 * Controla os módulos disponíveis, sua ordem, estado ativo/inativo e metadados.
 */

var Modules = (function () {
  /**
   * Obtém a lista de todos os módulos ordenados.
   * Se o banco já estiver inicializado, lê da aba MODULOS; caso contrário, retorna lista padrão.
   * @return {Array.<Object>}
   */
  function getAllModules() {
    try {
      var records = Database.listRecords('MODULOS', {
        sortField: 'ordem',
        sortOrder: 'asc'
      });
      if (records && records.length > 0) {
        return records;
      }
    } catch (e) {
      // Se a tabela ainda não existir ou não estiver configurada, usa o catálogo padrão
    }

    return [
      { id: 'mod_dashboard', nome: 'Dashboard', icone: 'layout-dashboard', ativo: true, ordem: 1, descricao: 'Visão geral e indicadores' },
      { id: 'mod_pdi', nome: 'Meu PDI', icone: 'compass', ativo: true, ordem: 2, descricao: 'Planos de desenvolvimento' },
      { id: 'mod_swot', nome: 'Método SWOT', icone: 'grid', ativo: true, ordem: 3, descricao: 'Matriz de Forças, Fraquezas, Oportunidades e Ameaças' },
      { id: 'mod_skills', nome: 'Hard & Soft Skills', icone: 'sparkles', ativo: true, ordem: 4, descricao: 'Matriz de competências e autoavaliação' },
      { id: 'mod_metas', nome: 'Metas & Ações', icone: 'target', ativo: true, ordem: 5, descricao: 'Metas SMART e plano de ação' },
      { id: 'mod_feedbacks', nome: 'Feedbacks', icone: 'message-square', ativo: true, ordem: 6, descricao: 'Registro e acompanhamento de feedbacks' },
      { id: 'mod_biblioteca', nome: 'Biblioteca 3D', icone: 'book-open', ativo: true, ordem: 7, descricao: 'Estante tridimensional de leituras' },
      { id: 'mod_evidencias', nome: 'Evidências', icone: 'award', ativo: true, ordem: 8, descricao: 'Repositório de comprovações de impacto' },
      { id: 'mod_aprendizados', nome: 'Aprendizados', icone: 'lightbulb', ativo: true, ordem: 9, descricao: 'Anotações e insights práticos' },
      { id: 'mod_cursos', nome: 'Cursos & Certificações', icone: 'graduation-cap', ativo: true, ordem: 10, descricao: 'Treinamentos e formações' },
      { id: 'mod_reunioes', nome: 'Reuniões 1:1', icone: 'users', ativo: true, ordem: 11, descricao: 'Acompanhamento com a liderança' },
      { id: 'mod_configuracoes', nome: 'Configurações', icone: 'settings', ativo: true, ordem: 12, descricao: 'Personalização de módulos e campos' }
    ];
  }

  /**
   * Obtém apenas os módulos ativos na navegação.
   * @return {Array.<Object>}
   */
  function getActiveModules() {
    var all = getAllModules();
    return all.filter(function (m) {
      return String(m.ativo) === 'true' || m.ativo === true;
    });
  }

  return {
    getAllModules: getAllModules,
    getActiveModules: getActiveModules
  };
})();
