using Chat.Domain.Entities;

namespace Chat.Interfaces;

public interface IMessageService
{
    Task<List<Message>> GetAll();
    Task<List<Message>> GetFromChat(Guid chatId);
    Task Create(Message item);
}
