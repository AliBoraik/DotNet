using Chat.Domain.Entities;
using Chat.Infrastructure;
using Chat.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Chat.Application;

public class MessageService : IMessageService
{
    private readonly MessageDataContext _db;

    public MessageService(MessageDataContext db)
    {
        _db = db;
    }

    public async Task<List<Message>> GetAll()
    {
        return await _db.Messages.ToListAsync();
    }

    public async Task<List<Message>> GetFromChat(Guid chatId)
    {
        var chat = await _db.Chats
            .Include(ch => ch.Messages)
            .FirstOrDefaultAsync(ch => ch.Id == chatId);

        return chat.Messages.ToList();
    }

    public async Task Create(Message item)
    {
        await _db.Messages.AddAsync(item);

        await _db.SaveChangesAsync();
    }
}