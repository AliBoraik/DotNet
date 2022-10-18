using Chat.Domain;
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

        public FileController(IStorageService storageService, IConfiguration config)
        {
            _storageService = storageService;
            _config = config;
        }

        [HttpPost(Name = "UploadFile")]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            // Process file
            await using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);

            var fileExt = Path.GetExtension(file.FileName);
            var docName = $"{NewGuid()}.{fileExt}";
            // call server

            var s3Obj = new S3Object
            {
                BucketName = "demo-bucket",
                InputStream = memoryStream,
                Name = docName
            };

            var cred = new AwsCredentials
            {
                AccessKey = _config["AwsConfiguration:AWSAccessKey"],
                SecretKey = _config["AwsConfiguration:AWSSecretKey"]
            };

            var result = await _storageService.UploadFileAsync(s3Obj, cred);
            return Ok(result);
        }
        
    }
}