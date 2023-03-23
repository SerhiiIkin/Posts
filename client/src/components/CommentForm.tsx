import { useQueryClient, useMutation } from "@tanstack/react-query";
import classNames from "classnames";
import { FormEvent, KeyboardEvent, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import createChildComment from "../api/Comment/createChildComment";
import createComment from "../api/Comment/createComment";
import useTextarea from "../hooks/useTextarea";
import { useLoginStore, useMessageStore } from "../store/store";
import createDate from "../useful/createDate";
import Loader from "./Loader";

export default function CommentForm({
    className,
    isChildren = false,
    commentId,
    closeForm,
    userCommentName,
}: {
    className?: string;
    isChildren?: boolean;
    commentId?: number;
    userCommentName?: string;
    closeForm?: () => void;
}) {
    const { postId } = useParams();
    const { setMessage } = useMessageStore();
    const { ImageName, UserName } = useLoginStore();

    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const queryClient = useQueryClient();

    const textArea = useTextarea();

    const commentMutation = useMutation({
        mutationFn: createComment,
        onSuccess: () => {
            queryClient.invalidateQueries(["post"]);
            setMessage("Comment created");
            setTimeout(() => {
                setMessage("");
            }, 5000);
        },
    });

    const commentChildrenMutation = useMutation({
        mutationFn: createChildComment,
        onSuccess: () => {
            queryClient.invalidateQueries(["post"]);
            setMessage("Comment created");
            setTimeout(() => {
                setMessage("");
            }, 5000);
        },
    });

    function submitHandle(event: FormEvent) {
        event.preventDefault();
        if (isChildren) {
            sendChildrenComment();
            closeForm!();
        } else {
            sendComment();
        }
    }

    function sendChildrenComment() {
        if (descriptionRef.current?.value) {
            commentChildrenMutation.mutate({
                Description: descriptionRef.current.value.trim(),
                CommentId: commentId,
                UserName: UserName,
                UserImageName: ImageName,
                CreatedAt: createDate(),
            });
            textArea.setMyValue("");
        } else {
            setMessage("Write comment!");
            setTimeout(() => {
                setMessage("");
            }, 5000);
        }
    }

    function sendComment() {
        if (descriptionRef.current?.value) {
            commentMutation.mutate({
                Description: descriptionRef.current!.value.trim(),
                PostId: parseInt(postId!),
                UserName: UserName,
                UserImageName: ImageName,
                CreatedAt: createDate(),
            });
            textArea.setMyValue("");
        } else {
            setMessage("Write comment!");
            setTimeout(() => {
                setMessage("");
            }, 5000);
        }
    }

    function onCtrlEnterPress(event: KeyboardEvent<HTMLFormElement>) {
        if (event.code === "Enter" && event.ctrlKey) {
            if (isChildren) {
                sendChildrenComment();
                closeForm!();
            } else {
                sendComment();
            }
        }
    }

    useEffect(() => {
        isChildren && textArea.setMyValue(`${userCommentName}, `);
    }, []);

    return (
        <form
            className={classNames("py-2 min-w-[20rem]", className)}
            onKeyUp={onCtrlEnterPress}
            onSubmit={submitHandle}>
            <textarea
                rows={4}
                ref={descriptionRef}
                value={textArea.value}
                placeholder="Ctrl + Enter to add comment..."
                onChange={textArea.onChange}
                className="resize-none border mb-2 rounded-lg p-2 w-full"></textarea>
            <button
                disabled={!textArea.value}
                className="flex justify-center items-center min-w-full min-h-[56px] bg-blue-400 rounded p-1 hover:bg-green-400 hover:text-yellow-300 disabled:bg-red-400 disabled:text-black disabled:cursor-not-allowed">
                {commentMutation.status === "loading" ? (
                    <Loader className="relative -top-10 -left-10 " />
                ) : textArea.value ? (
                    "Add comment"
                ) : (
                    "Write comment first =)"
                )}
            </button>
        </form>
    );
}
