using System.ComponentModel.DataAnnotations.Schema; 
public class PostDto
{
    public string? Text {get; set;}
    public User? Author {get; set;}
    public User? AuthorPhoto {get; set;}
    public string? Photo{get;set;}
    public DateTime PublishDate{get; set;}
}