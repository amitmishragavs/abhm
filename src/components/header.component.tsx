import { NavLink } from 'react-router-dom';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import authService from '../services/auth.service';
import { useEffect, useState } from 'react';


const HeaderComponent = ({ currentUser }: any) => {
    const [user, setUser] = useState<any>({})

    useEffect(() => {
        let user = localStorage.getItem("user");
        if(user){

          setUser(JSON.parse(user));
        }
    }, [])
    
 
    const logOut=()=> {
        authService.logout();
    }
    return (<div style={{background:"#fff",borderBottomLeftRadius:"1.2rem",boxShadow:"0px 4px 20px #00000021"}}>
        <NavLink to={"/"} className="navbar-brand">
            GAVS
        </NavLink>
        <nav className="navbar-top">
            <div>Welcome {user.username}</div>
            <Avatar size={30} icon={<UserOutlined />} />
        </nav>
       
        <nav className="navbar navbar-expand navbar-dark bg-lite">
            <div className="navbar-nav ml-auto">
                <li className="nav-item">
                    <NavLink to={"/profile"} className="nav-link" activeClassName="active-nav">
                        {currentUser.username}
                    </NavLink>
                </li>
                <li className="nav-item">
                    <a href="/login" className="nav-link" onClick={logOut}>
                        LogOut
                    </a>
                </li>
            </div>
        </nav>
        
    </div>
    )
}

export default HeaderComponent;