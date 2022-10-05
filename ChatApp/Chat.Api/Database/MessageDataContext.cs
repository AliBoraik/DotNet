using Chat.Api.Models.Entity;
using Microsoft.EntityFrameworkCore;

namespace Chat.Api.Database;

public class MessageDataContext : DbContext
{
    public MessageDataContext()
    {
        
    }
    public MessageDataContext(DbContextOptions options) : base(options)
   {
   }

   public DbSet<Message> Messages { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.UseSerialColumns();
    }
}