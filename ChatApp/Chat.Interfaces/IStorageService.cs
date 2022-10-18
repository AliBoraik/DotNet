using Chat.Domain;

namespace Chat.Interfaces;

public interface IStorageService
{
    Task<S3ResponseDto> UploadFileAsync(S3Object obj, AwsCredentials awsCredentialsValues);
}