import axios from "axios";
import { FormEvent, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { environments } from "../environments";
import { IUserLogin, IUserRegister } from "../modules/modules";
import { useLoginStore, useMessageStore } from "../store/store";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function Login() {
    const navigate = useNavigate();
    const loginRef = useRef<HTMLInputElement>(null);
    const passRef = useRef<HTMLInputElement>(null);

    const { setUser } = useLoginStore();
    const { setMessage } = useMessageStore();

    const [showPass, setShowPass] = useState(false);

    async function Login(userData: IUserLogin) {
        try {
            const response = await axios
                .post<IUserRegister>(
                    `${environments.baseUrl}Auth/login`,
                    userData
                )
                .then((res) => res.data);
            setUser(response);

            setMessage("Login successful!");
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

        const userData: IUserLogin = {
            UserName: loginRef.current!.value,
            Password: passRef.current!.value,
        };

        if (
            userData.UserName.trim().length &&
            userData.Password?.trim().length
        ) {
            Login(userData);
        } else {
            setMessage("Fill all the fields");
            setTimeout(() => {
                setMessage("");
            }, 5000);
        }
    }

    return (
        <>
            <form
                onSubmit={submitHandler}
                className="flex flex-col items-center mb-2">
                <input
                    ref={loginRef}
                    className="border p-2 rounded-lg mb-2"
                    type="text"
                    placeholder="Login"
                />
                <label className="relative" htmlFor="pass">
                    <input
                        ref={passRef}
                        className="border p-2 rounded-lg mb-2"
                        type={showPass ? "text" : "password"}
                        placeholder="Password"
                        autoComplete="false"
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

                <button
                    type="submit"
                    className="bg-blue-400 p-1 rounded-lg w-full max-w-[12rem] ">
                    Submit
                </button>
            </form>
            <Link className="block text-center" to="/registration">
                You don't have account yet?
            </Link>
        </>
    );
}

export default Login;
