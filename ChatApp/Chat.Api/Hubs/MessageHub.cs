using Chat.Api.Hubs.Clients;
using Chat.Api.Producer;
using Chat.Domain.Entities;
using Microsoft.AspNetCore.SignalR;
namespace Chat.Api.Hubs
{
    public class MessageHub : Hub<IChatClient>
    { }
}