using Chat.Application;
using Chat.Application.Configurations;
using Chat.BackgroundService;
using Chat.BackgroundService.Handlers;
using Chat.Infrastructure.Configurations;
using Chat.Interfaces;

var config = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json")
    .Build();
var builder = WebApplication.CreateBuilder(args);

var host = Host
    .CreateDefaultBuilder(args)
    .ConfigureServices((_, services) =>
    {
        services.AddInfrastructure(config);
        services.AddApplication(config);
        services.AddTransient<Producer>();
        services.AddApplication(builder.Configuration);
        services.AddHostedService<FileUploadedHandler>();
        services.AddHostedService<MetaUploadedHandler>();
        services.AddHostedService<MessageSentHandler>();
    })
    .Build();
ThreadPool.SetMinThreads(50, 100);
await host.RunAsync();