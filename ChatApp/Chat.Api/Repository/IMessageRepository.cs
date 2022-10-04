using Chat.Api.Models;
using Chat.Api.Models.Entity;

namespace Chat.Api.Repository;

public interface IMessageRepository
{
    Task<List<Message>> GetAll();
    Task Create(Message item);
    Task Delete(int id);
}