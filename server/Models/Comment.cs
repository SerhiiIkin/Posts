using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.models
{
    public class Comment
    {
    public int Id { get; set; }
    public string Description { get; set; } = string.Empty;
    public int PostId { get; set; }
    public int Likes { get; set; }
    public string CreatedAt { get; set; } = string.Empty;
    public string UpdatedAt { get; set; } = string.Empty;
    public string LikeUsersNames { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string UserImageName { get; set; } = string.Empty;
    public List<ChildComment> Children { get; set; } = new List<ChildComment>();

    }
}