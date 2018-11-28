using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ManageCar.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore.Design;
using System.IO;

namespace ManageCar.Data
{

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Car> cars {get;set;}

        protected override void OnModelCreating(ModelBuilder builder)
        {  
            builder.Entity<Car>()
            .ToTable("Car");
        
            builder.Entity<Car>()
            .Property(b => b.Id )
            .ValueGeneratedOnAdd();
            
            builder.Entity<Car>()
            .HasKey(b => b.Id );

            base.OnModelCreating(builder);
            // Customize the ASP.NET Identity model and override the defaults if needed.
            // For example, you can rename the ASP.NET Identity table names and more.
            // Add your customizations after calling base.OnModelCreating(builder);
        }
    }

    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();
            var builder = new DbContextOptionsBuilder<ApplicationDbContext>();
            string env = System.Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            string connectionString;
            if (!string.IsNullOrEmpty(env) && env.Equals("Linux"))
            {
                connectionString = configuration.GetConnectionString("mySqlConnection");
                builder.UseMySql(connectionString);
            } else
            {
                connectionString = configuration.GetConnectionString("DefaultConnection");
                builder.UseSqlServer(connectionString);
            }
            return new ApplicationDbContext(builder.Options);
        }
    }
}
