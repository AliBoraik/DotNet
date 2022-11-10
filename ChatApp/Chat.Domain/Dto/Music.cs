namespace Chat.Domain.Dto;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class Music : MongoFile
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public string Artist { get; set; } = null!;

    public string Album { get; set; } = null!;

    public string Name { get; set; } = null!;

    public int Duration { get; set; } = 0!;
}