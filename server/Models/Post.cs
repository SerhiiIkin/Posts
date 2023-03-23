using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace server.models
{
    public class Post
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string CreatedAt { get; set; } = string.Empty;
        public string UpdatedAt { get; set; } = string.Empty;
        public int Views { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string LikeUsersNames { get; set; } = string.Empty;
        public string ImageName { get; set; } = string.Empty;
        public int Likes { get; set; }

        public int CommentsLength { get; set; }
        public List<Comment>? Comments { get; set; }

    }
}