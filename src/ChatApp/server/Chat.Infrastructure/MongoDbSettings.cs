namespace Chat.Infrastructure;

public class MongoDbSettings
{
    public string ConnectionString { get; set; } = null!;

    public string DatabaseName { get; set; } = null!;

    public string MusicCollectionName { get; set; } = null!;
    
    public string VideoCollectionName { get; set; } = null!;
    
    public string ImageCollectionName { get; set; } = null!;
}