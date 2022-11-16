using Chat.Domain.Metadata;
using Microsoft.AspNetCore.Http;
using Shared.Enums;

namespace Chat.Interfaces;

public interface ICacheService
{
    void ChangeDatabase(Database db);
    bool SetData(string key, string value);
    string? GetData(string key);
    bool RemoveData(string key);
}