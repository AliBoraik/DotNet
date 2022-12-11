using Chat.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;

namespace Chat.Application.Configurations;

public static class RedisConfiguration
{
    public static IServiceCollection AddRedis(this IServiceCollection services, IConfiguration configuration)
    {
        var configurationOptions = new ConfigurationOptions()
        {
            EndPoints =
            {
                { "redis", 6379 }
            }
        };

        services.AddSingleton<IConnectionMultiplexer>(options => ConnectionMultiplexer.Connect(configurationOptions));
        services.AddTransient<ICacheService, CacheService>(); 
        
        return services;
    }
}