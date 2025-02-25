import axios from 'axios';

const API_URL = 'http://your-backend-api-url';

class AuthService {
  login(username, password) {
    return axios.post('http://192.168.0.105:8800' + '/login', { username, password })
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem('user', JSON.stringify(response.data));
          localStorage.setItem("myapp-username", JSON.stringify(username));
          localStorage.setItem("myapp-password", JSON.stringify(password));
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new AuthService();