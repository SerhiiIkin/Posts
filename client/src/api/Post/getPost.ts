import { IPost } from '../../modules/modules';
import axios from "axios";
import { environments } from '../../environments';

export default  function getPost(id:number) {
    return axios
        .get<IPost>(`${environments.baseUrl}Post/GetOnePost?PostId=${id}`)
        .then((res) => res.data);
}