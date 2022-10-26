using Chat.Domain.Entities;

namespace Chat.Interfaces;

public interface IFileMetaDbContext
{
    public Task<List<FileMeta>> GetAsync();

    public Task<FileMeta?> GetAsync(string id);

    public Task CreateAsync(FileMeta newBook);

    public Task UpdateAsync(string id, FileMeta updatedBook);

    public Task RemoveAsync(string id);
}