import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyAmIUfCrodswcrvZy1yNVAZTwUoEda0a6g";
const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
    try {
        console.log("Fetching available models for this API key...");

        const url = "https://generativelanguage.googleapis.com/v1beta/models?key=" + API_KEY;
        const response = await fetch(url);

        if (!response.ok) {
            console.error("HTTP Error:", response.status, response.statusText);
            const text = await response.text();
            console.error("Details:", text);
            return;
        }

        const data = await response.json();
        const models = data.models || [];

        console.log("\nFound " + models.length + " models:");
        models.forEach((model) => {
            const methods = model.supportedGenerationMethods ? model.supportedGenerationMethods.join(', ') : 'none';
            console.log("- " + model.name + " (Supported methods: " + methods + ")");
        });

        // Filter models that support generateContent
        const textModels = models.filter((m) =>
            m.supportedGenerationMethods &&
            m.supportedGenerationMethods.includes('generateContent')
        );

        console.log("\nModels that support generateContent (" + textModels.length + "):");
        textModels.forEach((model) => {
            console.log("✅ " + model.name.replace('models/', ''));
        });

    } catch (error) {
        console.error("Error fetching models:", error);
    }
}

listModels();
