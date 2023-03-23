using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApiContext _context;
        public IConfiguration _configuration;
        public AuthController(ApiContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public static User user = new User();
        public static UserData  userData = new UserData();

        [HttpPost]
        [Route("UploadImage")]
        public  void UploadImage ([FromForm]ImageModel model) {
            string path = Path.Combine(Environment.CurrentDirectory, "Images/Users", model.Name);
                using (Stream stream = new FileStream(path, FileMode.Create)) {
                    model.Image.CopyTo(stream);
                }
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(UserRegistration request) {

            if(request.UserName == null || request.Password == null) {
                return BadRequest("Wrong username or password!");
            }

            var result = _context.Users.FirstOrDefault(u => u.UserName.ToLower() == request.UserName.ToLower());
            if (result != null ) {
                return BadRequest("User is  registered");
            }

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            user.UserName = request.UserName;
            user.PasswordHash = passwordHash;
            user.Role = request.Role;
            user.ImageName = request.ImageName;

            await _context.Users.AddAsync(user);

            await _context.SaveChangesAsync();

            return Ok("Registration successfully!");
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserData>> Login(UserLogin request) {
            var result = await _context.Users.FirstOrDefaultAsync(u => u.UserName == request.UserName);
            if(result == null) {
                return BadRequest("User not found ");
            }

            if(!BCrypt.Net.BCrypt.Verify(request.Password, result.PasswordHash)) {
                return BadRequest("wrong password");
            }

            string token = CreateToken(result);
            userData.Token = token;
            userData.UserName = result.UserName;
            userData.Role = result.Role;
            userData.ImageName = result.ImageName;

            return Ok(userData);
        }

        private string CreateToken(User user) {
            List<Claim> claims = new List<Claim> {
                new Claim(ClaimTypes.Name, user.UserName)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("AppSetting:Token").Value!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }
    }
}