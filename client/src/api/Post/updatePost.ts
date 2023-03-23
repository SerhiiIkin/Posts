import axios from "axios";
import { environments } from "../../environments";
import { IPost } from "../../modules/modules";

export default function updatePost(post: IPost) {
    return axios
        .put(`${environments.baseUrl}Post/UpdatePost`, post)
        .then((res) => res.data);
}
