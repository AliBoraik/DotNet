namespace Chat.Domain.Entities
{
    public class MessagePost
    {
        public string User { get; set; }
        public virtual string Message { get; set; }
    }
}