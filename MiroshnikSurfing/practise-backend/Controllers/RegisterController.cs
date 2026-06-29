using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("[controller]")]
public class RegisterController : ControllerBase
{
    [HttpPost]
    public IActionResult Post([FromForm] RegisterDto registerRequest)
    {
        // 1. Проверяем, существует ли пользователь с таким Email или Nickname
        using (ApplicationContext db = new ApplicationContext())
        {
            var existingUser = db.Users
                .FirstOrDefault(u => u.Email == registerRequest.Email || u.Nickname == registerRequest.Nickname);

            if (existingUser != null)
            {
                if (existingUser.Email == registerRequest.Email)
                {
                    return BadRequest(new { message = "Пользователь с таким Email уже существует" });
                }
                if (existingUser.Nickname == registerRequest.Nickname)
                {
                    return BadRequest(new { message = "Пользователь с таким Nickname уже существует" });
                }
            }

            // 2. Создаем нового пользователя
            User newUser = new User
            {
                Nickname = registerRequest.Nickname,
                Email = registerRequest.Email,
                Password = registerRequest.Password, // В реальном проекте - хешируйте!
                Name = registerRequest.Name,
                Surname = registerRequest.Surname,
                ContactInfo = registerRequest.ContactInfo,
                UserInfo = registerRequest.UserInfo,
                Achievement = registerRequest.Achievement,
                Image = registerRequest.Image,
                CreatedAt = DateTime.UtcNow
            };

            // 3. Добавляем в базу данных
            db.Users.Add(newUser);
            db.SaveChanges();

            // 4. Возвращаем успешный ответ (без пароля)
            newUser.Password = ""; // Очищаем пароль для безопасности

            return Ok(new 
            { 
                message = "Регистрация успешна!", 
                user = newUser 
            });
        }
    }
}