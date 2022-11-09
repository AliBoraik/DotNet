using Chat.Domain.Metadata;
using Microsoft.AspNetCore.Http;

namespace Chat.Interfaces;

public interface ICacheService
{
    bool SetData(Guid key,MetadataUpload metadataUpload, DateTimeOffset expirationTime);
    MetadataUpload? GetData(Guid key);
    object RemoveData(Guid key);
}