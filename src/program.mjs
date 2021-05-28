import VFS from "./minilib/vfs.mjs";
import Oniguruma from "./lexer/oniguruma.mjs";

export default class Program
{
    static async main(args)
    {
        Oniguruma.initialize();

        const text = VFS.readFile(VFS.fromCwd("./input/program.fox")).toString();
        const tokenized = await Oniguruma.tokenize(text, "source.fox");

        Oniguruma.showTokens(text, tokenized);
    }
}