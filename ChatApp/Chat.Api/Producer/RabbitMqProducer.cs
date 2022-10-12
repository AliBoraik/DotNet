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

    public void SendMessage(string message)
    {

        var factory = new ConnectionFactory() { HostName = "rabbitmq" };
        using (var connection = factory.CreateConnection())
        using (var channel = connection.CreateModel())
        {
            channel.QueueDeclare(queue: "ChatApp",
                durable: false,
                exclusive: false,
                autoDelete: false,
                arguments: null);

            var body = Encoding.UTF8.GetBytes(message);

            channel.BasicPublish(exchange: "",
                routingKey: "ChatApp",
                basicProperties: null,
                body: body);
        }
    }
}