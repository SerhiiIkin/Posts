import { useMemo } from "react";
import { Link } from "react-router-dom";
import { environments } from "../environments";
import { useLoginStore } from "../store/store";
import classNames from "classnames";

function Navbar() {
    const { UserName, logout, ImageName } = useLoginStore();

    const username = useMemo(() => {
        if (UserName) {
            return UserName[0].toUpperCase() + UserName.slice(1);
        }
    }, [UserName]);

    return (
        <nav className="container mx-auto flex justify-center items-center gap-4 mb-4 mt-2">
            <Link className="xl:hover:bg-blue-400 p-1 rounded" to={"/"}>
                Home
            </Link>

            {username ? (
                <>
                    <Link
                        className="xl:hover:bg-blue-400 p-1 rounded"
                        to={"/my-posts"}>
                        My Posts
                    </Link>
                    <div className="flex items-center group relative cursor-default">
                        <span>{username}</span>
                        <img
                            className="max-w-[2rem] object-contain aspect-square rounded-full ml-2"
                            src={environments.uploadImgUrlUser + ImageName}
                            alt="avatar"
                        />
                        <div className="hidden group-hover:flex group-focus:flex flex-col top-full  absolute p-1 rounded bg-slate-600 min-w-max z-10">
                            <Link
                                className="xl:hover:bg-blue-400 rounded p-1"
                                to={"/createPost"}>
                                Create post
                            </Link>
                            <button
                                className="xl:hover:bg-blue-400 rounded"
                                onClick={logout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="group relation cursor-pointer">
                    <label htmlFor="title">
                        Auth
                        <div
                            className={classNames(
                                "hidden group-hover:flex group-focus:flex flex-col absolute p-1 rounded bg-slate-600 min-w-max z-10"
                            )}>
                            <Link
                                className="xl:hover:bg-blue-400 rounded p-1"
                                to={"/login"}>
                                Login
                            </Link>
                            <Link
                                className="xl:hover:bg-blue-400 rounded p-1"
                                to={"/registration"}>
                                Registration
                            </Link>
                        </div>
                    </label>
                    <input id="title" type="checkbox" className="hidden" />
                </div>
            )}
        </nav>
    );
}

export default Navbar;
