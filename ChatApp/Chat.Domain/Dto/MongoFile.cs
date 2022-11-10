namespace Chat.Domain.Dto;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class MongoFile<T>
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    
    public FileType? Type { get; set; }
    
    public T Data { get; set; }
}