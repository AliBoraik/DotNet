﻿using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Chat.Domain.Entities.MetaData;

public class SimpleFileMeta
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    [BsonElement("Name")]
    public string Name { get; set; } = null!;
    public DateTime Date { get; set; }
}