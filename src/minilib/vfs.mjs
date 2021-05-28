import fs from "fs";
import path from "path";
import url from "url";

class CreateDirectoryOptions
{
    constructor(recursive = false)
    {
        this.recursive = recursive;
    }
}

export default class VFS
{
    static fromCwd(filepath)
    {
        const filename = url.fileURLToPath(import.meta.url);
        return path.join(path.dirname(filename), "../../", filepath);
    }

    static exists(filepath)
    {
        return fs.existsSync(filepath);
    }

    static createDirectory(filepath)
    {
        const dirpath = filepath.substr(0, filepath.lastIndexOf("/"));
        const options = new CreateDirectoryOptions(true);

        fs.mkdirSync(dirpath, options);
    }

    static readFile(filepath)
    {
        return fs.readFileSync(filepath);
    }

    static writeFile(filepath, data)
    {
        if (!VFS.exists(filepath))
        {
            VFS.createDirectory(filepath);
        }

        return fs.writeFileSync(filepath, data);
    }
}