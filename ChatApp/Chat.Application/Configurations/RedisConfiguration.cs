using Chat.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;

namespace Chat.Application.Configurations;

public static class RedisConfiguration
{
    public static IServiceCollection AddRedis(this IServiceCollection services)
    {
        services.AddTransient<ICacheService,CacheService>();
        IConnectionMultiplexer redis = ConnectionMultiplexer.Connect("localhost");
        services.AddScoped(s => redis.GetDatabase());

        return services;
    }
}