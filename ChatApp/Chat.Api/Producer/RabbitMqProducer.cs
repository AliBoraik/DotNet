using System.Text;
using System.Text.Json;
using RabbitMQ.Client;

namespace Chat.Api.Producer;

public class RabbitMqProducer: IRabbitMqProducer
{
    public void SendMessage(object obj)
    {
        var message = JsonSerializer.Serialize(obj);
        SendMessage(message);
    }

    public void SendMessage<T>(T message, string queue)
    {

        var factory = new ConnectionFactory() { HostName = "rabbitmq" };
        using (var connection = factory.CreateConnection())
        using (var channel = connection.CreateModel())
        {
            channel.QueueDeclare(queue: queue,
                durable: false,
                exclusive: false,
                autoDelete: false,
                arguments: null);

            var messageJson = JsonSerializer.Serialize(message);
            
            var body = Encoding.UTF8.GetBytes(messageJson);

            channel.BasicPublish(exchange: "",
                routingKey: "ChatApp",
                basicProperties: null,
                body: body);
        }
    }
}