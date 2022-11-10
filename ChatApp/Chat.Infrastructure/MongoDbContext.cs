using Chat.Domain.Dto;

namespace Chat.Infrastructure;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

public class MongoDbContext
{
    private readonly IMongoCollection<MongoFile<object>> _collection;

    public MongoDbContext(
        IOptions<MongoDbSettings> mongoDbSettings)
    {
        var mongoClient = new MongoClient(
            mongoDbSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            mongoDbSettings.Value.DatabaseName);
        
        _collection = mongoDatabase.GetCollection<MongoFile<object>>(mongoDbSettings.Value.DatabaseName);
    }
    
    public async Task<List<MongoFile<object>>> GetAsync() =>
        await _collection.Find(_ => true).ToListAsync();

    public async Task<MongoFile<object>> GetAsync(string id) =>
        await _collection.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task CreateAsync(MongoFile<object> data) =>
        await _collection.InsertOneAsync(data);

    public async Task UpdateAsync(string id, MongoFile<object> updatedData) =>
        await _collection.ReplaceOneAsync(x => x.Id == id, updatedData);

    public async Task RemoveAsync(string id) =>
        await _collection.DeleteOneAsync(x => x.Id == id);
}
