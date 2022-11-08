using Chat.Domain.Metadata;
using Chat.Interfaces;
using StackExchange.Redis;
using System.Text.Json;

namespace Chat.Application;

public class CacheService : ICacheService
{
    private IDatabase _db;

    public CacheService(IDatabase db)
    {
        _db = db;
    }
    public bool SetData(Guid id,MetadataUpload metadataUpload, DateTimeOffset expirationTime)
    {
        var count = _db.Multiplexer.OperationCount - 10;
        Console.WriteLine(count);
        if (count == 2)
        {
            //TODO save to data (mangoDB)
            // save to database >>>
            return false;
        }
        var key = _convertGuidToKey(id);
        var value = JsonSerializer.Serialize(metadataUpload);
        var expiryTime = expirationTime.DateTime.Subtract(DateTime.Now);
        var isSet = _db.StringSet(key,value, expiryTime);
        return isSet;
    }

    public MetadataUpload? GetData(Guid id) {
        var key = _convertGuidToKey(id);
        var value = _db.StringGet(key);
        if (!string.IsNullOrEmpty(value)) {
            return JsonSerializer.Deserialize<MetadataUpload>(value);
        }
        return null;
    }
    
    public object RemoveData(Guid id) {
        var key = _convertGuidToKey(id);
        bool isKeyExist = _db.KeyExists(key);
        if (isKeyExist) {
            return _db.KeyDelete(key);
        }
        return false;
    }
    private string _convertGuidToKey(Guid id)
    {
        return id.ToString();
    }
}