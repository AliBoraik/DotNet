using Chat.Domain.Entities;

namespace Chat.Interfaces;

public interface IMessageService
{
    Task<List<Message>> GetAll();
    Task Create(Message item);
    Task Delete(int id);
}
