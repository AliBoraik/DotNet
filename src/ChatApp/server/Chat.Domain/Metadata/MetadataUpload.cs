namespace Chat.Domain.Metadata;

public class MetadataUpload
{
    public Guid Id { get; init; }
    public Dictionary<string, string> Metadata { get; set; }
}