using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("[controller]")]
public class NewsController : ControllerBase
{
    // GET: /News - получить все посты
    [HttpGet]
    public IActionResult Get()
    {
        using (ApplicationContext db = new ApplicationContext())
        {
            var posts = db.Posts
                .Include(p => p.Author)
                .OrderByDescending(p => p.PublishDate)
                .Select(p => new PostDto
                {
                    Id = p.Id,
                    Text = p.Text,
                    Photo = p.Photo,
                    PublishDate = p.PublishDate,
                    AuthorNickname = p.Author != null ? p.Author.Nickname : null,
                    AuthorName = p.Author != null ? p.Author.Name : null,
                    AuthorSurname = p.Author != null ? p.Author.Surname : null,
                    AuthorPhoto = p.Author != null ? p.Author.Image : null
                })
                .ToList();

            return Ok(posts);
        }
    }

    // GET: /News/{id} - получить пост по id
    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        using (ApplicationContext db = new ApplicationContext())
        {
            var post = db.Posts
                .Include(p => p.Author)
                .FirstOrDefault(p => p.Id == id);

            if (post == null)
            {
                return NotFound(new { message = "Пост не найден" });
            }

            var postDto = new PostDto
            {
                Id = post.Id,
                Text = post.Text,
                Photo = post.Photo,
                PublishDate = post.PublishDate,
                AuthorNickname = post.Author != null ? post.Author.Nickname : null,
                AuthorName = post.Author != null ? post.Author.Name : null,
                AuthorSurname = post.Author != null ? post.Author.Surname : null,
                AuthorPhoto = post.Author != null ? post.Author.Image : null
            };

            return Ok(postDto);
        }
    }

    // POST: /News - создать новый пост
    [HttpPost]
    public IActionResult Post([FromForm] AddPostDto addPostRequest)
    {
        // Проверка: есть ли текст или фото
        if (string.IsNullOrWhiteSpace(addPostRequest.Text) && string.IsNullOrWhiteSpace(addPostRequest.Photo))
        {
            return BadRequest(new { message = "Заполните текст или добавьте изображение" });
        }

        using (ApplicationContext db = new ApplicationContext())
        {
            // Проверяем, существует ли пользователь по Nickname
            var user = db.Users.FirstOrDefault(u => u.Nickname == addPostRequest.AuthorNickname);
            if (user == null)
            {
                return BadRequest(new { message = "Пользователь не найден" });
            }

            // Создаем новый пост
            Post newPost = new Post
            {
                Text = addPostRequest.Text,
                UserId = user.Id,
                Photo = addPostRequest.Photo,
                PublishDate = DateTime.UtcNow
            };

            db.Posts.Add(newPost);
            db.SaveChanges();

            // Загружаем автора для ответа
            db.Entry(newPost).Reference(p => p.Author).Load();

            return Ok(new 
            { 
                message = "Пост успешно создан", 
                postId = newPost.Id,
                post = new PostDto
                {
                    Id = newPost.Id,
                    Text = newPost.Text,
                    Photo = newPost.Photo,
                    PublishDate = newPost.PublishDate,
                    AuthorNickname = newPost.Author?.Nickname,
                    AuthorName = newPost.Author?.Name,
                    AuthorSurname = newPost.Author?.Surname,
                    AuthorPhoto = newPost.Author?.Image
                }
            });
        }
    }

    // PUT: /News/{id} - обновить пост
    [HttpPut("{id}")]
    public IActionResult Put(int id, [FromForm] AddPostDto updatePostRequest)
    {
        using (ApplicationContext db = new ApplicationContext())
        {
            var post = db.Posts.FirstOrDefault(p => p.Id == id);
            if (post == null)
            {
                return NotFound(new { message = "Пост не найден" });
            }

            // Проверяем, что пользователь является автором
            var user = db.Users.FirstOrDefault(u => u.Nickname == updatePostRequest.AuthorNickname);
            if (user == null || post.UserId != user.Id)
            {
                return BadRequest(new { message = "Вы не можете редактировать этот пост" });
            }

            // Обновляем поля
            if (!string.IsNullOrWhiteSpace(updatePostRequest.Text))
            {
                post.Text = updatePostRequest.Text;
            }
            if (!string.IsNullOrWhiteSpace(updatePostRequest.Photo))
            {
                post.Photo = updatePostRequest.Photo;
            }

            db.SaveChanges();

            return Ok(new { message = "Пост успешно обновлен" });
        }
    }

    // DELETE: /News/{id} - удалить пост
    [HttpDelete("{id}")]
    public IActionResult Delete(int id, [FromQuery] string authorNickname)
    {
        using (ApplicationContext db = new ApplicationContext())
        {
            var post = db.Posts.FirstOrDefault(p => p.Id == id);
            if (post == null)
            {
                return NotFound(new { message = "Пост не найден" });
            }

            // Проверяем, что пользователь является автором
            var user = db.Users.FirstOrDefault(u => u.Nickname == authorNickname);
            if (user == null || post.UserId != user.Id)
            {
                return BadRequest(new { message = "Вы не можете удалить этот пост" });
            }

            db.Posts.Remove(post);
            db.SaveChanges();

            return Ok(new { message = "Пост успешно удален" });
        }
    }

    // GET: /News/user/{nickname} - получить посты пользователя
    [HttpGet("user/{nickname}")]
    public IActionResult GetUserPosts(string nickname)
    {
        using (ApplicationContext db = new ApplicationContext())
        {
            var user = db.Users.FirstOrDefault(u => u.Nickname == nickname);
            if (user == null)
            {
                return NotFound(new { message = "Пользователь не найден" });
            }

            var posts = db.Posts
                .Include(p => p.Author)
                .Where(p => p.UserId == user.Id)
                .OrderByDescending(p => p.PublishDate)
                .Select(p => new PostDto
                {
                    Id = p.Id,
                    Text = p.Text,
                    Photo = p.Photo,
                    PublishDate = p.PublishDate,
                    AuthorNickname = p.Author != null ? p.Author.Nickname : null,
                    AuthorName = p.Author != null ? p.Author.Name : null,
                    AuthorSurname = p.Author != null ? p.Author.Surname : null,
                    AuthorPhoto = p.Author != null ? p.Author.Image : null
                })
                .ToList();

            return Ok(posts);
        }
    }
}