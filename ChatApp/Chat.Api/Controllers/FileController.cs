using Chat.Api.Producer;
using Chat.Domain;
using Chat.Domain.Dto;
using Chat.Domain.Entities;
using Chat.Domain.Messages;
using Chat.Infrastructure;
using Chat.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Shared.Enums;
using static System.Guid;

namespace Chat.Api.Controllers
{
    [ApiController]
    [Route("api/file")]
    public class FileController : Controller
    {
        private readonly ICacheService _cacheService;
        private readonly IStorageService _storageService;
        private readonly IRabbitMqProducer _producer;

        public FileController(IStorageService storageService, ICacheService cacheService, IRabbitMqProducer producer)
        {
            _cacheService = cacheService;
            _cacheService.ChangeDatabase(Database.File);
            _storageService = storageService;
            _producer = producer;
        }

        [HttpPost]
        public async Task<IActionResult> UploadFile([FromForm] Guid requestId, IFormFile file)
        {
            Console.WriteLine($"File received: {file.Name}");
            var result = await _storageService.UploadFileAsync(file);

            _cacheService.SetData(requestId.ToString(), result.FileName);  //cache file Id
            
            _producer.SendMessage<FileUploadMessage>(new FileUploadMessage(){ RequestId = requestId }, "ChatApp.File");
            
            return Ok(result.Message);
        }

        [HttpGet("DownloadFile")]
        public async Task<IActionResult> DownloadFile(string objectKey, string bucketName)
        {
            var file = await _storageService.DownloadFileAsync(objectKey, bucketName);

            return File(file.ResponseStream, file.Headers.ContentType, file.Key);
        }

        
        
        [HttpGet("all")]
        public async Task<IActionResult> GetAllFile( string bucketName)
        {
            var files = await _storageService.GetAllObjectFromBucketAsync(bucketName);

            return Ok(files);
        }
        
        [HttpPost("bucket")]
        public async Task<IActionResult> CreateBucket(string name)
        {
            await _storageService.CreateBucketAsync(name);
            return Ok($"Bucket {name} created");
        }
        
        [HttpGet("bucket/all")]
        public async Task<IActionResult> GetAllBuckets()
        {
            return Ok(await _storageService.GetAllBuckets());
        }
    }
}