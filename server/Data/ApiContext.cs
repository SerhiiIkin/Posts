using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace server.Data
{
    public class ApiContext:DbContext
    {
        public DbSet<Post> Posts { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<ChildComment> ChildrenComments { get; set; }
        public ApiContext (DbContextOptions<ApiContext> options) : base(options) { }

    }
}