using Chat.Domain;
using Microsoft.AspNetCore.Http;

namespace Chat.Interfaces;

public interface IStorageService
{
    Task<S3ResponseDto> UploadFileAsync(S3Object obj);
    Task<IFormFile> DownloadFileAsync();
    Task CreateBucketAsync(string name);
}