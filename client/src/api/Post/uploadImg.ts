import axios from "axios";
import { environments } from "../../environments";

export default function uploadImg(imageData:FormData) {
    return axios.post<string>(`${environments.baseUrl}Post/UploadImage`, imageData).then((res) => res.data);
}