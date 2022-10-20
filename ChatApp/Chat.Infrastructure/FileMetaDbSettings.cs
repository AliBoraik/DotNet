using Microsoft.Extensions.Configuration;

namespace Chat.Infrastructure;

public class FileMetaDbSettings
{
    public string ConnectionString { get; set; } = null!;

    public string DatabaseName { get; set; } = null!;

    public string FileMetaCollectionName { get; set; } = null!;
}