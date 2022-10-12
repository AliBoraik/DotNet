using System;

namespace Chat.Api.Models
{
    public interface IMessageCreated
    {
        string User { get;  }
        string Message { get; }
        DateTime MessageDate { get; }
    }
}