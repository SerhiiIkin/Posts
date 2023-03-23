using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class CommentController : ControllerBase
    {
        private readonly ApiContext _context;

        public LikeUser likeUser = new LikeUser();

        public CommentController(ApiContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Comment>>> GetAllComments () {
            var allComments = await _context.Comments.ToListAsync();

            return Ok(allComments);
        }

        [HttpGet]
        public async Task<ActionResult<Comment>> GetComment (int Id) {
            var dbComment = await _context.Comments.FirstOrDefaultAsync(c => c.Id == Id);
            var dbChildComments = await _context.ChildrenComments.ToListAsync();
            var children = dbChildComments.FindAll(c => c.CommentId == Id);

            if(dbComment == null || children == null ) {
                return NotFound("Cant find comment!");
            }

            dbComment.Children = children;
            return Ok(dbComment);
        }


        [HttpPost]
        public async Task<ActionResult<Comment>> CreateComment (Comment comment) {

            _context.Comments.Add(comment);

            await _context.SaveChangesAsync();

            return Ok(comment);
        }

        [HttpPost]
        public async Task<ActionResult<ChildComment>> CreateChildComment (ChildComment comment) {
            _context.ChildrenComments.Add(comment);
            await _context.SaveChangesAsync();

            return Ok(comment);
        }

        [HttpDelete]

        public async Task<ActionResult<Comment>> DeleteComment (int  Id) {
            var comment = await _context.Comments.FirstOrDefaultAsync(c => c.Id == Id);
            if(comment == null) {
                return NotFound("Comment was not found");
            }

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return Ok("Comment was deleted");
        }

        [HttpDelete]

        public async Task<ActionResult<ChildComment>> DeleteChildComment (int  Id) {
            var comment = await _context.ChildrenComments.FirstOrDefaultAsync(c => c.Id == Id);
            if(comment == null) {
                return NotFound("Comment was not found");
            }

            _context.ChildrenComments.Remove(comment);
            await _context.SaveChangesAsync();

            return Ok("Comment was deleted");
        }

        [HttpPut]

        public async Task<ActionResult<Comment>> UpdateComment (Comment comment) {
            var resultComment = await _context.Comments.FirstOrDefaultAsync(c => c.Id == comment.Id);
            if(resultComment == null) {
                return NotFound("This comment was not found");
            }
            resultComment.Description = comment.Description;
            resultComment.UpdatedAt = comment.UpdatedAt;

            await _context.SaveChangesAsync();

            return Ok(resultComment);
        }

        [HttpPut]

        public async Task<ActionResult<ChildComment>> UpdateChildComment (ChildComment comment) {
            var resultComment = await _context.ChildrenComments.FirstOrDefaultAsync(c => c.Id == comment.Id);
            if(resultComment == null) {
                return NotFound("This comment was not found");
            }
            resultComment.Description = comment.Description;

            await _context.SaveChangesAsync();

            return Ok(resultComment);
        }

        [HttpPut]
        public async Task<ActionResult<Comment>> UpdateLikesComment (LikeUser like) {
            var comment = await _context.Comments.FirstOrDefaultAsync(c => c.Id == like.PostId);
            if(comment == null) {
                return NotFound("This comment was not found");
            }

            if(like.Option == "+") {
                comment.LikeUsersNames = string.Concat(comment.LikeUsersNames, like.UserName , ",");
                comment.Likes += 1;
                await _context.SaveChangesAsync();
                return Ok("Like was added!");
            } else {
                comment.Likes -= 1;
                comment.LikeUsersNames = comment.LikeUsersNames.Remove(comment.LikeUsersNames.IndexOf(like.UserName), like.UserName.Length+1);
                await _context.SaveChangesAsync();
                return Ok("Like was removed");
            }
        }
        [HttpPut]
        public async Task<ActionResult<ChildComment>> UpdateChildLikesComment (LikeUser like) {
            var comment = await _context.ChildrenComments.FirstOrDefaultAsync(c => c.Id == like.PostId);
            if(comment == null) {
                return NotFound("This comment was not found");
            }

            if(like.Option == "+") {
                comment.LikeUsersName = string.Concat(comment.LikeUsersName, like.UserName , ",");
                comment.Likes += 1;
                await _context.SaveChangesAsync();
                return Ok("Like was added!");
            } else {
                comment.Likes -= 1;
                comment.LikeUsersName = comment.LikeUsersName.Remove(comment.LikeUsersName.IndexOf(like.UserName), like.UserName.Length+1);
                await _context.SaveChangesAsync();
                return Ok("Like was removed");
            }
        }

    }
}
