namespace Chat.Domain.Dto;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class Video
{
    public string Title { get; set; } = null!;

    public VideoType Type { get; set; } = VideoType.Null!;

    public string Author { get; set; } = null!;

    public string Director { get; set; } = null!;

    public string[] Artists { get; set; } = null!;
}