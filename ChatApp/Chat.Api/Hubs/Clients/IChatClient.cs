
using Chat.Domain;
using Chat.Domain.Entities;

namespace Chat.Api.Hubs.Clients
{
    public interface IChatClient
    {
        Task ReceiveMessage(Message message);
    }
}