using System.Text.Json;
using Chat.Domain.Entities;
using Chat.Interfaces;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace Chat.BackgroundService.Handlers;

public class MessageSentHandler : Microsoft.Extensions.Hosting.BackgroundService
{
    private IConnection _connection;
    private IModel _channel;
    private ConnectionFactory _connectionFactory;
    private IMessageService _messageService;
    private readonly string _queueName;

    public MessageSentHandler(IMessageService messageService)
    {
        _messageService = messageService;
        _queueName = "ChatApp.Messages";
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
                var message = JsonSerializer.Deserialize<Message>(body);
                await _messageService.Create(message);
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