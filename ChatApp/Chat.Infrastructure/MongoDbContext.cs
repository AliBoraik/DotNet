using Chat.Domain.Dto;

namespace Chat.Infrastructure;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

public class MongoDbContext
{
    readonly MongoDbCollection<Music> music;
    readonly MongoDbCollection<Video> video;
    readonly MongoDbCollection<Image> image;

    public MongoDbContext(
        IOptions<MongoDbSettings> mongoDbSettings)
    {
        var mongoClient = new MongoClient(
            mongoDbSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            mongoDbSettings.Value.DatabaseName);

        music = new MongoDbCollection<Music>(
            mongoDatabase, mongoDbSettings.Value.MusicCollectionName);
        
        video = new MongoDbCollection<Video>(
            mongoDatabase, mongoDbSettings.Value.VideoCollectionName);

        image = new MongoDbCollection<Image>(
            mongoDatabase, mongoDbSettings.Value.ImageCollectionName);

    }
}
