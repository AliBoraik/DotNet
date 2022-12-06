﻿using Chat.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;

namespace Chat.Application.Configurations;

public static class ConfigureServices
{
    public static IServiceCollection AddApplication(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddAws(configuration);
        services.AddTransient<IMessageService, MessageService>();
        services.AddTransient<IStorageService,StorageService>();
        services.AddTransient<ICacheService,CacheService>();
        IConnectionMultiplexer redis = ConnectionMultiplexer.Connect("localhost,abortConnect=false");
        services.AddScoped(s => redis.GetDatabase());

        return services;
    }
}