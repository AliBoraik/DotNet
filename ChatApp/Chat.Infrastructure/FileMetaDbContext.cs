using Chat.Domain.Entities;
using Chat.Domain.Entities.MetaData;
using Chat.Interfaces;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Chat.Infrastructure;

public class FileMetaDbContext: IFileMetaDbContext
{
    private readonly IMongoCollection<SimpleFileMeta> _fileMetaCollection;

    public FileMetaDbContext(IOptions<FileMetaDbSettings> fileMetaDbSettings)
    {
        var mongoClient = new MongoClient(
            fileMetaDbSettings.Value.ConnectionString);
        Console.WriteLine(fileMetaDbSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            fileMetaDbSettings.Value.DatabaseName);

        
        _fileMetaCollection = mongoDatabase.GetCollection<SimpleFileMeta>(
            fileMetaDbSettings.Value.FileMetaCollectionName);
    }
    
    public async Task<List<SimpleFileMeta>> GetAsync() =>
        await _fileMetaCollection.Find(_ => true).ToListAsync();

    public async Task<SimpleFileMeta?> GetAsync(string id) =>
        await _fileMetaCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task CreateAsync(SimpleFileMeta newBook) =>
        await _fileMetaCollection.InsertOneAsync(newBook);

    public async Task UpdateAsync(string id, SimpleFileMeta updatedBook) =>
        await _fileMetaCollection.ReplaceOneAsync(x => x.Id == id, updatedBook);

    public async Task RemoveAsync(string id) =>
        await _fileMetaCollection.DeleteOneAsync(x => x.Id == id);
}