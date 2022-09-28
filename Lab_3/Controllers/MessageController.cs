using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;
using Lab_3.Hubs;
using Lab_3.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Lab_3.Controllers
{
    [ApiController]
    [Route("api/message")]
    public class MessageController : Controller
    {
        protected readonly IHubContext<MessageHub> _messageHub;

        public MessageController([NotNull]IHubContext<MessageHub> messageHub)
        {
            _messageHub = messageHub;
        }
        [HttpPost]
        public async Task<IActionResult> Create(MessagePost messagePost)
        {
            await _messageHub.Clients.All.SendAsync("sendToReact", "The message '" +
                                                                   messagePost.Message + "' has been received");
            return Ok();
        }
    }
}