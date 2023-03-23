import { IMessage } from "./../modules/modules";
import { create } from "zustand";
import { State } from "../modules/modules";

export const TOKEN_KEY = "TOKEN_KEY";
export const USERNAME_KEY = "USERNAME_KEY";
export const USERIMAGE_KEY = "USERIMAGE_KEY";
export const EXPIRES_KEY = "EXPIRES_KEY";
export const USERROLE_KEY = "USERROLE_KEY";

export const useLoginStore = create<State>((set) => ({
    Token: "",
    UserName: "",
    Role: "",
    ImageName: "",

    setUser: (user) => {
        const tokenExpires = new Date(
            new Date().getTime() + 24 * 60 * 60 * 1000
        );

        localStorage.setItem(TOKEN_KEY, user.Token!);
        localStorage.setItem(USERNAME_KEY, user.UserName);
        localStorage.setItem(USERROLE_KEY, user.Role);
        localStorage.setItem(USERIMAGE_KEY, user.ImageName);
        localStorage.setItem(EXPIRES_KEY, tokenExpires.toString());
        set(() => ({
            Token: user.Token,
            UserName: user.UserName,
            Role: user.Role,
            ImageName: user.ImageName,
        }));
    },

    setFromStorage: () => {
        const expiresIn = localStorage.getItem(EXPIRES_KEY) ?? null;

        if (expiresIn && new Date() > new Date(expiresIn)) {
            set(() => ({
                Token: "",
                UserName: "",
                Role: "",
                ImageName: "",
            }));
        } else {
            set(() => ({
                Token: localStorage.getItem(TOKEN_KEY) ?? "",
                UserName: localStorage.getItem(USERNAME_KEY) ?? "",
                Role: localStorage.getItem(USERROLE_KEY) ?? "",
                ImageName: localStorage.getItem(USERIMAGE_KEY) ?? "",
            }));
        }
    },

    logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USERNAME_KEY);
        localStorage.removeItem(USERROLE_KEY);
        localStorage.removeItem(USERIMAGE_KEY);
        localStorage.removeItem(EXPIRES_KEY);
        set(() => ({
            Token: "",
            UserName: "",
            Role: "",
            ImageName: "",
        }));
    },
}));

export const useMessageStore = create<IMessage>((set) => ({
    message: "",
    setMessage: (m) =>
        set(() => ({
            message: m,
        })),
}));
