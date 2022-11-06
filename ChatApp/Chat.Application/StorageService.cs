using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using Amazon.Util.Internal;
using Chat.Domain;
using Chat.Interfaces;
using Microsoft.AspNetCore.Http;


namespace Chat.Application;

public class StorageService : IStorageService
{
    private readonly IAmazonS3 _amazonS3;

    public StorageService(IAmazonS3 amazonS3)
    {
        _amazonS3 = amazonS3;
    }

    public async Task<S3ResponseDto> UploadFileAsync(Chat.Domain.S3Object obj)
    {
        await using var newMemoryStream = new MemoryStream();
        await obj.File.CopyToAsync(newMemoryStream);
        var uploadRequest = new TransferUtilityUploadRequest
        {
            InputStream = newMemoryStream,
            Key = obj.File.FileName,
            BucketName = obj.BucketName,
            CannedACL = S3CannedACL.PublicRead
        };

        var transferUtility = new TransferUtility(_amazonS3);
        await transferUtility.UploadAsync(uploadRequest);
        
        var response = new S3ResponseDto()
        {
            StatusCode = 201,
            Message = $"{obj.Name} has been uploaded successfully"
        };
        return response;
    }

    public async Task<IFormFile> DownloadFileAsync()
    {
        throw new NotImplementedException();
        
    }

    public async Task CreateBucketAsync(string name)
    {
        var bucketRequest = new PutBucketRequest()
        {
            BucketName = name,
            UseClientRegion = true,
        };
        
        await _amazonS3.PutBucketAsync(bucketRequest);
    }
}