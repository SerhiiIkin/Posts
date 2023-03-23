import axios from "axios";
import { environments } from "../../environments";
import { IComment } from "../../modules/modules";

export default function getComment(id: number) {
    return axios
        .get<IComment>(
            `${environments.baseUrl}Comment/GetComment?Id${id}`
        )
        .then((res) => res.data);
}
