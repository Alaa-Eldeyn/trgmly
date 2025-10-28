/**
 * Represents a single text item extracted from the source code.
 */
export interface ExtractedItem {
  /** A unique identifier for this item, useful for tracking. */
  uid: string;
  /** The generated translation key (e.g., 'Hero.welcome_to_trgmly'). */
  key: string;
  /** The original text extracted from the code. */
  text: string;
  /** The type of AST node from which the text was extracted (for debugging). */
  nodeType: string;
}

/**
 * Represents the final output of the transformation process.
 */
export interface TransformResult {
  /** The transformed component code, ready to be used. */
  transformedCode: string;
  /** The generated JSON object for translations, e.g., { "en": {...}, "ar": {...} }. */
  translationsJson: Record<string, Record<string, string>>;
  /** The list of items that were extracted and processed. */
  items: ExtractedItem[];
}