using Chat.Domain.Metadata;
using Chat.Interfaces;
using StackExchange.Redis;
using System.Text.Json;

namespace Chat.Application;

public class CacheService : ICacheService
{
    private ConnectionMultiplexer _redis;
    private IDatabase _db;

    public CacheService(IDatabase db)
    {
        _redis = ConnectionMultiplexer.Connect("localhost");
        _db = _redis.GetDatabase();
    }


    public bool SetData(string key, string value)
    {
         return _db.StringSet(key, value);
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