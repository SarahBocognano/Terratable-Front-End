import BackEnd from "../../utils/ApiWrapper";

import '../../styles/adminConnection.scss';

import { BiUser } from  "react-icons/bi";
import { useState } from 'react';

import { useContext, useEffect } from "react";
import DataContext from "../../utils/DataProvider";

import { useNavigate } from "react-router-dom";


function AdminConnection(props){
    const dataProvider = useContext(DataContext);
  
    const [user, setUser] = useState({
        mail : '',
        password : ''
    })

    let loggedValue = {
        'title' : 'Connection',
        'path' : '/admin/login',
        'btnText': 'Se connecter'
    }
    if (dataProvider.isLoggedIn && dataProvider.isLoggedIn.isAdmin === true){
        loggedValue = {
            'title': 'créer un compte',
            'path': 'admin/register',
            'btnText': 'Enregistrer'
        }
    }

    const handelChange = (e) => {
        const newUser = {...user, [e.target.name] : e.target.value }
        setUser(newUser);
    }

    let navigate = useNavigate();

    const connectUser =  async (path, datas) => {
        const response = await BackEnd.post(path, datas);
        const isLoggedIn = {
             'isAdmin' : response.admin.isAdmin,
             'token' : response.token
        }
        dataProvider.setIsloggedIn(isLoggedIn);
        const localJson = JSON.stringify(isLoggedIn);
        localStorage.setItem(dataProvider.localDataKey, localJson);
        navigate("/admin", { replace: true });
    }

    return(
        <div className="AdminConnection">
            <h2>{loggedValue.title}</h2>
            <div className="form">
                <div className='field'>
                    <input type="mail" name="mail" placeholder="e-mail" onChange={handelChange} value={user.mail}/>
                </div>
                <div className='field'>
                    <input type="password" name="password" placeholder="Mot de passe" onChange={handelChange} value={user.password}/>
                </div>
                <div className="btn" onClick={() => connectUser(loggedValue.path, user)}><span><BiUser /></span>{loggedValue.btnText}</div>
            </div>
        </div>
    )
}

export default AdminConnection;