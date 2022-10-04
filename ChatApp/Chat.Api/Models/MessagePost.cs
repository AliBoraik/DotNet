namespace Chat.Api.Models
{
    public class MessagePost
    {
        public string User { get; set; }
        public virtual string Message { get; set; }
    }
}