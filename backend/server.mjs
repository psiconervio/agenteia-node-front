// Please install OpenAI SDK first: `npm install openai`

import OpenAI from "openai";
import dotenv from 'dotenv';
dotenv.config();

const api = process.env.example.OPENAI;
console.log(miVariable);

const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        // baseURL: 'https://api.deepseek.com/v1',
        apiKey: 'OPENAI'
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "deepseek-chat",
    // model: "deepseek-reasoner",
  });

  console.log(completion.choices[0].message.content);
}

main();