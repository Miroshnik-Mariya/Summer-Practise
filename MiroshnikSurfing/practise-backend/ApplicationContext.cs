using Microsoft.EntityFrameworkCore;

public class ApplicationContext : DbContext
{
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Post> Posts { get; set; } = null!;
    public ApplicationContext()
    {
        //Database.EnsureDeleted();
        var databaseCreated = Database.EnsureCreated();
        if (databaseCreated)
        {
            User user1 = new User { Nickname = "andrew",  Name = "Андрей", Image = "andrew.png", Email = "andrew@surf.ru", Password = "*" };
            User user2 = new User { Nickname = "maria", Name = "Мария", Image = "maria.jpg", Email = "maria@surf.ru", Password = "*" };
            User user3 = new User { Nickname = "nikita", Name = "Никита", Image = "nikita.png", Email = "nikita@surf.ru", Password = "*" };

            Post post1 = new Post { Text = "Хорошо провели время", Author = user1, PublishDate = new DateTime(2023, 05, 05, 14, 25, 0), Photo = "1.jpg" };
            Post post2 = new Post { Text = "Покатались на досках", Author = user2, PublishDate = new DateTime(2023, 05, 23, 17, 11, 0), Photo = "2.jpg" };
            Post post3 = new Post { Text = "Еще раз поедем", Author = user3, PublishDate = new DateTime(2023, 05, 30, 20, 33, 0), Photo = "3.jpg" };


            Users.AddRange(user1, user2, user3);
            Posts.AddRange(post1, post2, post3);
            SaveChanges();
        }
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=SMS-IT;Username=postgres;Password=1111");
    }
}