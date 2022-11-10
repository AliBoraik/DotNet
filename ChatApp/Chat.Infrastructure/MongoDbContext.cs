using Chat.Domain.Dto;
using Chat.Interfaces;

namespace Chat.Infrastructure;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

public class MongoDbContext : IMongoDbContext
{
    private readonly IMongoCollection<MongoFile> _collection;

    public MongoDbContext(
        IOptions<MongoDbSettings> mongoDbSettings)
    {
        var mongoClient = new MongoClient(
            mongoDbSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            mongoDbSettings.Value.DatabaseName);
        
        _collection = mongoDatabase.GetCollection<MongoFile>(mongoDbSettings.Value.DatabaseName);
    }
    
    public async Task<List<MongoFile>> GetAsync() =>
        await _collection.Find(_ => true).ToListAsync();

    public async Task<MongoFile> GetAsync(string id) =>
        await _collection.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task CreateAsync(MongoFile data) =>
        await _collection.InsertOneAsync(data);

    public async Task UpdateAsync(string id, MongoFile updatedData) =>
        await _collection.ReplaceOneAsync(x => x.Id == id, updatedData);

    public async Task RemoveAsync(string id) =>
        await _collection.DeleteOneAsync(x => x.Id == id);
}
