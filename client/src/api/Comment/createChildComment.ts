import { IComment, IPost } from "../../modules/modules";
import axios from "axios";
import { environments } from "../../environments";

export default function createChildComment(comment: IComment) {
    return axios
        .post<IComment>(
            `${environments.baseUrl}Comment/CreateChildComment`,
            comment
        )
        .then((res) => res.data);
}
