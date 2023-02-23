using Chat.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Chat.Infrastructure;

public class MessageDataContext : DbContext
{
    public MessageDataContext() {}
    public MessageDataContext(DbContextOptions options) : base(options) {}

    public DbSet<Domain.Entities.Chat> Chats { get; set; }
    public DbSet<Message> Messages { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.UseSerialColumns();
        base.OnModelCreating(modelBuilder);
    }
}