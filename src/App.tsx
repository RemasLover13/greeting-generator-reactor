import { useState } from "react";
import { OccasionType, ToneType } from "./types";  
import type { LanguageType } from "./types";      
import { LANGUAGES } from "./constants";
import { generateGreeting } from "./services/geminiService";
import { generateGreetingImage, type GeneratedImage } from "./services/imageService";

function App() {
  const [occasion, setOccasion] = useState<OccasionType>(OccasionType.BIRTHDAY);
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [interests, setInterests] = useState<string>("");
  const [tone, setTone] = useState<ToneType>(ToneType.FRIENDLY);
  const [language, setLanguage] = useState<LanguageType>("Русский");
  const [greeting, setGreeting] = useState<string>("");  
  const [greetingImage, setGreetingImage] = useState<GeneratedImage | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);  
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [imageLoadError, setImageLoadError] = useState<boolean>(false);

  const handleGenerate = async (): Promise<void> => {
    if (!name.trim()) {
      alert("Пожалуйста, введите имя");  
      return;
    }

    setIsLoading(true);  
    setGreeting("");
    setGreetingImage(null);
    setImageLoadError(false);

    try {
      const result = await generateGreeting(
        occasion,
        name,
        age,
        interests,
        tone,
        language
      );
      setGreeting(result);
      
      setIsGeneratingImage(true);
      
      const image = await generateGreetingImage(occasion, name, interests, tone);
      
      if (image) {
        setGreetingImage(image);
        const img = new Image();
        img.onload = () => setImageLoadError(false);
        img.onerror = () => setImageLoadError(true);
        img.src = image.url;
      } else {
        setImageLoadError(true);
      }
      
    } catch (error) {
      console.error("Error occurred", error);
      setGreeting("❌ Произошла ошибка при генерации. Попробуйте позже.");
    } finally {
      setIsLoading(false);
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF5FF]">
      <header className="text-2xl font-bold p-4 text-center">🎉 Генератор поздравлений 🎊</header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">📅 Выберите праздник:</label>
            <div className="flex gap-3">
              <button 
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  occasion === OccasionType.BIRTHDAY 
                    ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-300 ring-offset-2' 
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200 hover:shadow-md'
                }`}
                onClick={() => setOccasion(OccasionType.BIRTHDAY)}
              >
                🎂 {OccasionType.BIRTHDAY}
                {occasion === OccasionType.BIRTHDAY && " ✓"}
              </button>
              <button 
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  occasion === OccasionType.NEW_YEAR 
                    ? 'bg-green-600 text-white shadow-lg ring-2 ring-green-300 ring-offset-2' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200 hover:shadow-md'
                }`}
                onClick={() => setOccasion(OccasionType.NEW_YEAR)}
              >
                🎄 {OccasionType.NEW_YEAR}
                {occasion === OccasionType.NEW_YEAR && " ✓"}
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">👤 Имя:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите имя получателя"
              className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">🎂 Возраст:</label>
            <input
              type="text"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Например: 25"
              className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">❤️ Интересы, хобби:</label>
            <textarea
              value={interests}
              rows={3}
              placeholder="Например: аниме, музыка, программирование, спорт"
              onChange={(e) => setInterests(e.target.value)}
              className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            ></textarea>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">🎭 Выберите тон поздравления:</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.values(ToneType).map((toneOption) => 
                <button 
                  key={toneOption} 
                  onClick={() => setTone(toneOption)}
                  className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                    tone === toneOption 
                      ? 'bg-purple-600 text-white shadow-lg ring-2 ring-purple-300 ring-offset-2' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                  }`}
                >
                  {toneOption}
                  {tone === toneOption && " ✓"}
                </button>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">🌍 Язык поздравления:</label>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value as LanguageType)}
              className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option value={lang} key={lang}>
                  {lang === "Русский" && "🇷🇺 "}
                  {lang === "Белорусский" && "🇧🇾 "}
                  {lang === "English" && "🇬🇧 "}
                  {lang === "Deutsch" && "🇩🇪 "}
                  {lang === "Español" && "🇪🇸 "}
                  {lang === "Français" && "🇫🇷 "}
                  {lang}
                </option>  
              ))}
            </select>
          </div>
          
          <hr className="my-6"/>
          
          <button 
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-bold text-lg hover:from-red-600 hover:to-pink-600 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-xl"
          >
            {isLoading ? "✨ Генерация..." : "🎁 Создать магию 🎁"}
          </button>
          
          {(greeting || greetingImage || isGeneratingImage) && (
            <div className="mt-8 space-y-6">
              {greeting && (
                <div className="p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-xl border border-gray-200 animate-fadeIn">
                  <h3 className="text-xl font-bold mb-3 text-center text-purple-600">✨ Ваше поздравление:</h3>
                  <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                    {greeting}
                  </div>
                </div>
              )}
              
              {isGeneratingImage && !greetingImage && (
                <div className="p-6 bg-white rounded-xl shadow-xl border border-gray-200 text-center">
                  <div className="animate-pulse">
                    <div className="text-4xl mb-2">🎨</div>
                    <p className="text-gray-500">Генерация изображения...</p>
                    <p className="text-xs text-gray-400 mt-2">Это может занять до 15 секунд</p>
                  </div>
                </div>
              )}
              
              {greetingImage && (
                <div className="p-6 bg-white rounded-xl shadow-xl border border-gray-200 animate-fadeIn">
                  <h3 className="text-xl font-bold mb-3 text-center text-purple-600">🖼️ Изображение к поздравлению:</h3>
                  <div className="flex justify-center">
                    {imageLoadError ? (
                      <div className="text-center p-8 bg-gray-100 rounded-lg">
                        <div className="text-4xl mb-2">🖼️</div>
                        <p className="text-gray-500">Не удалось загрузить изображение</p>
                        <p className="text-xs text-gray-400 mt-2">Попробуйте сгенерировать снова</p>
                      </div>
                    ) : (
                      <img 
                        src={greetingImage.url} 
                        alt="Generated greeting card"
                        className="rounded-lg shadow-lg max-w-full h-auto cursor-pointer"
                        style={{ maxHeight: "512px" }}
                        onLoad={() => console.log("Image loaded successfully")}
                        onError={() => {
                          console.error("Failed to load image");
                          setImageLoadError(true);
                        }}
                        onClick={() => window.open(greetingImage.url, '_blank')}
                      />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 text-center mt-3">
                    Сгенерировано с помощью: {greetingImage.model}
                    {greetingImage.prompt && (
                      <span className="block mt-1 opacity-50">
                        Промпт: {greetingImage.prompt.substring(0, 100)}...
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;