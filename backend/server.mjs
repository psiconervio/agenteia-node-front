// Please install OpenAI SDK first: `npm install openai`

import OpenAI from "openai";

const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        // baseURL: 'https://api.deepseek.com/v1',
        apiKey: 'sk-7b4bcfd85ead4fd68f87b0d1b1e156ce'
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