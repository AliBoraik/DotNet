namespace Chat.Domain.Dto;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class Image : MongoFile
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public string Name { get; set; } = null!;
    
    public ImageType Type { get; set; } = ImageType.Null!;

    public string Author { get; set; } = null!;

    public string Resolution { get; set; } = null!;
}