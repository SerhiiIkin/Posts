using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Models
{
    public class ChildComment
    {
    public int Id { get; set; }
    public string Description { get; set; } = string.Empty;
    public int CommentId { get; set; }
    public int Likes { get; set; }

    public string CreatedAt { get; set; } = string.Empty;
    public string UpdatedAt { get; set; } = string.Empty;
    public string LikeUsersName { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string UserImageName { get; set; } = string.Empty;
    }
}