import  axios  from 'axios';
import { environments } from '../../environments';
import { IPost } from '../../modules/modules';

export default function deletePost(id: number) {
    return axios
    .delete<string>(`${environments.baseUrl}Post/DeletePost?Id=${id}`)
    .then((res) => res.data);
}