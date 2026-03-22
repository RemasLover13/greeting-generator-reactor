import { OccasionType, ToneType } from "../types";

export interface GeneratedImage {
    url: string;
    prompt: string;
    model: string;
    dataUrl?: string; 
}

const POLLINATIONS_API_KEY = import.meta.env.VITE_POLLINATIONS_API_KEY;
const BASE_URL = "https://gen.pollinations.ai";


const createImagePrompt = (
    occasion: OccasionType,
    name: string,
    interests: string,
    tone: ToneType
): string => {
    const occasionMap = {
        [OccasionType.BIRTHDAY]: "birthday celebration",
        [OccasionType.NEW_YEAR]: "new year celebration"
    };

    const toneMap = {
        [ToneType.OFFICIAL]: "elegant, sophisticated, professional greeting card",
        [ToneType.FRIENDLY]: "warm, friendly, cheerful greeting card",
        [ToneType.HUMOROUS]: "funny, playful, humorous greeting card, cartoon style",
        [ToneType.ROMANTIC]: "romantic, soft lighting, hearts, dreamy greeting card",
        [ToneType.TOUCHING]: "heartwarming, emotional, soft pastel colors greeting card",
        [ToneType.ADULT]: "stylish, modern, artistic greeting card, sophisticated"
    };

    const occasionEng = occasionMap[occasion] || "celebration";
    const toneStyle = toneMap[tone] || "beautiful greeting card";
    
    const interestsMap: Record<string, string> = {
        "пиво": "beer",
        "баня": "sauna, bathhouse",
        "рыбалка": "fishing",
        "спорт": "sports",
        "музыка": "music",
        "аниме": "anime",
        "танцы": "dancing",
        "кино": "movies",
        "книги": "books",
        "путешествия": "travel"
    };
    
    let interestsEn = interests;
    for (const [ru, en] of Object.entries(interestsMap)) {
        interestsEn = interestsEn.replace(new RegExp(ru, 'gi'), en);
    }
    
    let prompt = `${occasionEng}, ${toneStyle}`;
    
    if (name) {
        prompt += `, dedicated to ${name}`;
    }
    
    if (interestsEn && interestsEn !== interests) {
        prompt += `, incorporating ${interestsEn} themed elements`;
    } else if (interests) {
        prompt += `, incorporating ${interests} themed elements`;
    }
    
    prompt += `, vibrant colors, high quality, detailed, 4k resolution, square format, beautiful composition`;

    return prompt;
};


const fetchImageAsBase64 = async (imageUrl: string): Promise<string | null> => {
    try {
        const urlWithKey = `${imageUrl}&key=${POLLINATIONS_API_KEY}`;
        
        console.log("📥 Fetching image with auth...");
        
        const response = await fetch(urlWithKey, {
            headers: {
                "Authorization": `Bearer ${POLLINATIONS_API_KEY}`
            }
        });
        
        if (!response.ok) {
            console.error(`Failed to fetch image: ${response.status}`);
            return null;
        }
        
        const blob = await response.blob();
        
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
        
    } catch (error) {
        console.error("Error fetching image:", error);
        return null;
    }
};


export const generateGreetingImage = async (
    occasion: OccasionType,
    name: string,
    interests: string,
    tone: ToneType
): Promise<GeneratedImage | null> => {
    if (!POLLINATIONS_API_KEY) {
        console.error("❌ POLLINATIONS_API_KEY is not set in .env");
        return null;
    }

    try {
        const prompt = createImagePrompt(occasion, name, interests, tone);
        console.log("🎨 Generating image with prompt:", prompt);
        
        const seed = Math.floor(Math.random() * 1000000);
        
        const response = await fetch(`${BASE_URL}/v1/images/generations`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${POLLINATIONS_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: prompt,
                model: "flux",
                size: "1024x1024",
                response_format: "url",
                quality: "hd",
                seed: seed,
                nologo: true
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("❌ API error:", errorData);
            
            if (response.status === 401) {
                throw new Error("Неверный API ключ. Проверьте VITE_POLLINATIONS_API_KEY в .env");
            } else if (response.status === 402) {
                throw new Error("Недостаточно баланса. Пополните счет на enter.pollinations.ai");
            } else {
                throw new Error(`API error: ${response.status}`);
            }
        }

        const data = await response.json();
        const imageUrl = data.data?.[0]?.url;
        
        if (!imageUrl) {
            throw new Error("No image URL in response");
        }
        
        console.log("🖼️ Got image URL, fetching actual image...");
        
        const dataUrl = await fetchImageAsBase64(imageUrl);
        
        if (!dataUrl) {
            throw new Error("Failed to fetch image data");
        }
        
        console.log("✅ Image fetched successfully as base64");
        
        return {
            url: imageUrl,
            dataUrl: dataUrl,
            prompt: prompt,
            model: "flux (Pollinations.ai)"
        };
        
    } catch (error) {
        console.error("❌ Error generating image:", error);
        return null;
    }
};


export const generateGreetingImageBase64 = async (
    occasion: OccasionType,
    name: string,
    interests: string,
    tone: ToneType
): Promise<GeneratedImage | null> => {
    if (!POLLINATIONS_API_KEY) {
        console.error("❌ POLLINATIONS_API_KEY is not set in .env");
        return null;
    }

    try {
        const prompt = createImagePrompt(occasion, name, interests, tone);
        console.log("🎨 Generating image with prompt:", prompt);
        
        const seed = Math.floor(Math.random() * 1000000);
        
        const response = await fetch(`${BASE_URL}/v1/images/generations`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${POLLINATIONS_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: prompt,
                model: "flux",
                size: "1024x1024",
                response_format: "b64_json", 
                quality: "hd",
                seed: seed,
                nologo: true
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("❌ API error:", errorData);
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const b64Json = data.data?.[0]?.b64_json;
        
        if (!b64Json) {
            throw new Error("No base64 image in response");
        }
        
        const dataUrl = `data:image/jpeg;base64,${b64Json}`;
        
        console.log("✅ Image generated as base64");
        
        return {
            url: "",
            dataUrl: dataUrl,
            prompt: prompt,
            model: "flux (Pollinations.ai - base64)"
        };
        
    } catch (error) {
        console.error("❌ Error generating image:", error);
        return null;
    }
};