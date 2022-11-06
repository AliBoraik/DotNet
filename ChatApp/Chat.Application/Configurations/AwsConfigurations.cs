using Amazon.Extensions.NETCore.Setup;
using Amazon.Runtime;
using Amazon.S3;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Chat.Application.Configurations;

public static class AwsConfigurations
{
    public static IServiceCollection AddAws(this IServiceCollection services, IConfiguration configuration)
    {
        var awsOptions = new AWSOptions
        {
            Credentials = new BasicAWSCredentials(
                configuration["AwsConfiguration:AccessKey"],
                configuration["AwsConfiguration:SecretKey"]),

            DefaultClientConfig =
            {
                ServiceURL = configuration["AwsConfiguration:ServiceURL"],
            }
        };
        
        services.AddDefaultAWSOptions(awsOptions);
        services.AddAWSService<IAmazonS3>();

        return services;
    }
}