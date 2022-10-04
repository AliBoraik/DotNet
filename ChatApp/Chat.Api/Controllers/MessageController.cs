using Chat.Api.Database;
using Chat.Api.Hubs;
using Chat.Api.Hubs.Clients;
using Chat.Api.Models;
using MassTransit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Chat.Api.Controllers
{
    [ApiController]
    [Route("api/message")]
    public class MessageController : Controller
    {
        private readonly IHubContext<MessageHub, IChatClient> _messageHub;
        private readonly IPublishEndpoint _publishEndpoint;

        public MessageController(IHubContext<MessageHub, IChatClient> chatHub, IPublishEndpoint publishEndpoint)
        {
            _messageHub = chatHub;
            _publishEndpoint = publishEndpoint;
        }
        [HttpPost]
        public async Task<IActionResult> Create(MessagePost messagePost)
        {
            await _messageHub.Clients.All.ReceiveMessage(messagePost);
            await _publishEndpoint.Publish<IMessageCreated>(new {
                messagePost.User,
                messagePost.Message,
                MessageDate =  DateTime.Now
            });
            return Ok();
        }
        
        
    }
}