import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useRef, KeyboardEvent, ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import createPost from "../api/Post/createPost";
import uploadImg from "../api/Post/uploadImg";
import { useLoginStore, useMessageStore } from "../store/store";
import createDate from "../useful/createDate";

function CreatePost() {
    const titleRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const { setMessage } = useMessageStore();
    const { UserName } = useLoginStore();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const imgFileRef = useRef<HTMLInputElement>(null);
    const [img, setImg] = useState<any>();
    const [imgName, setImgName] = useState<string>("");

    const uploadImgMutation = useMutation({
        mutationFn: uploadImg,
    });

    const createPostMutation = useMutation({
        mutationFn: createPost,
        onSuccess: () => {
            queryClient.invalidateQueries(["posts"]);
        },
    });

    function submitHandle(e: FormEvent) {
        e.preventDefault();

        sendPost();
    }

    function imgInputHandler(e: ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        if (e.target.files?.length) {
            setImgName(e.target.files[0].name);
            setImg(URL.createObjectURL(e.target.files[0]));
        }
    }

    function sendPost() {
        if (
            titleRef.current?.value &&
            descriptionRef.current?.value &&
            imgName.trim()?.length &&
            imgFileRef?.current?.files?.length
        ) {
            const imgData = new FormData();
            if (imgFileRef.current?.files?.length) {
                imgData.append("Name", imgName);
                imgData.append("Image", imgFileRef.current.files[0]);
            }

            uploadImgMutation.mutate(imgData);

            createPostMutation.mutate({
                Title: titleRef.current!.value,
                Description: descriptionRef.current!.value,
                ImageName: imgName,
                CreatedAt: createDate(),
                UpdatedAt: createDate(),
                UserName,
            });
            setMessage("Post created");
            navigate("/");
            setTimeout(() => {
                setMessage("");
            }, 5000);

            titleRef.current!.value = "";
            descriptionRef.current!.value = "";
        } else {
            setMessage("Fill all fields");
        }
    }

    function onCtrlEnterPress(event: KeyboardEvent<HTMLFormElement>) {
        if (event.code === "Enter" && event.ctrlKey) {
            sendPost();
        }
    }

    return (
        <div className="container max-w-xs mx-auto">
            <form
                onSubmit={submitHandle}
                onKeyUp={onCtrlEnterPress}
                className="container flex flex-col gap-4 min-w-[12rem]">
                <h1 className="text-center text-2xl">Create Post</h1>
                <label
                    htmlFor="inputFile"
                    className="p-2 text-lg text-center border border-dashed border-blue-500 rounded-xl hover:text-red-500 hover:border-red-400">
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
                        className="aspect-auto rounded-xl mb-2"
                        src={img}
                        alt="No img yet"
                    />
                </figure>

                <input
                    className="border p-2 rounded-lg"
                    placeholder="Title"
                    ref={titleRef}
                    type="text"
                />

                <textarea
                    rows={4}
                    placeholder="Description"
                    className="resize-none border mb-2 rounded-lg p-2 block"
                    ref={descriptionRef}></textarea>
                <button className="bg-gray-400 text-blue-800 p-2 rounded-lg">
                    Send
                </button>
            </form>
        </div>
    );
}

export default CreatePost;
