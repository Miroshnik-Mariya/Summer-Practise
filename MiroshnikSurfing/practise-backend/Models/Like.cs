// Models/Like.cs
using System.ComponentModel.DataAnnotations.Schema; 
public class Like
{
    public int Id { get; set; }
    public int PostId { get; set; }
    public int UserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    [ForeignKey("PostId")]
    public virtual Post? Post { get; set; }
    
    [ForeignKey("UserId")]
    public virtual User? User { get; set; }
}