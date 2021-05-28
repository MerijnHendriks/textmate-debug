export default class Json
{
    static serialize(data, prettify = false)
    {
        if (prettify)
        {
            return JSON.stringify(data, null, "\t");
        }
        else
        {
            return JSON.stringify(data);
        }
    }

    static deserialize(string)
    {
        return JSON.parse(string);
    }

    static clone(data)
    {
        return Json.deserialize(Json.serialize(data));
    }
}