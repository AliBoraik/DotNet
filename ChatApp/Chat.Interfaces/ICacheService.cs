using Chat.Domain.Metadata;
using Microsoft.AspNetCore.Http;

namespace Chat.Interfaces;

public interface ICacheService
{
    bool SetData(string key, string value);
    string? GetData(string key);
    bool RemoveData(string key);
}