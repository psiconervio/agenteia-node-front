import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Obtener __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Definir la ruta del archivo document.pdf (al mismo nivel que server.mjs)
const targetFile = path.join(__dirname, 'document.pdf');

// Mostrar en consola la ruta que se usará
console.log('Usando archivo:', targetFile);

// Verificar que el archivo exista
if (!fs.existsSync(targetFile)) {
  console.error(`El archivo no se encontró en: ${targetFile}`);
  process.exit(1);
}

// Función mínima para procesar el archivo y mostrar su contenido
async function processFile(filePath) {
  console.log('Procesando archivo:', filePath);
  const ext = path.extname(filePath).toLowerCase();
  let text = '';
  
  if (ext === '.pdf') {
    // Leer el archivo como buffer y parsearlo con pdf-parse
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    text = data.text;
  } else {
    // Para otros tipos de archivos, leer el contenido en formato UTF-8
    text = fs.readFileSync(filePath, 'utf-8');
  }
  
  return text;
}

// Ejecutar la función y mostrar el contenido en la consola
processFile(targetFile)
  .then((text) => {
    console.log('Contenido del archivo:');
    console.log(text);
  })
  .catch((err) => {
    console.error('Error al procesar el archivo:', err);
  });

// import express from 'express';
// import fs from 'fs';
// import path from 'path';
// import { OpenAI } from 'openai';
// import pdfParse from 'pdf-parse';
// import { v4 as uuidv4 } from 'uuid';
// import { ChromaClient } from 'chromadb';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// const app = express();
// const port = 3000;

// // Configuración de OpenAI y ChromaDB
// const openai = new OpenAI({ apiKey: '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' }); // Reemplaza con tu API key real
// const chroma = new ChromaClient();
// const collectionName = 'document_chunks';

// // Obtener __dirname en módulos ES
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// // Definir la ruta del archivo: document.pdf estará en el mismo directorio que server.mjs
// const targetFile = path.join(__dirname, 'document.pdf');

// // Mostrar en consola la ruta que se usará
// console.log('Usando archivo:', targetFile);

// // Verificar que el archivo exista
// if (!fs.existsSync(targetFile)) {
//   console.error(`El archivo no se encontró en: ${targetFile}`);
//   process.exit(1);
// }

// // Función para extraer el texto del archivo
// async function processFile(filePath) {
//   console.log('Procesando archivo:', filePath);
//   const ext = path.extname(filePath).toLowerCase();
//   let text = '';
//   if (ext === '.pdf') {
//     // Leemos el archivo como buffer y lo pasamos a pdfParse
//     const buffer = fs.readFileSync(filePath);
//     text = (await pdfParse(buffer)).text;
//   } else {
//     text = fs.readFileSync(filePath, 'utf-8');
//   }
//   return text;
// }

// // Almacenar los fragmentos (chunks) en ChromaDB
// async function storeChunks(chunks, fileName) {
//   const embeddings = await openai.embeddings.create({
//     model: 'text-embedding-ada-002',
//     input: chunks.map((chunk) => chunk.text),
//   });

//   const collection = await chroma.getCollection(collectionName);
//   for (let i = 0; i < chunks.length; i++) {
//     await collection.add({
//       ids: [chunks[i].id],
//       embeddings: [embeddings.data[i].embedding],
//       metadatas: [{ text: chunks[i].text, file: fileName }],
//     });
//   }
//   console.log(`Se almacenaron los fragmentos de '${fileName}' en ChromaDB.`);
// }

// // Procesar el documento dividiéndolo en fragmentos
// async function processDocument(filePath) {
//   const fileName = path.basename(filePath);
//   const text = await processFile(filePath);
//   // Dividir el texto en fragmentos de hasta 500 caracteres
//   const chunks = text.match(/[\s\S]{1,500}/g).map((chunk) => ({
//     id: uuidv4(),
//     text: chunk,
//   }));
//   await storeChunks(chunks, fileName);
//   console.log(`El documento '${fileName}' fue procesado correctamente.`);
// }

// // Iniciar el procesamiento del documento
// processDocument(targetFile).catch((err) => console.error(err));

// app.use(express.json());

// // Endpoint para responder preguntas (se mantiene igual)
// app.post('/ask', async (req, res) => {
//   const { question } = req.body;
//   if (!question)
//     return res.status(400).json({ error: 'Falta la pregunta en el body.' });

//   try {
//     const embedding = await openai.embeddings.create({
//       model: 'text-embedding-ada-002',
//       input: [question],
//     });

//     const collection = await chroma.getCollection(collectionName);
//     const searchResults = await collection.query({
//       queryEmbeddings: [embedding.data[0].embedding],
//       nResults: 5,
//     });

//     const relevantChunks = searchResults.metadatas
//       .flat()
//       .map((meta) => meta.text)
//       .join('\n');

//     const prompt = `Basado en el siguiente contenido, responde la pregunta de manera precisa:\n\n${relevantChunks}\n\nPregunta: ${question}\nRespuesta:`;

//     const response = await openai.completions.create({
//       model: 'gpt-4-turbo',
//       prompt,
//       max_tokens: 300,
//     });

//     res.json({ answer: response.choices[0].text.trim() });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Iniciar el servidor
// app.listen(port, () => {
//   console.log(`Servidor corriendo en http://localhost:${port}`);
// });

// import express from 'express';
// import fs from 'fs';
// import path from 'path';
// import { OpenAI } from 'openai';
// import pdfParse from 'pdf-parse';
// import { v4 as uuidv4 } from 'uuid';
// import { ChromaClient } from 'chromadb';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// const app = express();
// const port = 3000;

// // Configuración de OpenAI y ChromaDB
// const openai = new OpenAI({ apiKey: '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' });
// const chroma = new ChromaClient();
// const collectionName = 'document_chunks';

// // Obtener __dirname en módulos ES
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// // Como queremos usar document.pdf al mismo nivel que server.mjs,
// // definimos targetFile apuntando directamente al archivo en __dirname.
// const targetFile = path.join(__dirname, 'document.pdf');

// // Imprime la ruta para depuración
// console.log(`Buscando archivo en: ${targetFile}`);

// // Verifica que el archivo exista. Si no, se detiene la ejecución.
// if (!fs.existsSync(targetFile)) {
//   console.error(`El archivo no existe en: ${targetFile}`);
//   process.exit(1);
// }

// // Inicializa la colección en ChromaDB
// async function initializeChroma() {
//   await chroma.createCollection({ name: collectionName });
//   console.log(`Colección '${collectionName}' inicializada.`);
// }
// initializeChroma().catch((err) =>
//   console.error('Error inicializando ChromaDB:', err)
// );

// // Función para extraer el texto del archivo
// async function processFile(filePath) {
//   const ext = path.extname(filePath).toLowerCase();
//   let text = '';
//   if (ext === '.pdf') {
//     const data = await pdfParse(fs.readFileSync(filePath));
//     text = data.text;
//   } else {
//     text = fs.readFileSync(filePath, 'utf-8');
//   }
//   return text;
// }

// // Almacena los fragmentos (chunks) en ChromaDB
// async function storeChunks(chunks, fileName) {
//   const embeddings = await openai.embeddings.create({
//     model: 'text-embedding-ada-002',
//     input: chunks.map((chunk) => chunk.text),
//   });

//   const collection = await chroma.getCollection(collectionName);
//   for (let i = 0; i < chunks.length; i++) {
//     await collection.add({
//       ids: [chunks[i].id],
//       embeddings: [embeddings.data[i].embedding],
//       metadatas: [{ text: chunks[i].text, file: fileName }],
//     });
//   }
//   console.log(`Fragmentos almacenados en ChromaDB para '${fileName}'.`);
// }

// // Procesa el documento dividiéndolo en fragmentos de hasta 500 caracteres.
// async function processDocument(filePath) {
//   const fileName = path.basename(filePath);
//   const text = await processFile(filePath);
//   const chunks = text.match(/[\s\S]{1,500}/g).map((chunk) => ({
//     id: uuidv4(),
//     text: chunk,
//   }));
//   await storeChunks(chunks, fileName);
//   console.log(`Documento '${fileName}' procesado y almacenado en ChromaDB.`);
// }

// // Procesa el documento al iniciar el servidor
// processDocument(targetFile).catch((err) => console.error(err));

// app.use(express.json());

// // Endpoint para realizar preguntas
// app.post('/ask', async (req, res) => {
//   const { question } = req.body;
//   if (!question)
//     return res.status(400).json({ error: 'Falta la pregunta en el body.' });

//   try {
//     // Genera el embedding de la pregunta
//     const embedding = await openai.embeddings.create({
//       model: 'text-embedding-ada-002',
//       input: [question],
//     });

//     const collection = await chroma.getCollection(collectionName);
//     const searchResults = await collection.query({
//       queryEmbeddings: [embedding.data[0].embedding],
//       nResults: 5,
//     });

//     const relevantChunks = searchResults.metadatas
//       .flat()
//       .map((meta) => meta.text)
//       .join('\n');

//     const prompt = `Basado en el siguiente contenido, responde la pregunta de manera precisa:\n\n${relevantChunks}\n\nPregunta: ${question}\nRespuesta:`;

//     const response = await openai.completions.create({
//       model: 'gpt-4-turbo',
//       prompt,
//       max_tokens: 300,
//     });

//     res.json({ answer: response.choices[0].text.trim() });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Inicia el servidor
// app.listen(port, () => {
//   console.log(`Servidor corriendo en http://localhost:${port}`);
// });

// import express from 'express';
// import fs from 'fs';
// import path from 'path';
// import { OpenAI } from 'openai';
// import pdfParse from 'pdf-parse';
// import { v4 as uuidv4 } from 'uuid';
// import { ChromaClient } from 'chromadb';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// const app = express();
// const port = 3000;

// // Configuración de OpenAI y ChromaDB
// const openai = new OpenAI({ apiKey: 'sk-your-api-key' });
// const chroma = new ChromaClient();
// const collectionName = 'document_chunks';

// // Obtener __dirname en módulos ES
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// // CONFIGURACIÓN DE RUTAS
// // Opción 1: Si usas el archivo "document.pdf" que está en la carpeta "documents"
// const documentsPath = path.join(__dirname, 'documents');
// const targetFile = path.join(documentsPath, 'document.pdf');

// // Opción 2: Si en cambio deseas usar "05-versions-space.pdf" que se encuentra en "test/data"
// // const documentsPath = path.join(__dirname, 'test', 'data');
// // const targetFile = path.join(documentsPath, '05-versions-space.pdf');

// // Asegúrate de que la carpeta exista (para Opción 1 o 2 según corresponda)
// if (!fs.existsSync(documentsPath)) {
//   fs.mkdirSync(documentsPath, { recursive: true });
//   console.log(`Carpeta creada: ${documentsPath}`);
// } else {
//   console.log(`Carpeta existente: ${documentsPath}`);
// }

// // Imprime la ruta para depuración
// console.log(`Buscando archivo en: ${targetFile}`);

// // Inicializa la colección en ChromaDB
// async function initializeChroma() {
//   await chroma.createCollection({ name: collectionName });
//   console.log(`Colección '${collectionName}' inicializada.`);
// }
// initializeChroma().catch((err) =>
//   console.error('Error inicializando ChromaDB:', err)
// );

// // Función para extraer el texto del archivo
// async function processFile(filePath) {
//   const ext = path.extname(filePath).toLowerCase();
//   let text = '';
//   if (ext === '.pdf') {
//     const data = await pdfParse(fs.readFileSync(filePath));
//     text = data.text;
//   } else {
//     text = fs.readFileSync(filePath, 'utf-8');
//   }
//   return text;
// }

// // Almacena los fragmentos (chunks) en ChromaDB
// async function storeChunks(chunks, fileName) {
//   const embeddings = await openai.embeddings.create({
//     model: 'text-embedding-ada-002',
//     input: chunks.map((chunk) => chunk.text),
//   });

//   const collection = await chroma.getCollection(collectionName);
//   for (let i = 0; i < chunks.length; i++) {
//     await collection.add({
//       ids: [chunks[i].id],
//       embeddings: [embeddings.data[i].embedding],
//       metadatas: [{ text: chunks[i].text, file: fileName }],
//     });
//   }
//   console.log(`Fragmentos almacenados en ChromaDB para '${fileName}'.`);
// }

// // Procesa el documento dividiéndolo en fragmentos
// async function processDocument(filePath) {
//   const fileName = path.basename(filePath);
//   const text = await processFile(filePath);
//   const chunks = text.match(/[\s\S]{1,500}/g).map((chunk) => ({
//     id: uuidv4(),
//     text: chunk,
//   }));
//   await storeChunks(chunks, fileName);
//   console.log(`Documento '${fileName}' procesado correctamente.`);
// }

// // Verifica si el archivo existe al iniciar
// if (fs.existsSync(targetFile)) {
//   processDocument(targetFile).catch((err) => console.error(err));
// } else {
//   console.warn(
//     `El archivo '${targetFile}' no se encontró. Asegúrate de que esté en la carpeta correcta.`
//   );
// }

// // Endpoint para preguntas
// app.use(express.json());
// app.post('/ask', async (req, res) => {
//   const { question } = req.body;
//   if (!question)
//     return res.status(400).json({ error: 'Falta la pregunta en el body.' });

//   try {
//     // Genera el embedding de la pregunta
//     const embedding = await openai.embeddings.create({
//       model: 'text-embedding-ada-002',
//       input: [question],
//     });

//     const collection = await chroma.getCollection(collectionName);
//     const searchResults = await collection.query({
//       queryEmbeddings: [embedding.data[0].embedding],
//       nResults: 5,
//     });

//     const relevantChunks = searchResults.metadatas
//       .flat()
//       .map((meta) => meta.text)
//       .join('\n');

//     const prompt = `Basado en el siguiente contenido, responde la pregunta de manera precisa:\n\n${relevantChunks}\n\nPregunta: ${question}\nRespuesta:`;

//     const response = await openai.completions.create({
//       model: 'gpt-4-turbo',
//       prompt,
//       max_tokens: 300,
//     });

//     res.json({ answer: response.choices[0].text.trim() });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Iniciar el servidor
// app.listen(port, () => {
//   console.log(`Servidor corriendo en http://localhost:${port}`);
// });


// import express from 'express';
// import fs from 'fs';
// import path from 'path';
// import { OpenAI } from 'openai';
// import pdfParse from 'pdf-parse';
// import { v4 as uuidv4 } from 'uuid';
// import { ChromaClient } from 'chromadb';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// const app = express();
// const port = 3000;
// const openai = new OpenAI({ apiKey: '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' });
// const chroma = new ChromaClient();
// const collectionName = 'document_chunks';
// const documentsPath = path.join(__dirname, 'documents');
// // Nombre del archivo que contiene el PDF a usar como contexto
// const targetFile = path.join(documentsPath, 'document.pdf');
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// if (!fs.existsSync(documentsPath)) {
//   fs.mkdirSync(documentsPath);
// }
// console.log(`Buscando archivo en: ${targetFile}`);

// app.use(express.json());

// // Inicializa la colección en ChromaDB
// async function initializeChroma() {
//   await chroma.createCollection({ name: collectionName });
// }
// initializeChroma();

// // Función para extraer el texto del archivo
// async function processFile(filePath) {
//   let text = '';
//   const ext = path.extname(filePath).toLowerCase();
//   if (ext === '.pdf') {
//     const data = await pdfParse(fs.readFileSync(filePath));
//     text = data.text;
//   } else {
//     text = fs.readFileSync(filePath, 'utf-8');
//   }
//   return text;
// }

// // Almacena los fragmentos (chunks) en ChromaDB junto con su metadata
// async function storeChunks(chunks, fileName) {
//   const embeddings = await openai.embeddings.create({
//     model: 'text-embedding-ada-002',
//     input: chunks.map(chunk => chunk.text)
//   });

//   const collection = await chroma.getCollection(collectionName);
//   for (let i = 0; i < chunks.length; i++) {
//     await collection.add({
//       ids: [chunks[i].id],
//       embeddings: [embeddings.data[i].embedding],
//       metadatas: [{ text: chunks[i].text, file: fileName }]
//     });
//   }
// }

// // Procesa el documento dividiéndolo en fragmentos
// async function processDocument(filePath) {
//   const fileName = path.basename(filePath);
//   const text = await processFile(filePath);
//   // Separamos el texto en fragmentos de hasta 500 caracteres.
//   // Puedes ajustar el tamaño según tus necesidades.
//   const chunks = text.match(/[\s\S]{1,500}/g).map(chunk => ({
//     id: uuidv4(),
//     text: chunk
//   }));
//   await storeChunks(chunks, fileName);
//   console.log(`Documento ${fileName} procesado y almacenado en ChromaDB.`);
// }

// // Al iniciar el servidor, procesa el archivo si existe
// if (fs.existsSync(targetFile)) {
//   processDocument(targetFile).catch(err => console.error(err));
// } else {
//   console.warn(`El archivo ${targetFile} no se encontró. Por favor, colócalo en la carpeta ${documentsPath}.`);
// }

// // Endpoint para hacer preguntas
// app.post('/ask', async (req, res) => {
//   const { question } = req.body;
//   if (!question)
//     return res.status(400).json({ error: 'Falta la pregunta en el body.' });

//   // Genera el embedding de la pregunta
//   const embedding = await openai.embeddings.create({
//     model: 'text-embedding-ada-002',
//     input: [question]
//   });

//   // Consulta en ChromaDB buscando fragmentos del documento (si solo hay uno, no es necesario filtrar)
//   const collection = await chroma.getCollection(collectionName);
//   const searchResults = await collection.query({
//     queryEmbeddings: [embedding.data[0].embedding],
//     nResults: 5,
//     // Si tienes más de un documento y deseas filtrar, puedes usar:
//     // where: { file: 'document.pdf' }
//   });

//   // Une los fragmentos más relevantes
//   const relevantChunks = searchResults.metadatas.flat().map(meta => meta.text).join('\n');

//   // Crea el prompt para el modelo de OpenAI
//   const prompt = `Basado en el siguiente contenido, responde la pregunta de manera precisa:\n\n${relevantChunks}\n\nPregunta: ${question}\nRespuesta:`;

//   try {
//     const response = await openai.completions.create({
//       model: 'gpt-4-turbo',
//       prompt,
//       max_tokens: 300,
//     });

//     res.json({ answer: response.choices[0].text.trim() });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.listen(port, () => {
//   console.log(`Servidor corriendo en http://localhost:${port}`);
// });

// import express from 'express';
// import fs from 'fs';
// import path from 'path';
// import { OpenAI } from 'openai';
// import pdfParse from 'pdf-parse';
// import { v4 as uuidv4 } from 'uuid';
// import { ChromaClient } from 'chromadb';
// import dotenv from 'dotenv';
// dotenv.config();

// // // // const api = process.env.example.OPENAI;
// const apideepsek = process.env.OPENAI;
// console.log(apideepsek);

// const app = express();
// const port = 3000;
// const openai = new OpenAI({ apiKey: apideepsek });
// const chroma = new ChromaClient();
// const collectionName = 'document_chunks';
// const documentsPath = path.join(__dirname, 'documents');

// if (!fs.existsSync(documentsPath)) {
//     fs.mkdirSync(documentsPath);
// }

// app.use(express.json());

// async function initializeChroma() {
//     await chroma.createCollection({ name: collectionName });
// }

// initializeChroma();

// async function processFile(filePath) {
//     let text = '';
//     const ext = path.extname(filePath);
//     if (ext === '.pdf') {
//         const data = await pdfParse(fs.readFileSync(filePath));
//         text = data.text;
//     } else {
//         text = fs.readFileSync(filePath, 'utf-8');
//     }
//     return text;
// }

// async function storeChunks(chunks) {
//     const embeddings = await openai.embeddings.create({
//         model: 'text-embedding-ada-002',
//         input: chunks.map(chunk => chunk.text)
//     });
    
//     const collection = await chroma.getCollection(collectionName);
//     for (let i = 0; i < chunks.length; i++) {
//         await collection.add({
//             ids: [chunks[i].id],
//             embeddings: [embeddings.data[i].embedding],
//             metadatas: [{ text: chunks[i].text }]
//         });
//     }
// }

// async function processAllDocuments() {
//     const files = fs.readdirSync(documentsPath);
//     let allChunks = [];
    
//     for (const file of files) {
//         const filePath = path.join(documentsPath, file);
//         const text = await processFile(filePath);
//         const chunks = text.match(/.{1,500}/g).map(chunk => ({
//             id: uuidv4(),
//             text: chunk
//         }));
//         allChunks.push(...chunks);
//     }
    
//     await storeChunks(allChunks);
//     console.log('Todos los documentos han sido procesados y almacenados en ChromaDB.');
// }

// processAllDocuments();

// app.post('/ask', async (req, res) => {
//     const { question } = req.body;
//     if (!question) return res.status(400).json({ error: 'Falta la pregunta' });
    
//     const embedding = await openai.embeddings.create({
//         model: 'text-embedding-ada-002',
//         input: [question]
//     });
    
//     const collection = await chroma.getCollection(collectionName);
//     const searchResults = await collection.query({
//         queryEmbeddings: [embedding.data[0].embedding],
//         nResults: 5
//     });
    
//     const relevantChunks = searchResults.metadatas.flat().map(meta => meta.text).join('\n');
//     const prompt = `Basado en el siguiente contenido, responde la pregunta de manera precisa:\n\n${relevantChunks}\n\nPregunta: ${question}\nRespuesta:`;
    
//     try {
//         const response = await openai.completions.create({
//             model: 'gpt-4-turbo',
//             prompt,
//             max_tokens: 300,
//         });

//         res.json({ answer: response.choices[0].text.trim() });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// app.listen(port, () => {
//     console.log(`Servidor corriendo en http://localhost:${port}`);
// });

// import express from 'express';
// import multer from 'multer';
// import fs from 'fs';
// import { OpenAI } from 'openai';
// import pdfParse from 'pdf-parse';
// import { v4 as uuidv4 } from 'uuid';
// import { ChromaClient } from 'chromadb';
// import dotenv from 'dotenv';
// dotenv.config();

// // // const api = process.env.example.OPENAI;
// const apideepsek = process.env.OPENAI;
// console.log(apideepsek);

// const app = express();
// const port = 3000;
// const openai = new OpenAI({ apiKey: apideepsek });
// const storage = multer.memoryStorage();
// const upload = multer({ storage });
// const chroma = new ChromaClient();
// const collectionName = 'document_chunks';

// app.use(express.json());

// async function initializeChroma() {
//     await chroma.createCollection({ name: collectionName });
// }

// initializeChroma();

// // Función para generar embeddings y almacenar fragmentos
// async function storeChunks(chunks) {
//     const embeddings = await openai.embeddings.create({
//         model: 'text-embedding-ada-002',
//         input: chunks.map(chunk => chunk.text)
//     });
    
//     const collection = await chroma.getCollection(collectionName);
//     for (let i = 0; i < chunks.length; i++) {
//         await collection.add({
//             ids: [chunks[i].id],
//             embeddings: [embeddings.data[i].embedding],
//             metadatas: [{ text: chunks[i].text }]
//         });
//     }
// }

// // Endpoint para subir y procesar múltiples archivos PDF/TXT
// app.post('/upload', upload.array('files'), async (req, res) => {
//     try {
//         const files = req.files;
//         if (!files || files.length === 0) return res.status(400).json({ error: 'No se subieron archivos' });
        
//         let allChunks = [];
        
//         for (const file of files) {
//             let text = '';
//             if (file.originalname.endsWith('.pdf')) {
//                 const data = await pdfParse(file.buffer);
//                 text = data.text;
//             } else {
//                 text = file.buffer.toString('utf-8');
//             }
            
//             const chunks = text.match(/.{1,500}/g).map(chunk => ({
//                 id: uuidv4(),
//                 text: chunk
//             }));
            
//             allChunks.push(...chunks);
//         }
        
//         await storeChunks(allChunks);
//         res.json({ message: 'Archivos procesados', chunks: allChunks.length });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Endpoint para hacer preguntas al contenido del documento
// app.post('/ask', async (req, res) => {
//     const { question } = req.body;
//     if (!question) return res.status(400).json({ error: 'Falta la pregunta' });
    
//     const embedding = await openai.embeddings.create({
//         model: 'text-embedding-ada-002',
//         input: [question]
//     });
    
//     const collection = await chroma.getCollection(collectionName);
//     const searchResults = await collection.query({
//         queryEmbeddings: [embedding.data[0].embedding],
//         nResults: 5
//     });
    
//     const relevantChunks = searchResults.metadatas.flat().map(meta => meta.text).join('\n');
//     const prompt = `Basado en el siguiente contenido, responde la pregunta de manera precisa:\n\n${relevantChunks}\n\nPregunta: ${question}\nRespuesta:`;
    
//     try {
//         const response = await openai.completions.create({
//             model: 'gpt-4-turbo',
//             prompt,
//             max_tokens: 300,
//         });

//         res.json({ answer: response.choices[0].text.trim() });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// app.listen(port, () => {
//     console.log(`Servidor corriendo en http://localhost:${port}`);
// });

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
