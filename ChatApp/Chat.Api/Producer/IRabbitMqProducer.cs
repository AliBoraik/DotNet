namespace Chat.Api.Producer;

public interface IRabbitMqProducer
{
    //void SendMessage(object obj);
    void SendMessage<T>(T message, string queue);
}