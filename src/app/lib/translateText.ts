/**
 * Translates a batch of texts to a target language.
 * 
 * NOTE: This is a client-side stub using a public LibreTranslate instance for MVP demonstration.
 * In a production environment, this logic MUST be moved to a server-side API route (/api/translate).
 * API keys for services like Google Translate or DeepL should ONLY be stored in server-side environment variables
 * and the server should act as a proxy to the translation service. This prevents key exposure and abuse.
 * 
 * @param texts An array of strings to translate.
 * @param targetLang The target language code (e.g., 'ar', 'es').
 * @returns A promise that resolves to an array of translated strings.
 */
export async function translateTextBatch(
  texts: string[],
  targetLang: string
): Promise<string[]> {
  if (!texts || texts.length === 0) {
    return [];
  }

  const LIBRETRANSLATE_URL = "https://libretranslate.de/translate";

  try {
    const response = await fetch(LIBRETRANSLATE_URL, {
      method: "POST",
      body: JSON.stringify({
        q: texts,
        source: "en",
        target: targetLang,
        format: "text",
        api_key: "", // Public instance doesn't need a key
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`LibreTranslate error: ${response.statusText}`);
    }

    const data = await response.json();
    // The API returns an object with a `translatedText` array
    return data.translatedText;
  } catch (error) {
    console.error("Translation failed:", error);
    // Fallback: return original texts if translation fails
    return texts;
  }
}