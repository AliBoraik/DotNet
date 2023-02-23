using Chat.Domain.Enums;

namespace Chat.Domain.Entities;

public class Message
{
    public Guid Id { get; set; }
    public string Username { get; set; } = null!;
    public string MessageData { get; set; } = null!;
    public MessageType MessageType { get; set; }
    public Guid ChatId { get; set; }
}