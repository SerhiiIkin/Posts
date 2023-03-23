import axios from "axios";
import { environments } from "../../environments";
import { ILike } from "../../modules/modules";

export default function updateChildCommentLike(like: ILike) {
    return axios
        .put<string>(`${environments.baseUrl}Comment/UpdateChildLikesComment`, like)
        .then((res) => res.data);
}