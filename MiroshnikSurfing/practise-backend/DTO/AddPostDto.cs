using System.ComponentModel.DataAnnotations.Schema; 
public class AddPostDto
{
    public string? Text {get; set;}
    public int? UserId {get; set;}
    [ForeignKey("UserId")]
    public string? Photo{get;set;}
}