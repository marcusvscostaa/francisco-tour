import logo from './logo.svg';
import './App.css';
import './components/Sidebar';
import './sb-admin-2.css';
import './calenda.css'
import LogoutModal from './components/LogoutModal';
import { AppRouter } from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { useEffect, useState } from 'react';
import {getCurrentUser} from "./FranciscoTourService";
import Login from './pages/Login';


//const user = AuthService.getCurrentUser().then(response => console.log(response)).then(data => {return data});
function App(){
  const [user, setUser] = useState(getCurrentUser());
  
  useEffect(() => {
    getCurrentUser().then(
      data => {
          if(data.fatal || data.code){
            setUser(false);            
          }else{
            setUser(data.auth)
          }    
      }
      ).catch((error) => console.log(error));
      console.log( localStorage.getItem('user'));
  },[]) 

  return (
    <>
      
      {/*localStorage.getItem('user')?<AppRouter user={user} />:<Login />*/}
      <AppRouter user={user} />
    </>
  );
}

export default App;
