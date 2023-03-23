export interface IPost {
    Id?: number;
    Title: string;
    UserName: string;
    Description: string;
    CreatedAt?: string;
    UpdatedAt?: string;
    LikeUsersNames?: string;
    ImageName: string;
    Likes?: number;
    Views?: number;
    CommentsLength?:number,
    Comments?: IComment[];
}

export interface IComment {
    Id?: number;
    CommentId?: number;
    Description: string;
    PostId?: number;
    CreatedAt?: string;
    UpdatedAt?: string;
    LikeUsersNames?: string;
    UserName: string;
    UserImageName: string;
    Likes?: number;
    Children?: IComment[];
}

export interface IUserLogin {
    UserName: string;
    Password?: string;
}

export interface IUserRegister extends IUserLogin {
    Role: string;
    ImageName: string;
    Token?: string;
}

export interface State extends IUserRegister {
    setUser: (user: IUserRegister) => void;
    logout: () => void;
    setFromStorage: () => void;
}

export interface IMessage {
    message: string;
    setMessage: (m: string) => void;
}

export interface ILike {
    Id?: number;
    PostId: number;
    Option: string;
    UserName: string;
}
