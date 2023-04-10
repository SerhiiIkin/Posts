import { IComment, ILike } from "../modules/modules";
import { BsTrash } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import { MdDone } from "react-icons/md";
import deleteComment from "../api/Comment/deleteComment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useState, MouseEvent } from "react";
import updateComment from "../api/Comment/updateComment";
import { useLoginStore, useMessageStore } from "../store/store";
import { environments } from "../environments";
import useTextarea from "../hooks/useTextarea";
import Like from "../Svg/Like";
import classNames from "classnames";
import updateCommentLike from "../api/Comment/updateCommentLike";
import CommentForm from "./CommentForm";
import deleteChildComment from "../api/Comment/deleteChildComment";
import updateChildComment from "../api/Comment/updateChildComment";
import updateChildCommentLike from "../api/Comment/updateChildCommentLike";
import createDate from "../useful/createDate";

function Comment({
    comment,
    isChild = false,
}: {
    comment: IComment;
    isChild?: boolean;
}) {
    const queryClient = useQueryClient();
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isAddAnswerComment, setIsAddAnswerComment] =
        useState<boolean>(false);
    const textarea = useTextarea();

    const [checkbox, setCheckbox] = useState(false);

    const { setMessage } = useMessageStore();
    const { ImageName, UserName, Token } = useLoginStore();

    const deleteMutation = useMutation({
        mutationFn: deleteComment,
        onSuccess: (m) => {
            queryClient.invalidateQueries(["post"]);
            setMessage(m);
            setTimeout(() => {
                setMessage("");
            }, 5000);
        },
    });

    const deleteChildMutation = useMutation({
        mutationFn: deleteChildComment,
        onSuccess: (m) => {
            queryClient.invalidateQueries(["post"]);
            setMessage(m);
            setTimeout(() => {
                setMessage("");
            }, 5000);
        },
    });

    const updateMutation = useMutation({
        mutationFn: updateComment,
        onSuccess: () => {
            queryClient.invalidateQueries(["post", comment.PostId]);
            setMessage("Comment was updated");
            setTimeout(() => {
                setMessage("");
            }, 5000);
        },
    });

    const updateChildMutation = useMutation({
        mutationFn: updateChildComment,
        onSuccess: () => {
            queryClient.invalidateQueries(["post", comment.PostId]);
            setMessage("Comment was updated");
            setTimeout(() => {
                setMessage("");
            }, 5000);
        },
    });

    const updateLikeMutation = useMutation({
        mutationFn: updateCommentLike,
        onSuccess: (a) => {
            queryClient.invalidateQueries(["post", comment.PostId]);
            setMessage(a);

            setTimeout(() => {
                setMessage("");
            }, 5000);
        },
    });

    const updateChildLikeMutation = useMutation({
        mutationFn: updateChildCommentLike,
        onSuccess: (a) => {
            queryClient.invalidateQueries(["post", comment.PostId]);
            setMessage(a);

            setTimeout(() => {
                setMessage("");
            }, 5000);
        },
    });

    function onEditBtnClick() {
        !isEdit && textarea.setMyValue(comment.Description);
        if (isEdit) {
            if (isChild) {
                updateChildMutation.mutate({
                    Id: comment.Id,
                    Description: textarea.value,
                    UserName: UserName,
                    UserImageName: ImageName,
                    UpdatedAt: createDate(),
                });
            } else {
                updateMutation.mutate({
                    Id: comment.Id,
                    PostId: comment.PostId,
                    Description: textarea.value,
                    UserName: UserName,
                    UserImageName: ImageName,
                    UpdatedAt: createDate(),
                });
            }
        }

        setIsEdit((prev) => !prev);
    }

    function inputCheckboxHandler(e: ChangeEvent<HTMLInputElement>) {
        setCheckbox((prev) => !prev);
        const Option = e.target.checked ? "+" : "-";
        if (comment?.Id) {
            const like: ILike = {
                PostId: comment.Id,
                UserName,
                Option,
            };
            if (isChild) {
                updateChildLikeMutation.mutate(like);
            } else {
                updateLikeMutation.mutate(like);
            }
        }
    }

    function OnAnswerBtnClick(e: MouseEvent<HTMLButtonElement>) {
        setIsAddAnswerComment((prev) => !prev);
    }

    function removeComment() {
        isChild
            ? deleteChildMutation.mutate(comment.Id!)
            : deleteMutation.mutate(comment.Id!);
    }

    function closeForm() {
        setIsAddAnswerComment(false);
    }

    useEffect(() => {
        comment.LikeUsersNames?.includes(UserName) && setCheckbox(true);
    }, []);

    return (
        <div className="mb-4 w-full">
            <div className="mb-2 pb-2 mr-2 grid grid-cols-4 grid-row-3 gap-2">
                <img
                    className="block max-w-[2rem] rounded-full justify-self-end row-start-2"
                    src={environments.uploadImgUrlUser + comment.UserImageName}
                    alt="author"
                />
                <h3 className="col-start-2 row-start-1">{comment.UserName}</h3>
                <span className="col-start-3 row-start-1">{comment.UpdatedAt || comment.CreatedAt}</span>
                <div className="col-start-2 row-start-2 col-span-2">
                    {isEdit ? (
                        <textarea
                            rows={3}
                            className="resize-none p-3 rounded-xl mr-2 border w-full"
                            value={textarea.value}
                            onChange={textarea.onChange}
                        />
                    ) : (
                        <div className="bg-gray-600 p-2 rounded-xl break-words text-white">
                            {comment.Description}
                        </div>
                    )}
                </div>
                {Token && (
                    <>
                        <label
                            htmlFor={`like${comment.Id}`}
                            className="row-start-3 justify-self-end flex items-center cursor-pointer">
                            {comment.Likes}
                            <input
                                type="checkbox"
                                onChange={inputCheckboxHandler}
                                id={`like${comment.Id}`}
                                className="hidden"
                                checked={checkbox}
                            />
                            <Like
                                className={classNames(
                                    checkbox
                                        ? "fill-blue-400 stroke-blue-400"
                                        : "fill-white stroke-black",
                                    "ml-1 hover:fill-blue-400"
                                )}
                            />
                        </label>

                        <button
                            type="button"
                            title="Click to open form for writing comments..."
                            className="text-xs col-start-2 row-start-3 hover:bg-blue-400 rounded"
                            onClick={OnAnswerBtnClick}>
                            Answer
                        </button>
                    </>
                )}
                {isAddAnswerComment && Token && (
                    <CommentForm
                        closeForm={closeForm}
                        className="row-start-4 col-start-2"
                        isChildren={true}
                        userCommentName={comment.UserName}
                        commentId={comment?.CommentId ?? comment.Id}
                    />
                )}
                {UserName === comment.UserName && (
                    <div className="-col-end-1 row-start-2 self-center">
                        <button
                            type="button"
                            onClick={onEditBtnClick}
                            className="mr-2">
                            {isEdit ? <MdDone /> : <AiFillEdit />}
                        </button>

                        <button type="button" onClick={removeComment}>
                            <BsTrash />
                        </button>
                    </div>
                )}
            </div>
            {comment?.Children?.map((comment) => {
                return (
                    <div key={comment.Id} className="ml-12 mt-6">
                        <Comment comment={comment} isChild />
                    </div>
                );
            })}
        </div>
    );
}

export default Comment;
