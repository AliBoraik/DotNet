namespace Chat.Domain.Entities;

public class Message
{
    public int Id { get; set; }
    public string User { get; set; } = null!;
    public string MessageText { get; set; } = null!;
    public DateTime MessageDate { get; set; }
}