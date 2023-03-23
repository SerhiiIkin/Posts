import axios  from 'axios';
import { environments } from '../../environments';
export default function deleteChildComment(id:number) {
    return axios
    .delete<string>(`${environments.baseUrl}Comment/DeleteChildComment?Id=${id}`)
    .then((res) => res.data);
}