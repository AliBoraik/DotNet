using Chat.Api.Models;
using Chat.Api.Models.Entity;
using Chat.Api.Repository;
using MassTransit;

namespace Chat.Api.Services;

public class MessageCreatedConsumer  : IConsumer<IMessageCreated>
{
    private readonly IMessageRepository _repository;
    public MessageCreatedConsumer(IMessageRepository repository)
    {
        _repository = repository;
    }
    public async Task Consume(ConsumeContext<IMessageCreated> context)
    {
        Console.WriteLine($"Message event consumed. Message: {context.Message.Message} and data: {context.Message.MessageDate}");
        await _repository.Create(new Message()
        {
            User = context.Message.User,
            MessageText = context.Message.Message,
            MessageDate = context.Message.MessageDate.ToUniversalTime()
        });
    }
}