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
            options.UseNpgsql(configuration["MessageDbConnection"]));

        return services;
    }
}