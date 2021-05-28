import vsctm from "vscode-textmate";
import vsonig from "vscode-oniguruma";
import VFS from "../minilib/vfs.mjs";

class OnigLib
{
    createOnigScanner(patterns)
    {
        return new vsonig.OnigScanner(patterns);
    }

    createOnigString(s)
    {
        return new vsonig.OnigString(s);
    }
}

export default class Oniguruma
{
    static registry = {};
    static sources = {
        "source.cs": "./input/csharp.tmLanguage.json"
    };

    static loadGrammar(scopeName)
    {
        const grammerFile = Oniguruma.sources[scopeName];

        if (!grammerFile)
        {
            return null;
        }

        const filepath = VFS.fromCwd(grammerFile);
        const data = VFS.readFile(filepath).toString();
        return vsctm.parseRawGrammar(data, filepath);
    }

    static initialize()
    {
        const wasm = VFS.readFile(VFS.fromCwd("./node_modules/vscode-oniguruma/release/onig.wasm")).buffer;
        const onigLib = vsonig.loadWASM(wasm).then(() => { return new OnigLib() });

        Oniguruma.registry = new vsctm.Registry({
            "onigLib": onigLib,
            "loadGrammar": Oniguruma.loadGrammar
        });
    }

    static async showTokens(scopeName, text)
    {
        const grammar = await Oniguruma.registry.loadGrammar(scopeName);
        let ruleStack = vsctm.INITIAL;

        if (!grammar)
        {
            console.log(`Unknown scope name: ${scopeName}`);
            return;
        }

        for (let i = 0; i < text.length; i++)
        {
            const line = text[i];
            const lineTokens = grammar.tokenizeLine(line, ruleStack);

            console.log(`\nTokenizing line: ${line}`);

            for (let j = 0; j < lineTokens.tokens.length; j++)
            {
                const token = lineTokens.tokens[j];
                console.log(` - token from ${token.startIndex} to ${token.endIndex}, (${line.substring(token.startIndex, token.endIndex)}), with scopes ${token.scopes.join(', ')}`);
            }

            ruleStack = lineTokens.ruleStack;
        }
    }
}