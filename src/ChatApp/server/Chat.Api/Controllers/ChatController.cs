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
        private readonly IMessageService _messageService;
        private readonly IChatService _chat;
        public MessageController(IMessageService messageService, IChatService chat)
        {
            _messageService = messageService;
            _chat = chat;
        }

        [HttpGet("chats/history")]
        public async Task<IActionResult> GetHistory(Guid chatId)
        {
            var messages = await _messageService.GetFromChat(chatId);
            return Ok(messages);
        }
        
        [HttpGet("messages/all")]
        public async Task<IActionResult> GetAllMessages()
        {
            var messages = await _messageService.GetAll();
            return Ok(messages);
        }
        
        
        [HttpGet("chats/free")]
        public async Task<IActionResult> GetFreeChats()
        {
            var chats = await _chat.GetFree();
            return Ok(chats);
        }
        
        [HttpGet("chats")]
        public async Task<IActionResult> GetChats()
        {
            var chats = await _chat.GetAll();
            return Ok(chats);
        }
    }
}