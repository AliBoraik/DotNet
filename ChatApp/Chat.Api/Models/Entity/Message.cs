namespace Chat.Api.Models.Entity;

public class Message
{
    public int Id { get; set; }
    public string User { get; set; }
    public string MessageText { get; set; }
    public DateTime MessageDate { get; set; }
}