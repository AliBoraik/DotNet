using Chat.Domain.Metadata;
using Chat.Interfaces;
using Shared.Enums;
using StackExchange.Redis;

namespace Chat.Application;

public class CacheService : ICacheService
{
    private IDatabase _db;
    private readonly IConnectionMultiplexer _muxer;
    
    public void ChangeDatabase(Database database)
    {
        _db = database switch
        {
            Database.File => _muxer.GetDatabase(1),
            Database.Meta => _muxer.GetDatabase(2),
            Database.Common => _muxer.GetDatabase(3),
            _ => throw new ArgumentException("Not supported db")
        };
    }

    public CacheService(IConnectionMultiplexer muxer)
    {
        _muxer = muxer;
        _db = muxer.GetDatabase((int) Database.Common);
    }

    public bool SetData(string key, string value)
    {
        return _db.StringSet(key, value);
    }

    public string? GetData(string key)
    {
        var value =  _db.StringGet(key);
        return value.ToString();
    }

    public void Increment(string key)
    {
        _db.StringIncrement(key);
    }
}