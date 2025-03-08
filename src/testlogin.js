import axios from 'axios';
export async function getCurrentUser() {
    const authorization = localStorage.getItem('user') !== null?JSON.parse(localStorage.getItem('user')).token:'21'
    console.log(authorization);
    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/autenticacao/${authorization}`).catch((err) =>{return false})
    if(await response.data === true){
        return true;
    }else{
        return false;
    }
}