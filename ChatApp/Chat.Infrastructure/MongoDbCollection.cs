using Chat.Domain.Dto;
using MongoDB.Driver;

namespace Chat.Infrastructure;

public class MongoDbCollection<T> where T : MongoFile
{
    private readonly IMongoCollection<T> _collection;

    public MongoDbCollection(IMongoDatabase database, string collectionName)
    {
        _collection = database.GetCollection<T>(collectionName);
    }
    
    public async Task<List<T>> GetAsync() =>
        await _collection.Find(_ => true).ToListAsync();

    public async Task<T?> GetAsync(string id) =>
        await _collection.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task CreateAsync(T data) =>
        await _collection.InsertOneAsync(data);

    public async Task UpdateAsync(string id, T updatedData) =>
        await _collection.ReplaceOneAsync(x => x.Id == id, updatedData);

    public async Task RemoveAsync(string id) =>
        await _collection.DeleteOneAsync(x => x.Id == id);
}