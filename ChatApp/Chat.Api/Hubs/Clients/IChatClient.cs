using Chat.Api.Models;
using Chat.Domain.Entities;

namespace Chat.Api.Hubs.Clients
{
    public interface IChatClient
    {
        Task ReceiveMessage(MessagePost message);
    }
}