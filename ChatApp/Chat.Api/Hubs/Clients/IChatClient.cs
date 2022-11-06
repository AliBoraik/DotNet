
using Chat.Domain;

namespace Chat.Api.Hubs.Clients
{
    public interface IChatClient
    {
        Task ReceiveMessage(MessageDto message);
    }
}