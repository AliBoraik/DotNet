using Chat.Infrastructure;
using Chat.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Chat.Application;

public class ChatService : IChatService
{
    private readonly MessageDataContext _context;

    public ChatService(MessageDataContext context)
    {
        _context = context;
    }

    public async Task<Domain.Entities.Chat?> GetChat(Guid chatId)
    {
        return await _context.Chats.FirstOrDefaultAsync(ch => ch.Id == chatId);
    }

    public async Task<Guid> AddChat(Guid userId)
    {
        var chat = new Domain.Entities.Chat()
        {
            Id = userId,
            ClientId = userId.ToString(),
            IsProcessing = false
        };

        await _context.AddAsync(chat);
        await _context.SaveChangesAsync();
        return chat.Id;
    }
    
    public async Task<bool> JoinAdmin(Guid chatId, Guid adminId)
    {
        var chat = await _context.Chats.FirstOrDefaultAsync(ch => ch.Id == chatId);

        if (chat.IsProcessing)
            return false;
        
        chat.AdminId = adminId.ToString();
        chat.IsProcessing = true;
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task RemoveAdmin(Guid chatId)
    {
        var chat = await _context.Chats.FirstOrDefaultAsync(ch => ch.Id == chatId);
        chat.IsProcessing = false;
        await _context.SaveChangesAsync();
    }

    public async Task<List<Domain.Entities.Chat>> GetAll()
    {
        var chats = await _context.Chats.AsNoTracking().ToListAsync();

        return chats;
    }

    public async Task<List<Domain.Entities.Chat>> GetFree()
    {
        var chats = await _context.Chats.AsNoTracking().Where(ch => !ch.IsProcessing).ToListAsync();

        return chats;
    }
}