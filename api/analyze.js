// Это бессерверная функция (Serverless Function) Vercel, которая будет работать
// как наш личный прокси. Запросы сюда идут с вашего фронтенда, а этот файл уже
// делает запрос к Google или OpenRouter от лица серверов Vercel (США/Европа).

export default async function handler(req, res) {
    // Включаем CORS, чтобы наш фронтенд (http://localhost:5173 и финальный домен) мог делать запросы
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )

    if (req.method === 'OPTIONS') {
        res.status(200).end()
        return
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        // Забираем ключ СТРОГО ИЗ ПЕРЕМЕННЫХ ОКРУЖЕНИЯ VERCEL (Сейфа)
        const API_KEY = process.env.GROQ_API_KEY || process.env.HF_API_KEY || process.env.GEMINI_API_KEY;

        if (!API_KEY) {
            console.error("CRITICAL: GROQ_API_KEY environment variable is missing.");
            return res.status(500).json({ error: 'API Key is not configured on the server.' });
        }

        // Делаем запрос к сверхбыстрому Groq API (Llama 3)
        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: "llama3-8b-8192", // Бесплатная, сверхбыстрая модель
                    messages: [
                        { role: "system", content: "You are an ATS expert. Always output pure JSON." },
                        { role: "user", content: prompt }
                    ],
                    temperature: 0.2, // Минимум креативности для JSON
                    response_format: { type: "json_object" } // Groq поддерживает принудительный вывод JSON
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Groq API Error details:", data);
            return res.status(response.status).json({
                error: 'Error from API',
                details: data
            });
        }

        // Groq отдает ответ в формате OpenAI
        const responseText = data.choices?.[0]?.message?.content || "";

        // Очищаем от возможных Markdown тегов
        const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        // Возвращаем чистый JSON на фронтенд
        res.status(200).send(cleanedText);

    } catch (error) {
        console.error("Serverless Function Error:", error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
