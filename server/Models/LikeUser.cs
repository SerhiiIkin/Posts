using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Models
{
    public class LikeUser
    {
        public int Id { get; set; }
        public int PostId { get; set; }

        public string Option { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
    }
}