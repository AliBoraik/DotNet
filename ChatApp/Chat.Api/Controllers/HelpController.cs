using Chat.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Shared.Enums;

namespace Chat.Api.Controllers;

[ApiController]
[Route("api/helper")]
public class HelpController : Controller
{
    private readonly ICacheService _cacheService;

    public HelpController(ICacheService cacheService)
    {
        _cacheService = cacheService;
        //_cacheService.ChangeDatabase(Database.Common);
    }

    [HttpGet("guid")]
    public IActionResult GenerateGuid()
    {
        return Ok(Guid.NewGuid());
    }

    [HttpPost("cache")]
    public IActionResult SetCache(string key, string value)
    {
        var result = _cacheService.SetData(key, value);
        return Ok(result);
    }
}