import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { OpenAI } from 'openai';
import pdfParse from 'pdf-parse';
import { v4 as uuidv4 } from 'uuid';
import { ChromaClient } from 'chromadb';
import dotenv from 'dotenv';
dotenv.config();

// // const api = process.env.example.OPENAI;
const apideepsek = process.env.OPENAI;
console.log(apideepsek);

const app = express();
const port = 3000;
const openai = new OpenAI({ apiKey: apideepsek });
const storage = multer.memoryStorage();
const upload = multer({ storage });
const chroma = new ChromaClient();
const collectionName = 'document_chunks';

app.use(express.json());

async function initializeChroma() {
    await chroma.createCollection({ name: collectionName });
}

initializeChroma();

// Función para generar embeddings y almacenar fragmentos
async function storeChunks(chunks) {
    const embeddings = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: chunks.map(chunk => chunk.text)
    });
    
    const collection = await chroma.getCollection(collectionName);
    for (let i = 0; i < chunks.length; i++) {
        await collection.add({
            ids: [chunks[i].id],
            embeddings: [embeddings.data[i].embedding],
            metadatas: [{ text: chunks[i].text }]
        });
    }
}

// Endpoint para subir y procesar múltiples archivos PDF/TXT
app.post('/upload', upload.array('files'), async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) return res.status(400).json({ error: 'No se subieron archivos' });
        
        let allChunks = [];
        
        for (const file of files) {
            let text = '';
            if (file.originalname.endsWith('.pdf')) {
                const data = await pdfParse(file.buffer);
                text = data.text;
            } else {
                text = file.buffer.toString('utf-8');
            }
            
            const chunks = text.match(/.{1,500}/g).map(chunk => ({
                id: uuidv4(),
                text: chunk
            }));
            
            allChunks.push(...chunks);
        }
        
        await storeChunks(allChunks);
        res.json({ message: 'Archivos procesados', chunks: allChunks.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para hacer preguntas al contenido del documento
app.post('/ask', async (req, res) => {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: 'Falta la pregunta' });
    
    const embedding = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: [question]
    });
    
    const collection = await chroma.getCollection(collectionName);
    const searchResults = await collection.query({
        queryEmbeddings: [embedding.data[0].embedding],
        nResults: 5
    });
    
    const relevantChunks = searchResults.metadatas.flat().map(meta => meta.text).join('\n');
    const prompt = `Basado en el siguiente contenido, responde la pregunta de manera precisa:\n\n${relevantChunks}\n\nPregunta: ${question}\nRespuesta:`;
    
    try {
        const response = await openai.completions.create({
            model: 'gpt-4-turbo',
            prompt,
            max_tokens: 300,
        });

        res.json({ answer: response.choices[0].text.trim() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

// // Please install OpenAI SDK first: `npm install openai`
// import OpenAI from "openai";
// import dotenv from 'dotenv';
// dotenv.config();

// // const api = process.env.example.OPENAI;
// const apideepsek = process.env.APIDEEPSEEK;
// console.log(apideepsek);

// const openai = new OpenAI({
//         // baseURL: 'https://api.deepseek.com',
//         baseURL: 'https://api.deepseek.com/v1',
//         apiKey: apideepsek
// });

// async function main() {
//   const completion = await openai.chat.completions.create({
//     messages: [{ role: "system", content: "You are a helpful assistant." }],
//     model: "gpt-4o",
//     // model: "deepseek-chat",
//     // model: "deepseek-reasoner",
//   });

//   console.log(completion.choices[0].message.content);
// }

// main();

// // SDK OPENAI

// // import OpenAI from "openai";
// // const openai = new OpenAI();
// // const completion = await openai.chat.completions.create({
// //     model: "gpt-4o",
// //     store: true,
// //     messages: [
// //         {"role": "user", "content": "write a haiku about ai"}
// //     ]
// // });
