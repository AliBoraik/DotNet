using Chat.Domain.Metadata;
using Chat.Interfaces;
using StackExchange.Redis;
using System.Text.Json;
using Shared.Enums;

namespace Chat.Application;

public class CacheService : ICacheService
{
    private ConnectionMultiplexer _redis;
    private IDatabase _db;

    public CacheService(IDatabase db)
    {
        _redis = ConnectionMultiplexer.Connect("localhost");
        _db = _redis.GetDatabase((int) Database.Common);
    }

    public void ChangeDatabase(Database db)
    {
        _db = _redis.GetDatabase((int) db);
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