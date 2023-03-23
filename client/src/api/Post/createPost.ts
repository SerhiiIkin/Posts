import axios from "axios";
import { environments } from "../../environments";
import { IPost } from "../../modules/modules";

export default function createPost(post: IPost) {
    return axios
        .post<IPost>(`${environments.baseUrl}Post/CreatePost`, post)
        .then((res) => res.data);
}
