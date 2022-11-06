using Chat.Application;
using Chat.Application.Configurations;
using Chat.BackgroundService;
using Chat.Infrastructure;
using Chat.Infrastructure.Configurations;

var config = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json")
    .Build();

var host = Host
    .CreateDefaultBuilder(args)
    .ConfigureServices((_, services) =>
    {
        services.AddInfrastructure(config);
        services.AddApplication(config);
        services.AddHostedService<Consumer>();
    })
    .Build();

await host.RunAsync();