using System.Text.Json;
using Chat.Api.Producer;
using Chat.Domain.Dto;
using Chat.Domain.Messages;
using Chat.Domain.Metadata;
using Chat.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Shared.Enums;

namespace Chat.Api.Controllers;
[ApiController]
[Route("api/metadata")]
public class MetaDataController : Controller
{
    private readonly ICacheService _cacheService;
    private readonly IMongoDbContext _mongoDbContext;
    private readonly IRabbitMqProducer _producer;
    
    public MetaDataController(ICacheService cacheService, IMongoDbContext mongoDbContext, IRabbitMqProducer producer)
    {
        _cacheService = cacheService;
        //_cacheService.ChangeDatabase(Database.Meta);
        _mongoDbContext = mongoDbContext;
        _producer = producer;
    }

    [HttpPost]
    public async Task<IActionResult> Set([FromForm] Guid requestId, [FromForm] MongoFile meta)
    {
        var metaJson = JsonSerializer.Serialize(meta);
        Console.WriteLine($"Meta received: {metaJson}");
        _cacheService.SetData(requestId.ToString(), metaJson);
        _producer.SendMessage(new MetaUploadMessage(){RequestId = requestId}, "ChatApp.Meta");
        
        return Ok("Metadata successfully uploaded");
    }
    
    /*
    [HttpGet]
    public async Task<IActionResult> Get(string id)
    {
        var result = await _mongoDbContext.GetAsync(id);

        if (result == null)
            return BadRequest($"Metadata with id: {id} was not found");

        switch (result.Type)
        {
            case FileType.Image:
                var image = (Image)result.Data;
                return Ok($"Image \"{image.Name}\" ({image.Type}) by \"{image.Author}\".");
            case FileType.Music:
                var music = (Music)result.Data;
                return Ok($"Music \"{music.Name}\" ({music.Duration}) by \"{music.Artist}\" is in \"{music.Album}\".");
            case FileType.Video:
                var video = (Video)result.Data;
                return Ok($"Music \"{video.Title}\" ({video.Type}) by \"{video.Director}\" and has artists: {String.Join(", ", video.Artists)}.");
            default:
                return Ok($"Unknown format {result.Type}");
        }
    }
    */
    
}