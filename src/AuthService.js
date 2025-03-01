import axios from 'axios';

const API_URL = 'http://your-backend-api-url';

class AuthService {
  login(username, password) {
    return axios.post(`${process.env.REACT_APP_BASE_URL}/login`, { username, password })
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem('user', JSON.stringify(response.data));
          localStorage.setItem("myapp-username", JSON.stringify(username));
          localStorage.setItem("myapp-password", JSON.stringify(password));
        }
        return response.data;
      }).catch((erro) => console.log(erro));
  }

  logout() {
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    const authorization = localStorage.getItem('user') !== null?JSON.parse(localStorage.getItem('user')).token:'21'
    console.log(authorization);
    return axios.get(`${process.env.REACT_APP_BASE_URL}/autenticacao/${authorization}`).then(
      (response) => {
        console.log(response.data);
        return response.data;
      }
    ).catch((erro) => console.log(erro))
/*     const data = response.data
    console.log(data);
    if(data === true){
      return true;
    }else{
      return false;
    } */

  }
}

export default new AuthService();