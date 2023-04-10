import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import classNames from "classnames";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";
import { MdDone } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import deletePost from "../api/Post/deletePost";
import getPost from "../api/Post/getPost";
import updatePost from "../api/Post/updatePost";
import updatePostLikes from "../api/Post/updatePostLikes";
import uploadImg from "../api/Post/uploadImg";
import { environments } from "../environments";
import useInput from "../hooks/useInput";
import useTextarea from "../hooks/useTextarea";
import { ILike } from "../modules/modules";
import { useLoginStore, useMessageStore } from "../store/store";
import Like from "../Svg/Like";
import createDate from "../useful/createDate";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import Loader from "./Loader";

function Post() {
    const params = useParams();
    const { Token, UserName } = useLoginStore();
    const queryClient = useQueryClient();
    const { setMessage } = useMessageStore();
    const navigate = useNavigate();

    const [isEdit, setIsEdit] = useState<boolean>(false);

    const [imgName, setImgName] = useState("");
    const [img, setImg] = useState<any>(null);
    const imgFileRef = useRef<HTMLInputElement>(null);

    const titleInput = useInput();
    const descriptionTextArea = useTextarea();

    const [checkbox, setCheckbox] = useState(false);

    const postId = useMemo(() => {
        if (params?.postId) {
            return parseInt(params.postId);
        }
    }, [params]);

    const { status: statusPost, data: post } = useQuery({
        queryKey: ["post", postId],
        queryFn: () => getPost(postId!),
    });

    const deleteMutation = useMutation({
        mutationFn: deletePost,
        onSuccess: () => {
            navigate("/");
            setMessage("Post deleted");

            setTimeout(() => {
                setMessage("");
            }, 5000);
        },
    });

    const updateMutation = useMutation({
        mutationFn: updatePost,
        onSuccess: () => {
            queryClient.invalidateQueries(["post"]);
            setMessage("Post updated");

            setTimeout(() => {
                setMessage("");
            }, 5000);
        },
    });

    const updatePostLikeMutation = useMutation({
        mutationFn: updatePostLikes,
        onSuccess: (a) => {
            queryClient.invalidateQueries(["post"]);
            setMessage(a);

            setTimeout(() => {
                setMessage("");
            }, 5000);
        },
    });

    const uploadImgMutation = useMutation({
        mutationFn: uploadImg,
    });

    function onEditBtnClick() {
        if (isEdit) {
            if (imgFileRef.current?.files?.length) {
                const imgData = new FormData();
                imgData.append("Name", imgName);
                imgData.append("Image", imgFileRef.current.files[0]);
                uploadImgMutation.mutate(imgData);
            }

            updateMutation.mutate({
                Id: post?.Id!,
                Title: titleInput.value,
                Description: descriptionTextArea.value,
                ImageName: imgName || post?.ImageName!,
                UpdatedAt: createDate(),
                UserName,
            });
        } else {
            titleInput.onMyChange(post?.Title!);
            descriptionTextArea.setMyValue(post?.Description!);
        }
        setIsEdit((prev) => !prev);
    }

    function imgInputHandler(e: ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        if (e.target.files?.length) {
            setImgName(e.target.files[0].name);
            setImg(URL.createObjectURL(e.target.files[0]));
        }
    }

    function inputCheckboxHandler(e: ChangeEvent<HTMLInputElement>) {
        setCheckbox((prev) => !prev);
        const Option = e.target.checked ? "+" : "-";
        if (postId) {
            const like: ILike = {
                Option,
                UserName,
                PostId: postId,
            };

            updatePostLikeMutation.mutate(like);
        }
    }

    useEffect(() => {
        post?.LikeUsersNames?.includes(UserName) && setCheckbox(true);
    }, []);

    if (statusPost == "loading") return <Loader />;
    if (statusPost === "error") return <h2>Error! Post not founded!</h2>;

    return (
        <div className="flex flex-col gap-4 items-center relative px-2 xl:min-w-[20rem]">
            {isEdit ? (
                <input
                    type="text"
                    value={titleInput.value}
                    onChange={titleInput.onChange}
                    className="p-1 border rounded-xl"
                />
            ) : (
                <h1 className="text-3xl"> {post.Title} </h1>
            )}
            <div className="self-start flex flex-col">
                <span>
                    Created by: <strong> {post.UserName}</strong>
                </span>
                {post?.UpdatedAt || post?.CreatedAt}
            </div>

            {isEdit && (
                <>
                    <label
                        htmlFor="inputFile"
                        className="p-2 text-lg text-center border border-dashed border-blue-500 rounded-xl xl:min-w-[12rem] hover:text-red-500 hover:border-red-400">
                        +
                    </label>
                    <input
                        className="hidden"
                        type="file"
                        id="inputFile"
                        onChange={imgInputHandler}
                        ref={imgFileRef}
                    />

                    <figure>
                        <figcaption>Image preview:</figcaption>
                        <img
                            className="max-w-[12rem] aspect-auto rounded-xl mb-2"
                            src={img}
                            alt="choose img"
                        />
                    </figure>
                </>
            )}
            <img
                className="mx-auto aspect-video xl:min-w-[42rem] xl:max-w-2xl"
                src={environments.uploadImgUrlPost + post.ImageName}
                alt="post img"
            />
            {isEdit ? (
                <textarea
                    rows={4}
                    value={descriptionTextArea.value}
                    onChange={descriptionTextArea.onChange}
                    placeholder="Ctrl + Enter to add description"
                    className="p-3 border rounded-xl w-full resize-none"
                />
            ) : (
                <p> {post.Description} </p>
            )}
            <span className="self-start flex gap-2">
                {post.Likes}
                <label
                    htmlFor={`like${postId}`}
                    title={UserName ? "Click for like!" : "Log in for like!"}
                    className={classNames(
                        "row-start-3 justify-self-end flex items-center cursor-pointer",
                        !UserName && "cursor-not-allowed"
                    )}>
                    <input
                        disabled={!UserName}
                        type="checkbox"
                        onChange={inputCheckboxHandler}
                        id={`like${postId}`}
                        className="hidden"
                        checked={checkbox}
                    />
                    <Like
                        className={classNames(
                            checkbox
                                ? "fill-blue-400 stroke-blue-400"
                                : "fill-white stroke-black",
                            UserName ? "ml-1 hover:fill-black" : "ml-1"
                        )}
                    />
                </label>
            </span>

            {Token ? (
                <CommentForm />
            ) : (
                <Link className="text-blue-400" to="/login">
                    Log in for writhing comments!
                </Link>
            )}
            {post.Comments?.map((comment) => (
                <Comment key={comment.Id} comment={comment} />
            )).reverse()}

            {UserName === post.UserName && (
                <div className="absolute right-[10%] top-3">
                    <button
                        type="button"
                        onClick={onEditBtnClick}
                        className="mr-2">
                        {isEdit ? <MdDone /> : <AiFillEdit />}
                    </button>

                    <button
                        type="button"
                        onClick={() => deleteMutation.mutate(post.Id!)}>
                        <BsTrash />
                    </button>
                </div>
            )}
        </div>
    );
}

export default Post;
