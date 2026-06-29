//ВЕРСИЯ С КОНТРОЛЛЕРАМИ 

using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("[controller]")]
public class LoginController : ControllerBase
{
    
    [HttpPost]
    public IActionResult Post([FromForm] LoginDto loginRequest)
    {
        User? user; 
        using (ApplicationContext db = new ApplicationContext())
        {
            user = db.Users.FirstOrDefault(c=>(c.Nickname == loginRequest.Nickname || c.Email == loginRequest.Nickname) && c.Password == loginRequest.Password); 
        }

        if(user == null)
        {
            return BadRequest(new {message = "Неверный логин или пароль"});
        }
        return Ok(user); 
    }
}