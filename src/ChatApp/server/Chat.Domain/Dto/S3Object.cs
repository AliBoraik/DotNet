using Microsoft.AspNetCore.Http;

namespace Chat.Domain.Dto;

public class S3Object
{
    public string Name { get; set; } = null!;
    public IFormFile File { get; set; } = null!;
    public string BucketName { get; set; } = null!;
}