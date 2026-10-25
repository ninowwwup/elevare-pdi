# Elevare PDI — Personal Development Hub

Sistema pessoal, moderno, modular e gratuito para gerenciamento de Plano de Desenvolvimento Individual (PDI), competências técnicas (Hard Skills) e comportamentais (Soft Skills), feedbacks de liderança, metas SMART, ações, evidências de impacto, reuniões 1:1 e uma biblioteca de leituras com estante virtual 3D.

Hospedado 100% no **Google Apps Script** utilizando o **Google Sheets** como banco de dados relacional e privado, sem custos de infraestrutura ou serviços pagos.

---

## 1. Arquitetura e Tecnologias

- **Backend & Hospedagem:** Google Apps Script (V8 Runtime) com `HtmlService` e `google.script.run`.
- **Banco de Dados:** Google Sheets privado com 15 abas estruturadas, identificadores UUID e rastreabilidade temporal.
- **Frontend:** Vanilla HTML5, CSS moderno (tema grafite, profundidade visual, variáveis CSS) e JavaScript modular baseado em Promises.
- **Segurança:** ID da planilha protegido em `ScriptProperties`, execução restrita ao proprietário (`MYSELF`), whitelist estrita de tabelas e `LockService` para controle de concorrência.
- **Versionamento & Automação:** Git, GitHub e `@google/clasp`.

---

## 📌 Links do Projeto em Produção

- **Repositório GitHub (Privado):** [https://github.com/ninowwwup/elevare-pdi](https://github.com/ninowwwup/elevare-pdi)
- **Editor do Apps Script:** [https://script.google.com/d/1cAm8QP2fvoiemg96caP5SUqnvTsOZl1j13BvbhvEq1fmIg0Zlt3Szobo/edit](https://script.google.com/d/1cAm8QP2fvoiemg96caP5SUqnvTsOZl1j13BvbhvEq1fmIg0Zlt3Szobo/edit)
- **Aplicativo Web Publicado:** [https://script.google.com/macros/s/AKfycbz57SSwvYaoRsn4RbtN7KhGXVpPMTmNFaVkxkkCgWSA0f1uMBFg9n3Vi5KVcj9CNLsr/exec](https://script.google.com/macros/s/AKfycbz57SSwvYaoRsn4RbtN7KhGXVpPMTmNFaVkxkkCgWSA0f1uMBFg9n3Vi5KVcj9CNLsr/exec)


---

## 2. Estrutura do Projeto

```
elevare-pdi/
├── README.md                 # Guia completo do projeto e instruções
├── package.json              # Configuração de scripts e dependências (clasp)
├── .gitignore                # Proteção de credenciais e arquivos temporários
├── .clasp.json.example       # Modelo de configuração para o clasp
├── src/                      # Código fonte sincronizado com o Apps Script
│   ├── appsscript.json       # Manifesto e escopos OAuth do Google Apps Script
│   ├── Code.gs               # Ponto de entrada, roteamento doGet e API RPC
│   ├── Database.gs           # Camada de banco de dados, setup idempotente e locks
│   ├── Security.gs           # Whitelist de tabelas, sanitização e envelopes
│   ├── Validation.gs         # Regras de validação de campos e gerador de UUID
│   ├── Modules.gs            # Catálogo e controle de módulos do sistema
│   ├── Index.html            # Estrutura HTML principal da aplicação
│   ├── Styles.html           # Design tokens, variáveis CSS e estilos
│   ├── Components.html       # Toasts, modais, spinners e ícones SVG
│   ├── ApiClient.html        # Cliente Promisificado para google.script.run
│   └── App.html              # Lógica de interface e teste de persistência
├── docs/                     # Documentação técnica detalhada
│   ├── ARCHITECTURE.md       # Desenho de arquitetura e fluxo de dados
│   ├── DATA_DICTIONARY.md    # Dicionário de dados das 15 abas do banco
│   └── DEPLOYMENT.md         # Passo a passo de instalação e deploy para iniciantes
└── tests/                    # Planos de validação
    └── test-plan.md          # Critérios de teste e matriz dos 25 testes
```

---

## 3. Pré-requisitos

1. Uma conta Google (gratuita ou Google Workspace).
2. Um navegador web moderno (Chrome, Firefox, Edge, Safari).
3. *(Opcional)* Node.js e Git instalados se optar por sincronizar arquivos via terminal.

---

## 4. Guia Rápido de Instalação (Pelo Navegador)

Para quem está começando e não quer usar o terminal:

1. Acesse [script.google.com](https://script.google.com/) e clique em **"Novo projeto"**.
2. Renomeie o projeto para **"Elevare PDI"**.
3. Crie os arquivos `.gs` e `.html` no editor copiando o conteúdo correspondente da pasta `src/`.
4. No menu de seleção de funções, escolha **`setupApplication`** e clique em **Executar**.
5. Conceda as permissões de acesso da sua conta Google quando solicitado.
   - *Nota:* Na tela cinza "O Google não verificou este app", clique em **Avançado** > **Acessar Elevare PDI (não seguro)**. Isso é padrão para códigos criados por você mesmo.
6. Clique no botão azul **Implantar** > **Nova implantação** > Selecione **App da Web** > Defina acesso como **Somente eu** e clique em **Implantar**.
7. Abra a URL gerada e aproveite!

---

## 5. Instalação e Desenvolvimento com Clasp (Terminal)

Se você preferir gerenciar o código na sua máquina local:

```bash
# 1. Instalar dependências locais
npm install

# 2. Conectar com sua conta Google
npx clasp login

# 3. Criar o Web App ou vincular existente
npx clasp create --type webapp --title "Elevare PDI" --rootDir src

# 4. Enviar os arquivos locais para o Google Apps Script
npx clasp push

# 5. Abrir o projeto no navegador para executar o setup
npx clasp open
```

---

## 6. As 15 Abas do Banco de Dados

1. `CONFIG`: Configurações de sistema e preferências do usuário.
2. `MODULOS`: Ativação, ordenação e nomes dos módulos da barra lateral.
3. `CAMPOS_CUSTOM`: Definição de campos dinâmicos personalizados.
4. `FEEDBACKS`: Registro estruturado de feedbacks recebidos.
5. `COMPETENCIAS`: Matriz de Hard Skills e Soft Skills com autoavaliação (escala 1 a 5).
6. `AVALIACOES`: Histórico imutável de avaliações de competências ao longo do tempo.
7. `METAS`: Objetivos SMART e metas inspiradas em OKRs.
8. `ACOES`: Plano de ação e tarefas vinculadas com prazos e status.
9. `EVIDENCIAS`: Repositório de comprovações de impacto, links e apresentações.
10. `LIVROS`: Leituras com percentual de progresso e base para a Estante 3D.
11. `LEITURAS`: Registro de sessões diárias de leitura.
12. `APRENDIZADOS`: Repositório de notas, resumos e lições práticas.
13. `CURSOS`: Cursos, workshops e certificações.
14. `REUNIOES`: Pautas, decisões e acordos de reuniões 1:1 de desenvolvimento.
15. `HISTORICO`: Log auditável de ações executadas no sistema.

---

## 7. Solução de Problemas

- **Aviso "A planilha ainda não foi configurada":** Execute a função `setupApplication()` no Apps Script ou clique no botão *"Inicializar Banco de Dados Agora"* na tela inicial.
- **Aviso "O Google não verificou este app":** Clique em *Avançado* e prossiga. O código é privado e roda exclusivamente dentro da sua própria conta Google.
- **Alterações não aparecem no Web App:** Ao atualizar o código, lembre-se de criar uma **Nova versão** da implantação em *Implantar* > *Gerenciar implantações* > *Editar* > *Nova versão*.
