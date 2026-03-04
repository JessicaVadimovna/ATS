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
        const API_KEY = process.env.GEMINI_API_KEY;

        if (!API_KEY) {
            console.error("CRITICAL: GEMINI_API_KEY environment variable is missing.");
            return res.status(500).json({ error: 'API Key is not configured on the server.' });
        }

        // Делаем прямой запрос к Gemini от лица этого сервера (не из браузера пользователя!)
        // Используем самую стабильную модель: gemini-1.5-flash-latest
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.2, // Минимум креативности, чтобы JSON не сломался
                    }
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Gemini API Error details:", data);
            return res.status(response.status).json({
                error: 'Error from Gemini API',
                details: data
            });
        }

        // Извлекаем текст ответа
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

        // Очищаем от возможных Markdown тегов
        const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        // Возвращаем чистый JSON на фронтенд
        res.status(200).send(cleanedText);

    } catch (error) {
        console.error("Serverless Function Error:", error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
