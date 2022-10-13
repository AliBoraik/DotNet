namespace Chat.Domain
{
    public class MessagePost
    {
        public string User { get; set; }
        public virtual string Message { get; set; }
    }
}