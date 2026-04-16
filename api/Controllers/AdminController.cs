using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        [HttpGet("ping")]
        public ActionResult<object> Ping()
        {
            return Ok(new
            {
                message = "Admin access granted."
            });
        }
    }
}