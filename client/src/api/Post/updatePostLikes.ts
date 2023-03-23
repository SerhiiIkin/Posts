import axios from "axios";
import { environments } from "../../environments";
import { ILike } from "../../modules/modules";

export default function updatePostLikes(like: ILike) {
    return axios
        .put<string>(`${environments.baseUrl}Post/LikeUpdatePost`, like)
        .then((res) => res.data);
}
