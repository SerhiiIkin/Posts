import { IPost } from "../../modules/modules";
import axios from "axios";
import { environments } from "../../environments";

export default function getPosts() {
    return axios
        .get<IPost[]>(`${environments.baseUrl}Post/GetPosts`)
        .then((res) =>res.data)
        
}
