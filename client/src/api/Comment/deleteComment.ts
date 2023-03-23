import { IComment, IPost } from "../../modules/modules";
import axios from "axios";
import { environments } from "../../environments";

export default function deleteComment(id: number) {

    return axios
        .delete<string>(`${environments.baseUrl}Comment/DeleteComment?Id=${id}`)
        .then((res) => res.data);
}
