import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import { ExtractedItem } from "./types";

// Helper to generate a simple camelCase key
const toCamelCase = (str: string): string => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "")
    .replace(/[^\w]/g, "");
};

// Helper to generate a unique ID
let uidCounter = 0;
const generateUid = (): string => `uid_${Date.now()}_${uidCounter++}`;

/**
 * Extracts translatable text strings from React/Next.js component code.
 * @param code The source code of the component as a string.
 * @returns An array of ExtractedItem objects.
 */
export function extractTextFromCode(code: string): ExtractedItem[] {
  const itemsMap = new Map<string, ExtractedItem>();
  let componentName = "Component"; // Default component name

  const ast = parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

  // 1. First pass: find the component name for key generation
  traverse(ast, {
    ExportDefaultDeclaration(path) {
      if (path.node.declaration.type === "FunctionDeclaration") {
        componentName = path.node.declaration.id?.name || "Component";
      } else if (path.node.declaration.type === "Identifier") {
        componentName = path.node.declaration.name;
      }
    },
    FunctionDeclaration(path) {
        if(path.node.id && path.parent.type === "Program") {
            componentName = path.node.id.name;
        }
    }
  });

  // 2. Second pass: extract text
  traverse(ast, {
    JSXText(path) {
      const text = path.node.value.trim();
      if (text) {
        const key = `${componentName}.${toCamelCase(text)}`;
        if (!itemsMap.has(text)) {
          itemsMap.set(text, {
            uid: generateUid(),
            key,
            text,
            nodeType: path.node.type,
          });
        }
      }
    },
    JSXAttribute(path) {
      if (
        t.isStringLiteral(path.node.value) &&
        path.node.name.name !== "className" // Often class names are not translatable
      ) {
        const text = path.node.value.value;
        const key = `${componentName}.${toCamelCase(text)}`;
        if (!itemsMap.has(text)) {
          itemsMap.set(text, {
            uid: generateUid(),
            key,
            text,
            nodeType: path.node.type,
          });
        }
      }
    },
    // Simple template literals without expressions, e.g., `Hello world`
    TemplateLiteral(path) {
        if (path.node.expressions.length === 0) {
            const text = path.node.quasis[0].value.raw;
            const key = `${componentName}.${toCamelCase(text)}`;
            if (!itemsMap.has(text)) {
              itemsMap.set(text, {
                uid: generateUid(),
                key,
                text,
                nodeType: path.node.type,
              });
            }
        }
    }
  });

  return Array.from(itemsMap.values());
}