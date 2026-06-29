public class AddPostDto
{
    public string? Text { get; set; }              // Текст поста
    public string? Photo { get; set; }             // Фото поста (base64 или путь)
    public string? AuthorNickname { get; set; }    // Никнейм автора (для поиска)
}