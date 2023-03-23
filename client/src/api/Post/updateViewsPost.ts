import axios from "axios";
import { environments } from "../../environments";

export default function updateViewsPost(id: number) {
    return axios
        .put<string>(`${environments.baseUrl}Post/ViewsUpdatePost?PostId=${id}`)
        .then((res) => res.data);
}
