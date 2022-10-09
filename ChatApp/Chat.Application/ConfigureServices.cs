﻿using Chat.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace Chat.Application;

public static class ConfigureServices
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddTransient<IMessageService, MessageService>();

        return services;
    }
}