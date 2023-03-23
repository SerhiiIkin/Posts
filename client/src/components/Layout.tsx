import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useLoginStore } from "../store/store";
import Message from "./Message";
import Navbar from "./Navbar";

function Layout() {
    const { setFromStorage } = useLoginStore();

    useEffect(() => {
        setFromStorage();
    }, []);

    return (
        <>
            <Navbar />
            <main className="container mx-auto">
                <Outlet />
                <Message />
            </main>
        </>
    );
}

export default Layout;
