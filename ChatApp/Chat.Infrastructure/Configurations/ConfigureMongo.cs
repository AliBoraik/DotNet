using Chat.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Chat.Infrastructure.Configurations;

public static class ConfigureMongo
{
    public static IServiceCollection AddMongo(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<FileMetaDbSettings>(configuration.GetSection("FileMetaDb"));
        services.AddSingleton<IFileMetaDbContext, FileMetaDbContext>();

        return services;
    }
}