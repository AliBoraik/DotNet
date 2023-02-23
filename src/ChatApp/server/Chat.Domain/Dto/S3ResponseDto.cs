namespace Chat.Domain.Dto;

public class S3ResponseDto
{
    public int StatusCode { get; set; }
    public string Message { get; set; }
    public string FileName { get; set; }
}