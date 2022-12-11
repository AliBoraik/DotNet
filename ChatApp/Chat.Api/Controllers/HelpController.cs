using Chat.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Shared.Enums;

namespace Chat.Api.Controllers;

[ApiController]
[Route("api/helper")]
public class HelpController : Controller
{
    private readonly ICacheService _cache;

    public HelpController(ICacheService cacheService)
    {
        _cache = cacheService;
    }

    [HttpGet("guid")]
    public IActionResult GenerateGuid()
    {
        return Ok(Guid.NewGuid());
    }

    [HttpGet("cache")]
    public IActionResult Get(string key, Database database)
    {
        _cache.ChangeDatabase(database);
        var result = _cache.GetData(key);
        if (result == null)
            return NotFound();
        return Ok(result);
    }
    
    [HttpPost("cache")]
    public IActionResult Set(string key, string value)
    {
        var result = _cache.SetData(key, value);
        if (!result)
            return NotFound();
        return Ok(value);
    }

    [HttpPut("cache/increment")]
    public IActionResult Increment(string key)
    {
        _cache.Increment(key);
        return Ok();
    }
}