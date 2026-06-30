using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("[controller]")]
public class LoginController : ControllerBase
{
    [HttpPost]
    public IActionResult Post([FromForm] LoginDto loginRequest)
    {
        // ЛОГ 1: Получен запрос
        Console.WriteLine($"=== LOGIN ATTEMPT ===");
        Console.WriteLine($"Login: {loginRequest.Nickname}");
        Console.WriteLine($"Password: {loginRequest.Password}");
        
        using (ApplicationContext db = new ApplicationContext())
        {
            // ЛОГ 2: Проверяем всех пользователей
            var allUsers = db.Users.ToList();
            Console.WriteLine($"Total users in DB: {allUsers.Count}");
            foreach (var u in allUsers)
            {
                Console.WriteLine($"User: {u.Nickname}, Email: {u.Email}, Password: {u.Password}");
            }
            
            // ЛОГ 3: Ищем пользователя
            var user = db.Users
                .FirstOrDefault(u => 
                    u.Nickname == loginRequest.Nickname || 
                    u.Email == loginRequest.Nickname
                );
            
            if (user == null)
            {
                Console.WriteLine($"User NOT found: {loginRequest.Nickname}");
                return BadRequest(new { message = "Неверный логин или пароль" });
            }
            
            Console.WriteLine($"User FOUND: {user.Nickname}");
            Console.WriteLine($"Password in DB: {user.Password}");
            Console.WriteLine($"Password from request: {loginRequest.Password}");
            Console.WriteLine($"Passwords match: {user.Password == loginRequest.Password}");
            
            if (user.Password != loginRequest.Password)
            {
                Console.WriteLine($"Password MISMATCH!");
                return BadRequest(new { message = "Неверный логин или пароль" });
            }
            
            user.Password = "";
            return Ok(user);
        }
    }
}