namespace Chat.Domain
{
    public class MessageDto
    {
        public string User { get; set; }
        public virtual string Message { get; set; }
    }
}