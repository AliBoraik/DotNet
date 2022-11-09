using Chat.Domain.Metadata;
using Chat.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Chat.Api.Controllers;
[ApiController]
[Route("api/metadata")]
public class MetaDataController : Controller
{
    private readonly ICacheService _cacheService;
    
    // GET
    public MetaDataController(ICacheService cacheService)
    {
        _cacheService = cacheService;
    }
    [HttpPost]
    public async Task<IActionResult> AddMetadata(MetadataUpload metadata)
    {
        var expirationTime = DateTimeOffset.Now.AddDays(1);
        _cacheService.SetData(metadata.Id,metadata, expirationTime);
        return Ok();
    }
    [HttpGet]
    public async Task<IActionResult> GetMetadata(Guid id)
    {
        var md = _cacheService.GetData(id);
        if (md != null)
        {
            return Ok(md);
        }
        return NotFound();
    }
    
}