/**
 * Boilerplate Utility — Generates starter code for different languages 
 * based on a Python function signature.
 */

const JAVA_TEMPLATE = `class Solution {
    public {returnType} {functionName}({params}) {
        // Your code here
        return {returnValue};
    }
}
`;

const CPP_TEMPLATE = `class Solution {
public:
    {returnType} {functionName}({params}) {
        // Your code here
        return {returnValue};
    }
};
`;

const JS_TEMPLATE = `/**
 * @param {params_js_doc}
 * @return {returnType_js}
 */
var {functionName} = function({params_names}) {
    // Your code here
};
`;

export function generateBoilerplate(pythonCode: string, targetLang: string, title: string): string {
    if (!pythonCode || targetLang === "python") return pythonCode;

    // 1. Extract function name and params from Python (e.g. "def two_sum(nums, target):")
    const match = pythonCode.match(/def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)/);
    
    // Fallback if we can't parse it
    if (!match) {
        if (targetLang === "javascript") return "var solve = function() {\n    // Your code here\n};";
        if (targetLang === "java") return "class Solution {\n    public void solve() {\n        // Your code here\n    }\n}";
        if (targetLang === "cpp") return "class Solution {\npublic:\n    void solve() {\n        // Your code here\n    }\n};";
        return pythonCode;
    }

    const functionName = match[1];
    const paramsRaw = match[2].split(",").map(p => p.trim()).filter(p => p !== "self" && p !== "");
    
    // Convert function name to camelCase for JS/Java if it's snake_case
    const camelFunctionName = functionName.replace(/_([a-z])/g, (g) => g[1].toUpperCase());

    if (targetLang === "javascript") {
        const paramsNames = paramsRaw.map(p => p.split(":")[0].trim()).join(", ");
        return JS_TEMPLATE
            .replace("{functionName}", camelFunctionName)
            .replace("{params_names}", paramsNames)
            .replace("{params_js_doc}", paramsRaw.join(", "))
            .replace("{returnType_js}", "any");
    }

    if (targetLang === "java") {
        // Heuristic: if params contain "nums", "array", or "list", assume int[]
        // This is a simple version, in a real app we'd store type metadata in DB
        const javaParams = paramsRaw.map(p => {
            const name = p.split(":")[0].trim();
            if (name.includes("nums") || name.includes("arr")) return `int[] ${name}`;
            if (name.includes("target") || name.includes("val") || name.includes("k")) return `int ${name}`;
            if (name.includes("s") || name.includes("str")) return `String ${name}`;
            return `Object ${name}`;
        }).join(", ");

        return JAVA_TEMPLATE
            .replace("{returnType}", "int[]") // Defaulting to int[] for common problems, or void
            .replace("{functionName}", camelFunctionName)
            .replace("{params}", javaParams)
            .replace("{returnValue}", "null");
    }

    if (targetLang === "cpp") {
        const cppParams = paramsRaw.map(p => {
            const name = p.split(":")[0].trim();
            if (name.includes("nums") || name.includes("arr")) return `vector<int>& ${name}`;
            if (name.includes("target") || name.includes("val") || name.includes("k")) return `int ${name}`;
            if (name.includes("s") || name.includes("str")) return `string ${name}`;
            return `auto ${name}`;
        }).join(", ");

        return CPP_TEMPLATE
            .replace("{returnType}", "vector<int>")
            .replace("{functionName}", camelFunctionName)
            .replace("{params}", cppParams)
            .replace("{returnValue}", "{}");
    }

    return pythonCode;
}
