using Chat.Api.Models;
using MassTransit;

namespace Chat.Api.Services;

public class MessageCreatedConsumer  : IConsumer<IMessageCreated>
{
    
    public async Task Consume(ConsumeContext<IMessageCreated> context)
    {
        Console.WriteLine($"Message event consumed. Message: {context.Message.Message} and data: {context.Message.MessageDate}");
    }
}