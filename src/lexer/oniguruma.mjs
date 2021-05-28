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
        "source.fox": "./input/fox.tmLanguage.json"
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

    static async tokenize(text, scopeName)
    {
        const grammar = await Oniguruma.registry.loadGrammar(scopeName);
        const lines = text.split('\n');
        let ruleStack = vsctm.INITIAL;
        let result = [];

        if (!grammar)
        {
            console.log(`Unknown scope name: ${scopeName}`);
            return [];
        }

        for (const it in lines)
        {
            result[it] = grammar.tokenizeLine(lines[it], ruleStack);
            ruleStack = result[it].ruleStack;
        }

        return result;
    }

    static showTokens(text, tokenized)
    {
        const lines = text.split('\n');

        for (const it in lines)
        {
            console.log(`\nLine: ${lines[it]}`);

            for (const token of tokenized[it].tokens)
            {
                console.log(` - token from ${token.startIndex} to ${token.endIndex},`
                            + `(${lines[it].substring(token.startIndex, token.endIndex)}),`
                            + ` with scopes ${token.scopes.join(", ")}`);
            }
        }
    }
}