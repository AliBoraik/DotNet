
using Amazon;
using Amazon.S3;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Chat.Application.Configurations;

public static class AwsConfigurations
{
    public static IServiceCollection AddAws(this IServiceCollection services, IConfiguration configuration)
    {
        var s3Config = new AmazonS3Config
        {
            RegionEndpoint = RegionEndpoint.USWest1,
            ForcePathStyle = true,
            ServiceURL = configuration["AwsConfiguration:ServiceURL"]
        };

        services.AddSingleton<IAmazonS3>(_ => GetS3Client(configuration, s3Config));

        return services;
    }
    
    private static AmazonS3Client GetS3Client(IConfiguration configuration, AmazonS3Config s3Config) 
        => new(configuration["AwsConfiguration:AccessKey"], configuration["AwsConfiguration:SecretKey"], s3Config);
}