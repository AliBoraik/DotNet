using Chat.Domain;
using Chat.Domain.Entities;
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

        public FileController(IStorageService storageService, IConfiguration config, IFileMetaDbContext fileMetaDbContext)
        {
            _storageService = storageService;
            _config = config;
            _fileMetaDbContext = fileMetaDbContext;
        }

        [HttpPost(Name = "UploadFile")]
        public async Task<IActionResult> UploadFile(IFormFile file, string bucketName)
        {
            var fileExt = Path.GetExtension(file.FileName);
            var docName = $"{NewGuid()}{fileExt}";

            var s3Obj = new S3Object
            {
                File = file,
                Name = docName,
                BucketName = bucketName
            };

          var result = await _storageService.UploadFileAsync(s3Obj);
          
          return Ok(result.Message);
        }

        [HttpGet()]
        public async Task<IActionResult> DownloadFile(string name)
        {
            return Ok();
        }
        
        [HttpPost("bucket")]
        public async Task<IActionResult> CreateBucket(string name)
        {
            await _storageService.CreateBucketAsync(name);
            return Ok($"Bucket {name} created");
        }
    }
}