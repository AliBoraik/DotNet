using Chat.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;


namespace Chat.Infrastructure;

public static class ConfigureServices
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<MessageDataContext>(options =>
        {
            var dockerEnv = Environment.GetEnvironmentVariable("CONNECTION_STRING_DOCKER");
            options.UseNpgsql(dockerEnv ?? configuration.GetConnectionString("MessageDb"));
        });
        services.Configure<FileMetaDbSettings>(configuration.GetSection("FileMetaDb"));
        services.AddSingleton<IFileMetaDbContext, FileMetaDbContext>();

        return services;
    }
}