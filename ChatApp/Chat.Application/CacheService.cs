using Chat.Domain.Metadata;
using Chat.Interfaces;
using StackExchange.Redis;

namespace Chat.Application;

public class CacheService : ICacheService
{
    private readonly IDatabase _db;

    public CacheService(IDatabase db)
    {
        _db = db;
    }

    public bool SetData(string key, string value)
    {
         return _db.StringSet(key, value);
    }

    public void IncrementAsync(string key)
    {
        _db.StringIncrement(key);
    }

    public string? GetData(string key)
    {
        return _db.StringGet(key);
    }

    public bool RemoveData(string key)
    {
        return _db.KeyExists(key) && _db.KeyDelete(key);
    }
}