using Microsoft.AspNetCore.Mvc;
namespace UI.Controllers;

public class ArtistController : Controller
{
    [Route("artist/{id}")]
    public IActionResult Index(string id)
    {
        return View();
    }
    [Route("artist/{id}Partial")]
    public IActionResult IndexPartial(string id)
    {
        return PartialView("PlaylistPartial/IndexPartial");
    }
}