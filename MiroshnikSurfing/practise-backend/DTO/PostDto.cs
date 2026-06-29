public class PostDto
{
    public int Id { get; set; }                    // ID поста
    public string? Text { get; set; }              // Текст поста
    public string? Photo { get; set; }             // Фото поста
    public DateTime PublishDate { get; set; }      // Дата публикации
    
    // Информация об авторе (только нужные поля, не целая модель User!)
    public string? AuthorNickname { get; set; }    // Никнейм автора
    public string? AuthorName { get; set; }        // Имя автора
    public string? AuthorSurname { get; set; }     // Фамилия автора
    public string? AuthorPhoto { get; set; }       // Аватар автора
}