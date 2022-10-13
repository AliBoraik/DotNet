using Chat.BackgroundService;
using Chat.Infrastructure;

var config = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json")
    .Build();

var host = Host
    .CreateDefaultBuilder(args)
    .ConfigureServices((_, services) =>
    {
        services.AddInfrastructure(config);
        services.AddHostedService<Consumer>();
    })
    .Build();

await host.RunAsync();