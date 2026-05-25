using KaryaSiddhi.Models;
using Microsoft.EntityFrameworkCore;

namespace KaryaSiddhi.Data
{
    public class TaskContext : DbContext
    {
        public TaskContext(DbContextOptions<TaskContext> options) : base(options) { }

        public DbSet<Models.Tasks> TasksItem { get; set; }
    }
}
