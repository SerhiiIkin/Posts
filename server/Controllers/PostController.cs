using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class PostController : ControllerBase
    {
        private readonly ApiContext _context;

        public PostController(ApiContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetTest () {
            

            return Ok("test is ok");
        }

        [HttpGet]
        public async Task<ActionResult<List<Post>>> GetPosts () {
            var posts = await _context.Posts.ToListAsync();
            if(posts.Count < 0 && posts == null) {
                return NotFound("No posts");
            }
            var allComments = await _context.Comments.ToListAsync();
            posts.ForEach(p => {
                var comments =  allComments.FindAll(c => c.PostId == p.Id);
                p.CommentsLength = comments.Count;

            });

            return Ok(posts);
        }

        [HttpGet]
        public async Task<ActionResult<Post>> GetOnePost (int PostId) {
            var post = await _context.Posts.FindAsync(PostId);

            if (post == null) {
                return NotFound("Post was not founded");
            }

            var allComments = await _context.Comments.ToListAsync();
            var comments = allComments.FindAll(c => c.PostId == PostId);
            var dbChildComments = await _context.ChildrenComments.ToListAsync();
            comments.ForEach(c => {
                var children = dbChildComments.FindAll(cC => cC.CommentId == c.Id);
                c.Children = children;
            });

            post.Comments = comments;

            _context.SaveChanges();

            return Ok(post);
        }

        [HttpPost]

        public async Task<IActionResult> CreatePost (Post post) {
            await _context.Posts.AddAsync(post);

            await _context.SaveChangesAsync();

            return Ok(post);
        }

        [HttpPost]
        public ActionResult<ImageModel> UploadImage([FromForm] ImageModel model)
        {
            if (model == null)
            {
                return BadRequest("Add image or name for image");
            }

            string path = Path.Combine(Environment.CurrentDirectory, "Images/Posts", model.Name);
            using (Stream stream = new FileStream(path, FileMode.Create))
            {
                model.Image.CopyTo(stream);
            }

            return Ok("Image Uploaded successfully");
        }

        [HttpPut]
        public async Task<IActionResult> UpdatePost (Post post) {
            var serverPost = await _context.Posts.FirstOrDefaultAsync( p => p.Id == post.Id);

            if (serverPost == null) {
                return NotFound();
            }

            serverPost.Description = post.Description;
            serverPost.Title = post.Title;
            serverPost.ImageName = post.ImageName;
            serverPost.UpdatedAt = post.UpdatedAt;

            await _context.SaveChangesAsync();

            return Ok(serverPost);
        }

        [HttpPut]
        public async Task<IActionResult> LikeUpdatePost (LikeUser like) {
            var post = await _context.Posts.FirstOrDefaultAsync(p => p.Id == like.PostId);

            if (post == null) {
                return NotFound("Post was not found");
            }
            if(like.Option == "+") {
                post.LikeUsersNames = string.Concat(post.LikeUsersNames, like.UserName, ",");
                post.Likes += 1;
                await _context.SaveChangesAsync();
                return Ok("Like was added!");
            } else {
                post.Likes -= 1;
                post.LikeUsersNames = post.LikeUsersNames.Remove(post.LikeUsersNames.IndexOf(like.UserName), like.UserName.Length+1);
                await _context.SaveChangesAsync();
                return Ok("Like was removed");
            }
        }

        [HttpPut]
        public async Task<IActionResult> ViewsUpdatePost (int PostId) {
            var serverPost = await _context.Posts.FindAsync(PostId);

            if (serverPost == null) {
                return NotFound("Post was not found");
            }

            serverPost.Views += 1;

            await _context.SaveChangesAsync();

            return Ok("+1 view");
        }

        [HttpDelete]

        public async Task<ActionResult<Post>> DeletePost(int Id) {
            var post = await _context.Posts.FirstOrDefaultAsync(p => p.Id == Id);

            if(post == null) {
                return NotFound("Comment was not found");
            }

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();

            return Ok("Post was deleted");
        }
    }
}