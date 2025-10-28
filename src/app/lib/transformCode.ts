import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import generate from "@babel/generator";

/**
 * Transforms component code to use the useTranslate hook.
 * @param code The original component source code.
 * @param mapping A map of original text to translation keys.
 * @returns The transformed source code as a string.
 */
export function transformCodeWithKeys(
  code: string,
  mapping: Record<string, string>
): string {
  const ast = parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

  let hasUseTranslateImport = false;
  const componentPaths: t.Node[] = [];

  // 1. Find component paths and check for existing import
  traverse(ast, {
    ImportDeclaration(path) {
      if (path.node.source.value === "@/hooks/useTranslate") {
        hasUseTranslateImport = true;
      }
    },
    FunctionDeclaration(path) {
        // Heuristic: assume it's a component if it returns JSX
        if (path.node.id && path.parent.type === "ExportDefaultDeclaration" || path.parent.type === "Program") {
            componentPaths.push(path.node);
        }
    },
    VariableDeclaration(path) {
        if (t.isArrowFunctionExpression(path.node.declarations[0].init)) {
            componentPaths.push(path.node);
        }
    }
  });

  // 2. Add import if it doesn't exist
  if (!hasUseTranslateImport) {
    const importDeclaration = t.importDeclaration(
      [t.importSpecifier(t.identifier("useTranslate"), t.identifier("useTranslate"))],
      t.stringLiteral("@/hooks/useTranslate")
    );
    ast.program.body.unshift(importDeclaration);
  }

  // 3. Inject hook call and replace text
  traverse(ast, {
    // Inject hook into component bodies
    "FunctionDeclaration|VariableDeclaration"(path) {
        if (componentPaths.includes(path.node)) {
            let body: t.BlockStatement;
            if (path.node.type === 'FunctionDeclaration') {
                body = path.node.body;
            } else { // VariableDeclaration
                if (!t.isVariableDeclaration(path.node)) return;
                const declar = path.node.declarations?.[0];
                if (!declar) return;
                const init = declar.init;
                if (!t.isArrowFunctionExpression(init)) return;
                if (!t.isBlockStatement(init.body)) return; // Can't inject into concise arrow
                body = init.body;
            }
            
            // Check if hook is already used
            const hasHook = body.body.some(stmt => 
                t.isVariableDeclaration(stmt) && 
                stmt.declarations.some(decl => 
                    t.isObjectPattern(decl.id) && 
                    decl.id.properties.some(prop => 
                        t.isObjectProperty(prop) && 
                        t.isIdentifier(prop.key) && 
                        prop.key.name === 't'
                    )
                )
            );

            if (!hasHook) {
                const hookDeclaration = t.variableDeclaration("const", [
                    t.variableDeclarator(
                        t.objectPattern([
                            t.objectProperty(t.identifier("t"), t.identifier("t"), false, true),
                        ]),
                        t.callExpression(t.identifier("useTranslate"), [])
                    ),
                ]);
                body.body.unshift(hookDeclaration);
            }
        }
    },

    // Replace text with t('key')
    JSXText(path) {
      const text = path.node.value.trim();
      if (text && mapping[text]) {
        const key = mapping[text];
        const callExpression = t.callExpression(t.identifier("t"), [t.stringLiteral(key)]);
        path.replaceWith(t.jsxExpressionContainer(callExpression));
      }
    },
    JSXAttribute(path) {
      if (
        t.isStringLiteral(path.node.value) &&
        mapping[path.node.value.value]
      ) {
        const key = mapping[path.node.value.value];
        const callExpression = t.callExpression(t.identifier("t"), [t.stringLiteral(key)]);
        path.get("value").replaceWith(t.jsxExpressionContainer(callExpression));
      }
    },
    TemplateLiteral(path) {
        if (path.node.expressions.length === 0) {
            const text = path.node.quasis[0].value.raw;
            if (text && mapping[text]) {
                const key = mapping[text];
                const callExpression = t.callExpression(t.identifier("t"), [t.stringLiteral(key)]);
                path.replaceWith(callExpression);
            }
        }
    }
  });

  // 4. Generate code from the modified AST
  const result = generate(ast, {
    retainLines: false,
    compact: false,
  });
  return result.code;
}