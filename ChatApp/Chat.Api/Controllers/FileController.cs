using Chat.Domain;
using Chat.Domain.Dto;
using Chat.Domain.Entities;
using Chat.Infrastructure;
using Chat.Interfaces;
using Microsoft.AspNetCore.Mvc;
using static System.Guid;

namespace Chat.Api.Controllers
{
    [ApiController]
    [Route("api/file")]
    public class FileController : Controller
    {
        private readonly IStorageService _storageService;
        private readonly IConfiguration _config;
        private readonly IMongoDbContext _mongoDbContext;

        public FileController(
            IStorageService storageService,
            IConfiguration config,
            IMongoDbContext mongoDbContext
            )
        {
            _storageService = storageService;
            _config = config;
            _mongoDbContext = mongoDbContext;
        }

        [HttpPost(Name = "UploadFile")]
        public async Task<IActionResult> UploadFile(IFormFile file, string bucketName)
        {
            var s3Obj = new S3Object
            {
                File = file,
                Name = file.FileName,
                BucketName = bucketName
            };

            var result = await _storageService.UploadFileAsync(s3Obj);
            
            await _mongoDbContext.CreateAsync(new MongoFile
            {
                Type = FileType.Image,
                Date = DateTime.Now,
                Data = new Image
                {
                    Name = file.FileName,
                    Type = ImageType.Png,
                    Author = "Author",
                    Resolution = "1024x720"
                }
            });
          
          return Ok(result.Message);
        }

        [HttpGet("DownloadFile")]
        public async Task<IActionResult> DownloadFile(string objectKey, string bucketName)
        {
            var file = await _storageService.DownloadFileAsync(objectKey, bucketName);

            return File(file.ResponseStream, file.Headers.ContentType, file.Key);
        }

        [HttpGet]
        public async Task<IActionResult> GetMetaData(string id)
        {
            // return Ok(await _mongoDbContext.GetAsync(id));
            var result = await _mongoDbContext.GetAsync(id);

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
    }
}