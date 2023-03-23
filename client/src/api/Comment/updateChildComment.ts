import axios from "axios";
import { environments } from "../../environments";
import { IComment } from "../../modules/modules";

export default function updateChildComment(comment: IComment) {
    return axios
    .put<IComment>(`${environments.baseUrl}Comment/UpdateChildComment`, comment)
    .then((res) => res.data);
}