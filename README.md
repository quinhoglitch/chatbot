# Pacote Padrão do Chatbot

Este pacote permite instalar o chatbot em qualquer site de forma rapida e organizada.

## O que esta¡ incluso

- `widget/chat-widget.js` (script do widget)
- `widget/chat-widget.css` (estilos do widget)
- `backend-chat/` (API em `/api/chat`)
- `integration/snippet.html` (trecho para inserir no site)

## Instalação em 3 passos

1. Publique a API (`backend-chat`):
   - copie `.env.example` para `.env`
   - informe a `GEMINI_API_KEY`
   - atualize `knowledge.example.json` com os dados da empresa
   - execute `npm install` e `npm run dev`

2. Hospede o widget no site:
   - publique `widget/chat-widget.js`
   - publique `widget/chat-widget.css`

3. Insira o snippet:
   - cole o conteudo de `integration/snippet.html` no HTML do site

## Observações importantes

- Se a API estiver em outro domi­nio, ajuste `CHAT_API_URL` em `integration/snippet.html`.
- Por padrão, o widget aponta para `"/api/chat"` (mesmo domi­nio).



