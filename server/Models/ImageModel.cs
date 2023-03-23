using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Models
{
    public class ImageModel
    {
        public string Name { get; set; } = string.Empty;
        public IFormFile Image { get; set; }
    }
}