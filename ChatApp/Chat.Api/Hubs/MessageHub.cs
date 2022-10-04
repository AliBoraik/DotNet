using Chat.Api.Hubs.Clients;
using Microsoft.AspNetCore.SignalR;
namespace Chat.Api.Hubs
{
    public class MessageHub : Hub<IChatClient>
    { }
}