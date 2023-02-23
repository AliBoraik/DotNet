using Microsoft.AspNetCore.Mvc;
namespace UI.Controllers;

public class PlaylistController : Controller
{
    [Route("playlist/{id}")]
    public async Task<ViewResult> Index(int id)
    {
        return View();
    }
    
    [Route("playlist/{id}Partial")]
    public IActionResult IndexPartial(int id)
    {
        return PartialView("PlaylistPartial/IndexPartial");
    }
}