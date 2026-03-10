import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 8787);
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.trim();

if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY nao configurada.');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const knowledgeFile = path.join(__dirname, 'knowledge.example.json');

function loadKnowledge() {
  try {
    const raw = fs.readFileSync(knowledgeFile, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Falha ao carregar knowledge.example.json:', error);
    return [];
  }
}

function buildSystemInstruction() {
  const faq = loadKnowledge();
  return `Voce e um assistente institucional.
Regras:
- Responda somente com base na base oficial abaixo.
- Nao invente informacoes.
- Se nao houver informacao, responda exatamente: "Nao encontrei essa informacao na base oficial da empresa. Recomendo entrar em contato com o suporte humano."
- Seja objetivo e profissional.

Base oficial:
${JSON.stringify(faq)}`;
}

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body ?? {};
    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: "Campo 'message' invalido." });
    }

    const safeHistory = Array.isArray(history)
      ? history
          .filter(item => item && (item.role === 'user' || item.role === 'model'))
          .map(item => ({
            role: item.role,
            parts: Array.isArray(item.parts)
              ? item.parts
                  .filter(part => part && typeof part.text === 'string')
                  .map(part => ({ text: part.text }))
              : []
          }))
      : [];

    const contents = safeHistory.filter(
      (item, index) => !(index === 0 && item.role === 'model')
    );
    contents.push({
      role: 'user',
      parts: [{ text: message.trim() }]
    });

    const response = await ai.models.generateContent({
      model: MODEL,
      contents,
      config: {
        systemInstruction: buildSystemInstruction(),
        temperature: 0.1
      }
    });

    return res.json({ text: response.text || 'Nao foi possivel gerar resposta.' });
  } catch (error) {
    console.error('Erro em /api/chat:', error);
    return res.status(500).json({ error: 'Erro interno ao processar sua solicitacao.' });
  }
});

app.listen(PORT, () => {
  console.log(`Chat backend rodando em http://localhost:${PORT}`);
});
