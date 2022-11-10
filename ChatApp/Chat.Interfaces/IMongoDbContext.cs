using Chat.Domain.Dto;

namespace Chat.Interfaces;

public interface IMongoDbContext
{
    public Task<List<MongoFile>> GetAsync();

    public Task<MongoFile?> GetAsync(string id);

    public Task CreateAsync(MongoFile data);

    public Task UpdateAsync(string id, MongoFile data);

    public Task RemoveAsync(string id);
}