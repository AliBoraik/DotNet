using Chat.Domain.Entities;
using Chat.Domain.Entities.MetaData;

namespace Chat.Interfaces;

public interface IFileMetaDbContext
{
    public Task<List<SimpleFileMeta>> GetAsync();

    public Task<SimpleFileMeta?> GetAsync(string id);

    public Task CreateAsync(SimpleFileMeta newBook);

    public Task UpdateAsync(string id, SimpleFileMeta updatedBook);

    public Task RemoveAsync(string id);
}