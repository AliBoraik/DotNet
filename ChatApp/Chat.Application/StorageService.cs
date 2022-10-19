using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Transfer;
using Chat.Domain;
using Chat.Interfaces;

namespace Chat.Application;

public class StorageService : IStorageService
{
    public async Task<S3ResponseDto> UploadFileAsync(S3Object obj, AwsCredentials awsCredentialsValues)
    {
        var credentials = new BasicAWSCredentials(awsCredentialsValues.AccessKey, awsCredentialsValues.SecretKey);

        var config = new AmazonS3Config
        {
            RegionEndpoint = Amazon.RegionEndpoint.EUWest2,
            ServiceURL = "http://localhost:8000"
        };

        var response = new S3ResponseDto();
        try
        {
            var uploadRequest = new TransferUtilityUploadRequest()
            {
                InputStream = obj.InputStream,
                Key = obj.Name,
                BucketName = obj.BucketName,
                CannedACL = S3CannedACL.NoACL
            };

            // initialise client
            using var client = new AmazonS3Client(credentials, config);
            // TODO:  move to method...
            var list = await client.ListBucketsAsync();
            var hasBucket = list.Buckets.Any(listBucket => listBucket.BucketName.Equals(obj.BucketName));
            if (!hasBucket)
            {
                await client.PutBucketAsync(obj.BucketName);
            }
            
            // initialise the upload tools
            var transferUtility = new TransferUtility(client);

            // initiate the file upload
            await transferUtility.UploadAsync(uploadRequest);

            response.StatusCode = 201;
            response.Message = $"{obj.Name} has been uploaded successfully";
        }
        catch(AmazonS3Exception s3Ex)
        {
            response.StatusCode = (int)s3Ex.StatusCode;
            response.Message = s3Ex.Message;
        }
        catch(Exception ex)
        {
            response.StatusCode = 500;
            response.Message = ex.Message;
        }

        return response;
    }
}