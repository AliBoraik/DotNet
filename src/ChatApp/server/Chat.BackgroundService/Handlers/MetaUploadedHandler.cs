using System.Text.Json;
using Chat.Domain.Entities;
using Chat.Domain.Messages;
using Chat.Interfaces;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using Shared.Enums;

namespace Chat.BackgroundService.Handlers;

public class MetaUploadedHandler : Microsoft.Extensions.Hosting.BackgroundService
{
    private IConnection _connection;
    private IModel _channel;
    private ConnectionFactory _connectionFactory;
    private ICacheService _cacheService;
    private readonly Producer _producer;
    private readonly string _queueName;

    public MetaUploadedHandler(ICacheService cacheService, Producer producer)
    {
        _cacheService = cacheService;
        _producer = producer;
        _cacheService.ChangeDatabase(Database.Common);
        _queueName = "ChatApp.Meta";
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
                var body = ea.Body.ToArray();
                var message = JsonSerializer.Deserialize<MetaUploadMessage>(body);
                
                _cacheService.Increment(message.RequestId.ToString());
                var counter = _cacheService.GetData(message.RequestId.ToString());
                
                if (counter == "2")
                {
                    _producer.SendMessage(new DataUploadedMessage(){RequestId = message.RequestId});
                }
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