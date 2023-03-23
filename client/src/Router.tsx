import { createBrowserRouter } from "react-router-dom";
import Login from "./components/Login";
import CreatePost from "./components/CreatePost";
import Layout from "./components/Layout";
import Post from "./components/Post";
import Posts from "./components/Posts";
import Registration from "./components/Registration";
import MyPosts from "./components/MyPosts";



export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "",
                element: <Posts />,
            },
            {
                path: "my-posts",
                element: <MyPosts />,
            },
            {
                path: ":postId",
                element: <Post />,
            },
            {
                path: "createPost",
                element: <CreatePost />,
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "registration",
                element: <Registration />,
            },
        ],
    },
]);
