import VFS from "./minilib/vfs.mjs";
import Oniguruma from "./lexer/oniguruma.mjs";

export default class Program
{
    static main(args)
    {
        const text = VFS.readFile(VFS.fromCwd("./input/program.cs")).toString();

        Oniguruma.initialize();
        Oniguruma.showTokens("source.cs", text);
    }
}