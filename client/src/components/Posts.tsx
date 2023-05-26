import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, Outlet } from "react-router-dom";
import getPosts from "../api/Post/getPosts";
import { Suspense, useMemo } from "react";
import Loader from "./Loader";
import { environments } from "../environments";
import { AiOutlineComment, AiOutlineEye, AiOutlineLike } from "react-icons/ai";
import updateViewsPost from "../api/Post/updateViewsPost";

function Posts() {
    const queryClient = useQueryClient();
    const { status, data: posts } = useQuery({
        queryKey: ["posts"],
        queryFn: getPosts,
    });

    const updatePostViewMutation = useMutation({
        mutationFn: updateViewsPost,
        onSuccess: () => {
            queryClient.invalidateQueries(["posts"]);
        },
    });

    function onPostListClick(id: number) {
        updatePostViewMutation.mutate(id);
    }

    const sortedPosts = useMemo(() => {
        return posts?.sort((a, b) => {
            const titleA = a.Title.toLowerCase();
            const titleB = b.Title.toLowerCase();

            if (titleA < titleB) {
                return -1;
            }

            if (titleA > titleB) {
                return 1;
            }

            return 0;
        });
    }, [posts]);

    
    if (status === "error") return <h2 className="text-center text-red-400 text-xl">Error! No posts!</h2>;

    return (
        <div className="flex flex-col gap-4 pb-4">
            {sortedPosts?.length! <= 0 && <h2 className="text-center">No Posts</h2>}
            {status === "loading" && <Loader/>}
            {sortedPosts?.map((post) => (
                <Link
                    onClick={() => onPostListClick(post.Id!)}
                    to={`${post.Id}`}
                    key={post.Id}
                    className="p-1 hover:bg-gray-400 rounded flex flex-col gap-3">
                    <h1 className="text-center text-3xl">{post.Title}</h1>
                    <div>
                        Created by: <strong> {post.UserName}</strong>
                    </div>
                    {post?.UpdatedAt || post?.CreatedAt}
                    <img
                        className="mx-auto aspect-video xl:min-w-[42rem] xl:max-w-2xl"
                        src={environments.uploadImgUrlPost + post.ImageName}
                        alt="post"
                    />
                    <p className="line-clamp-2">{post.Description}</p>
                    <div className="flex gap-2 items-center">
                        {post.Views} <AiOutlineEye className="inline-block" />
                        {post.Likes} <AiOutlineLike className="inline-block" />
                        {post.CommentsLength} <AiOutlineComment />
                    </div>
                    <span></span>
                </Link>
            ))}
            <Suspense fallback={<Loader />}>
                <Outlet />
            </Suspense>
        </div>
    );
}

export default Posts;
