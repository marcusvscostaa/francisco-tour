import logo from './logo.svg';
import './App.css';
import './components/Sidebar';
import './sb-admin-2.css';
import './calenda.css'
import LogoutModal from './components/LogoutModal';
import { AppRouter } from "./routes";
import { AuthProvider } from "./context/AuthContext";

//const user = AuthService.getCurrentUser().then(response => console.log(response)).then(data => {return data});
function App(){

  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
