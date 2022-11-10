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
        private readonly IFileMetaDbContext _fileMetaDbContext;
        private readonly MongoDbContext _mongoDbContext;

        public FileController(
            IStorageService storageService,
            IConfiguration config,
            IFileMetaDbContext fileMetaDbContext,
            MongoDbContext mongoDbContext
            )
        {
            _storageService = storageService;
            _config = config;
            _fileMetaDbContext = fileMetaDbContext;
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
            
            await _mongoDbContext.CreateAsync(new MongoFile<object>
            {
                Type = FileType.Image,
                Data = new Image
                {
                    Name = "Name",
                    Type = ImageType.Png,
                    Author = "Author",
                    Resolution = "1024x720"
                }
            });
          
          return Ok(result.Message);
        }

        [HttpGet]
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
    }
}