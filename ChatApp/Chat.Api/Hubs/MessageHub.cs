using Chat.Api.Hubs.Clients;
using Chat.Api.Producer;
using Chat.Domain.Entities;
using Chat.Interfaces;
using Microsoft.AspNetCore.SignalR;
namespace Chat.Api.Hubs
{
    public class MessageHub : Hub
    {
        private readonly IChatService _chat;
        private readonly IMessageService _messages;
        private readonly IRabbitMqProducer _producer;

        public MessageHub(IChatService chat, IRabbitMqProducer producer, IMessageService messages)
        {
            _chat = chat;
            _producer = producer;
            _messages = messages;
        }

        public async Task SendMessage(Message message, string groupName)
        {
            Console.WriteLine($"!!!!!!!User {message.Username} send message {message.MessageData} to group {groupName}!!!!!!!");
            _producer.SendMessage<Message>(message, "ChatApp.Message");
            message.ChatId = Guid.Parse(groupName);
            await _messages.Create(message);
            await Clients.Group(groupName).SendAsync("Receive", message);
        }

        public async Task JoinUser(string chatName, string userId)
        {
            var chat = await _chat.GetChat(Guid.Parse(chatName));
            if (chat == null)
            {
                await _chat.AddChat(Guid.Parse(userId)); 
            }
        
            Console.WriteLine($"!!!!!!!!!User #${userId} joined to chat #${chatName}!!!!!!!!!!!");
        
            await Groups.AddToGroupAsync(Context.ConnectionId, chatName);
        }

        public async Task JoinAdmin(string chatName, string adminId)
        {
            var connectionSuccess = await _chat.JoinAdmin(Guid.Parse(chatName), Guid.Parse(adminId));
            if (connectionSuccess)
            {
                Console.WriteLine($"Admin #${adminId} joined to chat #${chatName}!!!!!!!!!!!");
                await Groups.AddToGroupAsync(Context.ConnectionId, chatName);
            }
        }

    }
}