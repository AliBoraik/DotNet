using System.Text.Json;
using Chat.Domain.Dto;
using Chat.Domain.Messages;
using Chat.Interfaces;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using Shared.Enums;

namespace Chat.Api.Consumer;

public class RabbitMqConsumer : BackgroundService
{
    private IConnection _connection;
    private IModel _channel;
    private ConnectionFactory _connectionFactory;
    private ICacheService _cacheService;
    private IStorageService _storageService;
    private readonly IMongoDbContext _mongoDb;
    private readonly string _queueName;

    public RabbitMqConsumer(ICacheService cacheService, IMongoDbContext mongoDb, IStorageService storageService)
    {
        _cacheService = cacheService;
        _mongoDb = mongoDb;
        _storageService = storageService;
        _queueName = "ChatApp.DataUploaded";
    }
    
    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        await base.StopAsync(cancellationToken);
        _connection.Close();
    }
    
    public override Task StartAsync(CancellationToken cancellationToken)
    {
        _connectionFactory = new ConnectionFactory
        {
            HostName = "rabbitmq",
        };
        
        _connection = _connectionFactory.CreateConnection();
        _channel = _connection.CreateModel();
        _channel.QueueDeclare(queue: _queueName,
            durable: false,
            exclusive: false,
            autoDelete: false,
            arguments: null);
        return base.StartAsync(cancellationToken);
    }
    
    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        var consumer = new EventingBasicConsumer(_channel);
        consumer.Received += async (model, ea) =>
        {
            try
            {
                Console.WriteLine("!!!!!!GET COUNTER == 2!!!!!!!!!!!!");
                var body = ea.Body.ToArray();
                var message = JsonSerializer.Deserialize<DataUploadedMessage>(body);
                
                _cacheService.ChangeDatabase(Database.Meta);
                var metaJson = _cacheService.GetData(message.RequestId.ToString());
                //var meta = JsonSerializer.Deserialize<MongoFile>(metaJson);
                //await _mongoDb.CreateAsync(meta);
                
                _cacheService.ChangeDatabase(Database.File);
                var file = _cacheService.GetData(message.RequestId.ToString());
                Console.WriteLine($"!!!!!FILE : {file} !!!!!!!!!");
                await _storageService.MoveToPersistent(file, cancellationToken);
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception);
            }
        };

        _channel.BasicConsume(queue: _queueName, autoAck: true, consumer: consumer);

        await Task.CompletedTask;
    }
}