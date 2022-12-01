using Amazon.S3.Model;
using Chat.Domain;
using Chat.Domain.Dto;
using Microsoft.AspNetCore.Http;
using S3Object = Chat.Domain.Dto.S3Object;

namespace Chat.Interfaces;

public interface IStorageService
{
    Task<S3ResponseDto> UploadFileAsync(IFormFile file);
    Task<GetObjectResponse> DownloadFileAsync(string objKey, string bucketName);
    Task<List<Amazon.S3.Model.S3Object>> GetAllObjectFromBucketAsync(string bucketName);
    Task CreateBucketAsync(string name);

    Task<ListBucketsResponse> GetAllBuckets();
}