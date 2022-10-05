using System.Collections.Immutable;
using Chat.Api.Database;
using Chat.Api.Models;
using Chat.Api.Models.Entity;
using Microsoft.EntityFrameworkCore;

namespace Chat.Api.Repository;

public class MessageRepository : IMessageRepository
{
    private readonly MessageDataContext _db;

    public MessageRepository(MessageDataContext db)
    {
        _db = db;
    }

    public async Task<List<Message>> GetAll()
    {
        return await _db.Messages.ToListAsync();
    }

    public async Task Create(Message item)
    {
        await _db.Messages.AddAsync(item);

        await _db.SaveChangesAsync();
    }
    public async Task Delete(int id)
    {
        await Task.Run(() =>
        {
            Message order = _db.Messages.Find(id);
            if (order != null)
                _db.Messages.Remove(order);
        });
    }
}