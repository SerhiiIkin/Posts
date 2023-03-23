import axios from "axios";
import { environments } from "../../environments";
import { ILike } from "../../modules/modules";

export default function updateCommentLike(like: ILike) {
    return axios
        .put<string>(`${environments.baseUrl}Comment/UpdateLikesComment`, like)
        .then((res) => res.data);
}
