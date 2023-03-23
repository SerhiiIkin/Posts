using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Models
{
    public class UserRegistration: UserLogin
    {
        public string Role { get; set; } = string.Empty;

        public string ImageName { get; set; } = string.Empty;
    }
}