using Chat.Api.Hubs;
using Chat.Api.Hubs.Clients;
using Chat.Api.Producer;
using Chat.Domain;
using Chat.Domain.Entities;
using Chat.Domain.Enums;
using Chat.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Chat.Api.Controllers
{
    [ApiController]
    [Route("api/message")]
    public class MessageController : Controller
    {
        /*private readonly IHubContext<MessageHub, IChatClient> _messageHub;*/
        private readonly IMessageService _messageService;
        /*private readonly IRabbitMqProducer _producer;*/

        public MessageController(/*IHubContext<MessageHub, IChatClient> chatHub,*/ IMessageService messageService/*, IRabbitMqProducer producer*/)
        {
            /*_messageHub = chatHub;*/
            _messageService = messageService;
            /*_producer = producer;*/
        }
        /*[HttpPost]
        public async Task<IActionResult> Create(string username, string data, MessageType type)
        {
            var message = new Message() { Username = username, MessageData = data, MessageType = type };
            await _messageHub.Clients.All.ReceiveMessage(message);
            _producer.SendMessage<Message>(message, "ChatApp.Message");
            return Ok();
        }*/

        [HttpGet("get_history")]
        public async Task<IActionResult> GetHistory()
        {
            var messages = await _messageService.GetAll();
            return Ok(messages);
        }
        
    }
}