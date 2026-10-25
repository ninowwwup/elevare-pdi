# Arquitetura do Sistema — Elevare PDI

Este documento detalha as decisões arquiteturais, o modelo de segurança, o fluxo de dados e os princípios de engenharia aplicados no **Elevare PDI**.

---

## 1. Visão Geral da Arquitetura

O **Elevare PDI** é uma aplicação web completa projetada para ser executada com **custo zero**, utilizando a infraestrutura do ecossistema Google Workspace e padrões modernos de engenharia de software:

```
+-------------------------------------------------------------------+
|                            NAVEGADOR                              |
|  +-------------------------------------------------------------+  |
|  |                 Frontend Moderno (SPA)                      |  |
|  |  - HTML5 Semântico (Index.html / Components.html)           |  |
|  |  - Vanilla CSS com Design System e 3D (Styles.html)         |  |
|  |  - Vanilla JS Modular (App.html)                            |  |
|  |  - ApiClient Promisificado (ApiClient.html)                 |  |
|  +-------------------------------------------------------------+  |
+----------------------------------|--------------------------------+
                                   | Chamadas assíncronas via
                                   | google.script.run (com timeout
                                   | e tratamento de erro)
                                   v
+-------------------------------------------------------------------+
|                    GOOGLE APPS SCRIPT (BACKEND)                   |
|  +-------------------------------------------------------------+  |
|  | Code.gs: Roteamento doGet(), Handlers de API & Setup        |  |
|  | Security.gs: Sanitização, Whitelist, Autenticação e Acesso  |  |
|  | Validation.gs: Validação de tipos, regras e integridade     |  |
|  | Database.gs: Mapeamento de cabeçalhos, CRUD em lote & Lock  |  |
|  | Modules.gs: Catálogo, configuração e metadados              |  |
|  +-------------------------------------------------------------+  |
+----------------------------------|--------------------------------+
                                   | SpreadsheetApp com LockService
                                   | e ScriptProperties
                                   v
+-------------------------------------------------------------------+
|                   GOOGLE SHEETS (BANCO DE DADOS)                  |
|  - Planilha Dedicada e Privada no Google Drive do Usuário         |
|  - 15 Abas com Esquema Normalizado e Relacional                   |
|  - Identificadores Únicos Estáveis (UUID)                         |
|  - Rastreabilidade (created_at, updated_at, HISTORICO)            |
+-------------------------------------------------------------------+
```

---

## 2. Fluxo de Dados Bidirecional

1. **Requisição do Frontend:**
   - O usuário interage com um formulário ou visualização.
   - O `ApiClient.html` encapsula a chamada do `google.script.run` em uma `Promise` nativa do JavaScript.
   - O botão é desabilitado e um indicador visual de carregamento é exibido, prevenindo submissões duplicadas.
   - Se a rede demorar mais que o tempo limite configurado (30s), o frontend rejeita a promessa com mensagem amigável.

2. **Recepção no Servidor:**
   - A função receptora em `Code.gs` recebe os parâmetros.
   - `Security.gs` verifica a lista permitida de tabelas (`ALLOWED_TABLES`) e valida o e-mail do executor com `Session.getActiveUser().getEmail()`.
   - `Validation.gs` valida a presença de campos obrigatórios, tipos de dados e limites de tamanho.

3. **Operação no Banco de Dados:**
   - Para operações de escrita, `Database.gs` adquire um lock exclusivo com `LockService.getScriptLock()` com espera de até 30 segundos.
   - Os cabeçalhos são lidos da Linha 1 e convertidos em um mapa `nomeColuna -> indiceColuna`.
   - As operações de leitura e gravação são efetuadas em lote (`getValues()` / `setValues()`), minimizando chamadas individuais à API da planilha.
   - O lock é liberado com segurança no bloco `finally`.

4. **Resposta Padronizada (Envelope):**
   - Todas as respostas de servidor retornam o envelope:
     ```json
     {
       "success": true,
       "data": { ... },
       "message": "Operação realizada com sucesso."
     }
     ```
   - Em caso de falha:
     ```json
     {
       "success": false,
       "error": "Descrição segura do erro para o usuário."
     }
     ```

---

## 3. Modelo de Segurança e Privacidade

- **Planilha Privada:** O ID da planilha fica armazenado exclusivamente nas propriedades do script (`PropertiesService.getScriptProperties()`). Ele nunca é enviado para o HTML ou exposto no navegador.
- **Acesso Restrito:** A aplicação é publicada como `executeAs: USER_DEPLOYING` e `access: MYSELF`, garantindo que apenas a conta Google do proprietário tenha autorização para abrir o Web App.
- **Sem Comandos Arbitrários:** O frontend não executa scripts arbitrários nem envia SQL/código para o servidor. Cada operação possui uma função nomeada e tipada com argumentos controlados.
- **Proteção contra Concorrência:** O `LockService` garante que mesmo que o usuário abra duas abas do navegador ou envie requisições rápidas, as gravações no Google Sheets sejam sequencializadas sem sobrescrita indevida.

---

## 4. Gerenciamento Local e Deploy via Clasp e GitHub

- Os arquivos fonte são mantidos na pasta local `src/`.
- O utilitário oficial `@google/clasp` da Google sincroniza os arquivos locais (`.gs` e `.html`) diretamente com o projeto do Google Apps Script.
- O `.gitignore` assegura que `.clasp.json` (que vincula ao ID do script) e `.clasprc.json` (que contém o token de autenticação local do Google) **jamais** sejam comitados no GitHub.
- Uma pipeline do GitHub Actions poderá ser configurada para deploy automatizado seguro utilizando *GitHub Secrets*.
