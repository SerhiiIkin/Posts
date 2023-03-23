import { IComment, IPost } from "../../modules/modules";
import axios from "axios";
import { environments } from "../../environments";

export default function createComment(comment: IComment) {
    return axios
        .post<IComment>(`${environments.baseUrl}Comment/CreateComment`, comment)
        .then((res) => res.data);
}
