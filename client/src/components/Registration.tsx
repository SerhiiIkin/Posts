import axios from "axios";
import { useRef, useState, FormEvent, ChangeEvent } from "react";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { environments } from "../environments";
import useInput from "../hooks/useInput";
import { IUserLogin, IUserRegister } from "../modules/modules";
import { useMessageStore } from "../store/store";

function Registration() {
    const navigate = useNavigate();
    const loginRef = useRef<HTMLInputElement>(null);

    const password = useInput();
    const passwordRepeat = useInput();

    const [img, setImg] = useState("");
    const [imgName, setImgName] = useState<string>("");
    const imgFileRef = useRef<HTMLInputElement>(null);

    const { setMessage } = useMessageStore();

    const [showPass, setShowPass] = useState(false);
    const [showPassRepeat, setShowPassRepeat] = useState(false);

    async function Registration(userData: IUserLogin) {
        const imgData = new FormData();
        if (imgFileRef.current?.files?.length) {
            imgData.append("Name", imgName);
            imgData.append("Image", imgFileRef.current.files[0]);
        }

        try {
            await axios.post(
                `${environments.baseUrl}Auth/UploadImage`,
                imgData
            );
            await axios.post<IUserRegister>(
                `${environments.baseUrl}Auth/register`,
                userData
            );

            setMessage("Registration successful!");
            navigate("/");
            setTimeout(() => {
                setMessage("");
            }, 5000);
        } catch (error: any) {
            setMessage(error.response.data);
            setTimeout(() => {
                setMessage("");
            }, 5000);
        }
    }

    function submitHandler(e: FormEvent) {
        e.preventDefault();

        const userData: IUserRegister = {
            UserName: loginRef.current!.value,
            Password: password.value,
            Role: "user",
            ImageName: imgName,
        };

        if (
            userData.UserName.trim().length &&
            userData.Password?.trim().length &&
            imgName.trim().length &&
            password.value.trim().length === passwordRepeat.value.trim().length
        ) {
            Registration(userData);
        } else {
            setMessage("Fill all the fields");
            setTimeout(() => {
                setMessage("");
            }, 5000);
        }
    }

    function imgInputHandler(e: ChangeEvent<HTMLInputElement>) {
        e.preventDefault();

        if (e.target.files?.length) {
            setImgName(e.target.files[0].name);
            setImg(URL.createObjectURL(e.target.files[0]));
        }
    }

    return (
        <>
            <form
                onSubmit={submitHandler}
                className="flex flex-col items-center mb-2">
                <label
                    htmlFor="inputFile"
                    className="p-2 text-lg text-center border border-dashed border-blue-500 rounded-xl min-w-[12rem] hover:text-red-500 hover:border-red-400">
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

                <input
                    ref={loginRef}
                    className="border p-2 rounded-lg mb-2"
                    type="text"
                    placeholder="Login"
                />
                <label className="relative" htmlFor="pass">
                    <input
                        value={password.value}
                        onChange={password.onChange}
                        className="border p-2 rounded-lg mb-2"
                        type={showPass ? "text" : "password"}
                        placeholder="Password"
                        autoComplete="false"
                        id="pass"
                    />
                    <button
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        type="button"
                        onClick={() => setShowPass((prev) => !prev)}>
                        {showPass ? (
                            <AiOutlineEye />
                        ) : (
                            <AiOutlineEyeInvisible />
                        )}
                    </button>
                </label>
                <label className="relative" htmlFor="passRepeat">
                    <input
                        value={passwordRepeat.value}
                        onChange={passwordRepeat.onChange}
                        className="border p-2 rounded-lg mb-2"
                        type={showPassRepeat ? "text" : "password"}
                        placeholder="Repeat password"
                        autoComplete="false"
                        id="passRepeat"
                    />
                    <button
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        type="button"
                        onClick={() => setShowPassRepeat((prev) => !prev)}>
                        {showPassRepeat ? (
                            <AiOutlineEye />
                        ) : (
                            <AiOutlineEyeInvisible />
                        )}
                    </button>
                </label>

                <button
                    type="submit"
                    className="bg-blue-400 p-1 rounded-lg w-full max-w-[12rem] ">
                    Submit
                </button>
            </form>
            <Link className="block text-center" to="/login">
                Do you have account?
            </Link>
        </>
    );
}

export default Registration;
