using System;

namespace Chat.Domain
{
    public interface IMessageCreated
    {
        string User { get;  }
        string Message { get; }
        DateTime MessageDate { get; }
    }
}