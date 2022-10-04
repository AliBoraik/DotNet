using Chat.Api.Models;

namespace Chat.Api.Hubs.Clients
{
    public interface IChatClient
    {
        Task ReceiveMessage(MessagePost message);
    }
}