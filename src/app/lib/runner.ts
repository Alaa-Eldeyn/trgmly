// src/lib/runner.ts
import { extractTextFromCode } from "./extractText";
import { translateTextBatch } from "./translateText";
import { transformCodeWithKeys } from "./transformCode";
import { ExtractedItem, TransformResult } from "./types";

/**
 * Orchestrates the entire transformation flow.
 * @param code The original component source code.
 * @param targetLang The target language code (e.g., 'ar').
 * @returns A promise that resolves to a TransformResult object.
 */
export async function runTransformFlow(
  code: string,
  targetLang: string
): Promise<TransformResult> {
  // 1. Extract text items from the source code
  const items = extractTextFromCode(code);
  if (items.length === 0) {
    return {
      transformedCode: code,
      translationsJson: {},
      items: [],
    };
  }

  const originalTexts = items.map((item) => item.text);

  // 2. Translate the extracted texts
  const translatedTexts = await translateTextBatch(originalTexts, targetLang);

  // 3. Prepare the necessary mappings and JSON objects
  const textToKeyMapping: Record<string, string> = {};
  const translationsJson: Record<string, string> = {};

  items.forEach((item, index) => {
    textToKeyMapping[item.text] = item.key;
    translationsJson[item.key] = translatedTexts[index] || item.text; // Fallback to original
  });

  // 4. Transform the original code with the new keys
  const transformedCode = transformCodeWithKeys(code, textToKeyMapping);

  // 5. Return the final result
  return {
    transformedCode,
    translationsJson: {
      [targetLang]: translationsJson,
    },
    items,
  };
}