namespace Chat.Domain.Dto;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class MongoFile
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    
    public FileType? Type { get; set; }
    
    public DateTime Date { get; set; }
    
    public string Data { get; set; }
}