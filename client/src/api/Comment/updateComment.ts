import { IComment, ILike, IPost } from "../../modules/modules";
import axios from "axios";
import { environments } from "../../environments";

export default function updateComment(comment: IComment) {
    return axios
        .put<IComment>(`${environments.baseUrl}Comment/UpdateComment`, comment)
        .then((res) => res.data);
}
