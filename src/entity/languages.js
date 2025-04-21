import { Language } from "./enums";

export const LANGUAGE_CONFIG = {
  [Language.C]: {
    label: "C",
    mode: "text/x-csrc",
    template: `#include <stdio.h>

int main() {
    // 你的代码
    return 0;
}`,
    keywords: [
      "#include",
      "if",
      "else",
      "for",
      "while",
      "do",
      "switch",
      "case",
      "break",
      "continue",
      "return",
      "struct",
      "typedef",
      "sizeof",
      "printf",
      "scanf",
      "define",
      "static",
      "const",
      "volatile",
    ],
  },

  [Language.Cpp]: {
    label: "C++",
    mode: "text/x-c++src",
    template: `#include <iostream>
using namespace std;

int main() {
    // 你的代码
    
    return 0;
}`,
    keywords: [
      "namespace",
      "class",
      "template",
      "public",
      "private",
      "protected",
      "virtual",
      "override",
      "try",
      "catch",
      "throw",
      "new",
      "delete",
      "cout",
      "cin",
      "endl",
      "vector",
      "string",
      "auto",
      "constexpr",
    ],
  },

  [Language.Java]: {
    label: "Java",
    mode: "text/x-java",
    template: `public class Main {
    public static void main(String[] args) {
        // 你的代码
    }
}`,
    keywords: [
      "package",
      "import",
      "interface",
      "implements",
      "extends",
      "super",
      "this",
      "final",
      "throws",
      "instanceof",
      "synchronized",
      "System.out.println",
      "String",
      "Integer",
      "ArrayList",
      "HashMap",
    ],
  },

  [Language.Python]: {
    label: "Python",
    mode: "text/x-python",
    template: `def main():
    # 你的代码
  
if __name__ == "__main__":
    main()`,
    keywords: [
      "def",
      "lambda",
      "async",
      "await",
      "with",
      "as",
      "yield",
      "import",
      "from",
      "raise",
      "except",
      "finally",
      "nonlocal",
      "print",
      "range",
      "len",
      "type",
      "list",
      "dict",
      "tuple",
    ],
  },

  [Language.Lua]: {
    label: "Lua",
    mode: "text/x-lua",
    template: `-- 你的代码
function main()

end
  
main()`,
    keywords: [
      "function",
      "end",
      "local",
      "repeat",
      "until",
      "pairs",
      "ipairs",
      "table",
      "require",
      "module",
      "coroutine",
      "io.write",
      "string.format",
      "tonumber",
      "tostring",
    ],
  },

  [Language.Verilog]: {
    label: "Verilog",
    mode: "text/x-verilog",
    template: `module main;
// 你的代码
endmodule`,
    keywords: [
      "module",
      "endmodule",
      "input",
      "output",
      "reg",
      "wire",
      "always",
      "posedge",
      "negedge",
      "assign",
      "parameter",
      "begin",
      "end",
      "case",
      "default",
      "initial",
      "$display",
    ],
  },
};

// 默认支持语言列表（使用枚举值）
export const DEFAULT_LANGUAGES = [
  Language.C,
  Language.Cpp,
  Language.Java,
  Language.Python,
  Language.Lua,
  Language.Verilog,
];
