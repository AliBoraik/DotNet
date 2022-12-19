namespace Chat.Domain.Entities;

public class Chat
{
    public Guid Id { get; set; }
    public string ClientId { get; set; } = null!;
    public string? AdminId { get; set; }
    public bool IsProcessing { get; set; }
    public ICollection<Message> Messages { get; set; }
}