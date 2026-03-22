import { OccasionType, ToneType, type LanguageType } from "../types";

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

if (!OPENROUTER_API_KEY) {
    console.error("❌ OpenRouter API Key is missing!");
    throw new Error("VITE_OPENROUTER_API_KEY is not set in environment variables");
}

if (!OPENROUTER_API_KEY.startsWith("sk-or-v1-")) {
    console.warn("⚠️ OpenRouter API key should start with 'sk-or-v1-'");
}

export const generateGreeting = async (
    occasion: OccasionType,
    name: string,
    age: string,
    interests: string,
    tone: ToneType,
    language: LanguageType
): Promise<string> => {
    try {
       
        
        const model = "google/gemini-2.5-flash-lite"; 
        
        const prompt = `
        Напиши уникальное поздравление на языке: ${language}.

        Повод: ${occasion},
        Для кого: ${name},
        Возраст: ${age ? age : "Не указан"},
        Интересы/хобби: ${interests ? interests : "Не указаны"},
        Тон: ${tone}
        
        Инструкции по стилю (адаптируй под культурный контекст языка ${language}):

        - Официальный: Сдержанный, уважительный.
        - Дружеский: Теплый, неформальный.
        - Юмористический: Веселый, забавный, с доброй шуткой.
        - Романтический: Нежный, любящий, чувственный.
        - Трогательный: Душевный, эмоциональный.
        - 18+: Дерзкое, с перчинкой, сарказмом или взрослыми шутками.

        Общие требования:

        - Обязательно учитывай возраст и интересы человека.
        - Длина: От 2 до 5 предложений.
        - Используй 2-3 подходящих по смыслу эмодзи.
        - Форматирование: Просто текст, без markdown заголовков.
        - Язык ответа СТРОГО: ${language}.
        `;

        console.log("📤 Sending request to OpenRouter...");
        console.log("Model:", model);
        
        const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": window.location.origin,
                "X-Title": "Greeting Generator",
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                temperature: tone === ToneType.ADULT ? 0.9 : 0.8,
                max_tokens: 500,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("❌ OpenRouter API error:", errorData);
            
            if (response.status === 401) {
                throw new Error("Неверный API ключ OpenRouter. Проверьте VITE_OPENROUTER_API_KEY в .env");
            } else if (response.status === 402) {
                throw new Error("Недостаточно кредитов на аккаунте OpenRouter. Попробуйте использовать бесплатную модель или пополните баланс");
            } else if (response.status === 429) {
                throw new Error("Превышен лимит запросов. Попробуйте позже");
            } else {
                throw new Error(`OpenRouter API error: ${errorData.error?.message || response.statusText}`);
            }
        }

        const data = await response.json();
        const generatedText = data.choices[0]?.message?.content || "Не удалось сгенерировать поздравление";
        
        console.log("✅ Generated greeting:", generatedText);
        return generatedText;
        
    } catch (error) {
        console.error("❌ Gemini/OpenRouter API error:", error);
        
        if (error instanceof Error) {
            throw new Error(`Ошибка генерации: ${error.message}`);
        }
        
        throw new Error("Неизвестная ошибка при обращении к OpenRouter");
    }
};