using System.Text.Json;
using Chat.Domain.Entities;
using Chat.Interfaces;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace Chat.BackgroundService;

public class Consumer : Microsoft.Extensions.Hosting.BackgroundService
{
    private IConnection _connection;
    private IModel _channel;
    private ConnectionFactory _connectionFactory;
    private IMessageService _messageService;

    public Consumer(IMessageService messageService)
    {
        _messageService = messageService;
    }
    
    public override Task StartAsync(CancellationToken cancellationToken)
    {
        _connectionFactory = new ConnectionFactory
        {
            HostName = "rabbitmq",
        };
        
        _connection = _connectionFactory.CreateConnection();
        _channel = _connection.CreateModel();
        _channel.QueueDeclare(queue: "ChatApp",
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
                var message = JsonSerializer.Deserialize<Message>(body);
                await _messageService.Create(message);
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception);
            }
        };

        _channel.BasicConsume(queue: "ChatApp", autoAck: true, consumer: consumer);

        await Task.CompletedTask;
    }
}