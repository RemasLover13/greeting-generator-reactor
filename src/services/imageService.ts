import { OccasionType, ToneType, ImageStyle } from "../types";

export interface GeneratedImage {
  url: string;
  prompt: string;
  model: string;
  dataUrl?: string;
}

const POLLINATIONS_API_KEY = import.meta.env.VITE_POLLINATIONS_API_KEY;
const BASE_URL = "https://gen.pollinations.ai";

const styleMap: Record<ImageStyle, string> = {
  [ImageStyle.REALISTIC]: "photorealistic, high detail, realistic style",
  [ImageStyle.ANIME]: "anime style, manga art, japanese animation style",
  [ImageStyle.CARTOON]: "cartoon style, colorful, animated movie style",
  [ImageStyle.WATERCOLOR]:
    "watercolor painting style, soft brush strokes, artistic",
  [ImageStyle.OIL_PAINTING]:
    "oil painting style, textured brush strokes, artistic",
  [ImageStyle.DIGITAL_ART]:
    "digital art style, vibrant colors, smooth gradients",
  [ImageStyle.PIXEL_ART]:
    "pixel art style, retro gaming aesthetic, 8-bit style",
  [ImageStyle.MINIMALIST]:
    "minimalist style, simple, clean design, flat illustration",
};

const createImagePrompt = (
  occasion: OccasionType,
  name: string,
  interests: string,
  tone: ToneType,
  imageStyle: ImageStyle,
): string => {
  const occasionMap = {
    [OccasionType.BIRTHDAY]: "birthday celebration",
    [OccasionType.NEW_YEAR]: "new year celebration",
  };

  const toneMap = {
    [ToneType.OFFICIAL]: "elegant, sophisticated, professional",
    [ToneType.FRIENDLY]: "warm, friendly, cheerful",
    [ToneType.HUMOROUS]: "funny, playful, humorous",
    [ToneType.ROMANTIC]: "romantic, soft lighting, hearts",
    [ToneType.TOUCHING]: "heartwarming, emotional, soft",
    [ToneType.ADULT]: "stylish, modern, artistic, sophisticated",
  };

  const occasionEng = occasionMap[occasion] || "celebration";
  const toneStyle = toneMap[tone] || "beautiful";
  const visualStyle = styleMap[imageStyle] || "beautiful style";

  const interestsMap: Record<string, string> = {
    пиво: "beer",
    баня: "sauna, bathhouse",
    рыбалка: "fishing",
    спорт: "sports",
    музыка: "music",
    аниме: "anime",
    танцы: "dancing",
    кино: "movies",
    книги: "books",
    путешествия: "travel",
    игры: "gaming",
    фотография: "photography",
    рисование: "drawing",
  };

  let interestsEn = interests;
  for (const [ru, en] of Object.entries(interestsMap)) {
    interestsEn = interestsEn.replace(new RegExp(ru, "gi"), en);
  }

  let prompt = `${occasionEng} scene, ${visualStyle}, ${toneStyle} mood`;

  if (name) {
    prompt += `, themed around ${name}`;
  }

  if (interestsEn && interestsEn !== interests) {
    prompt += `, featuring ${interestsEn} related elements`;
  } else if (interests) {
    prompt += `, featuring ${interests} related elements`;
  }

  prompt += `, no text, no letters, no words, no typography, no captions, purely visual, vibrant colors, high quality, detailed, 4k resolution, square format, beautiful composition, greeting card style without text`;

  return prompt;
};

export const generateGreetingImage = async (
  occasion: OccasionType,
  name: string,
  interests: string,
  tone: ToneType,
  imageStyle: ImageStyle,
): Promise<GeneratedImage | null> => {
  if (!POLLINATIONS_API_KEY) {
    console.error("❌ POLLINATIONS_API_KEY is not set in .env");
    return null;
  }

  try {
    const prompt = createImagePrompt(
      occasion,
      name,
      interests,
      tone,
      imageStyle,
    );
    console.log("🎨 Generating image with prompt:", prompt);

    const seed = Math.floor(Math.random() * 1000000);

    const response = await fetch(`${BASE_URL}/v1/images/generations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${POLLINATIONS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        model: "flux",
        size: "1024x1024",
        response_format: "b64_json",
        quality: "hd",
        seed: seed,
        nologo: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ API error:", errorData);

      if (response.status === 401) {
        throw new Error(
          "Неверный API ключ. Проверьте VITE_POLLINATIONS_API_KEY в .env",
        );
      } else if (response.status === 402) {
        throw new Error(
          "Недостаточно баланса. Пополните счет на enter.pollinations.ai",
        );
      } else {
        throw new Error(`API error: ${response.status}`);
      }
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
      model: `flux (${imageStyle})`,
    };
  } catch (error) {
    console.error("❌ Error generating image:", error);
    return null;
  }
};
