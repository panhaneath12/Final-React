import React, { useEffect, useState } from "react";
import {  useNavigate, useLocation } from "react-router-dom";
import Cookies from 'js-cookie';
export default function LoginPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({username: '', password: ''});
  const [validation, setValidation] = useState({username: '', password: ''})
  const [userStatus, setUserStatus] = useState(null);
  useEffect(()=>{
     if(typeof(Cookies.get('roleToken')) !== 'undefined')
     isUserTokenExpired(Cookies.get('roleToken'));
  }, []);
  const isUserTokenExpired=(tokenValue)=>{
    fetch(`https://localhost:7287/api/Users/token`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({value: tokenValue})
     
    })
      .then((res) => res.json())
      .then((data) => {
        if(data.role !== 'Teacher'){
          navigate('/librarianPage', {state: {userData: data}}); 
         
        }       
        else if(data.role !== 'Librarian') navigate('/teacherPage', {state: {userData: data}});        
        console.log(data);
      });
      
  }
  const login = (e) => {
    e.preventDefault();
    console.log(user.username)
    console.log(user.password)
    fetch(`https://localhost:7287/api/Users/${user.username}/${user.password}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if(data.role === 'Librarian'){
          console.log('true');
         // getUsers(data.token)
         Cookies.set('roleToken', data.token);
         navigate('/librarianPage', {state: {userData: data}}); 
        }else if(data.role === 'Teacher'){
          Cookies.set('roleToken', data.token);
          navigate('/teacherPage', {state: {userData: data}}); 
        }else if(data.title === 'Not Found'){
          console.log('no found');
          setUserStatus('check your input again');
        }
        console.log(data.token);
      });
  };
  
  const handleUsernameInput=(e)=>{
      if(e.target.name === 'username' && e.target.value.length > 15) setValidation({...validation, [e.target.name]: 'Username must contain 15 digits'});
      else setValidation({...validation, [e.target.name]: ''});
      setUser({...user, [e.target.name]: e.target.value}) 
      setUserStatus('');
  }
  const handlePasswordInput=(e)=>{
    if(e.target.name === 'password' && e.target.value.length < 6) setValidation({...validation, [e.target.name]: 'Password must contain 6 digits'});
    else setValidation({...validation, [e.target.name]: ''});
    setUser({...user, [e.target.name]: e.target.value}) 
    setUserStatus('');
    
}
  return (
    <div className="d-flex flex-column  vh-100" >
      <div className="bg-dark text-white text-center mb-5 "> <h1>Login for Teacher or Librarian</h1></div>
       
      <div className="container">
        <div className="row d-flex align-items-center justify-content-center h-100">
          <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
            <form
              className="d-flex flex-column justify-content-center"
              onSubmit={login}
            >
              <div className="form-outline mb-4 ">
                <label className="form-label" htmlFor="username">
                  Username
                </label>
                <input
                  value={user.username}
                  name="username"
                  type="text"
                  id="username"
                  className="form-control form-control-lg"
                  onChange={handleUsernameInput}
                 
                />
              </div>
             {validation.username !== '' && <span className="text-danger">{validation.username}</span>}
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="password">
                  Password
                </label>
                <input
                 value={user.password}
                  name="password"
                  type="password"
                  id="password"
                  className="form-control form-control-lg"
                  onChange={handlePasswordInput}
                  autoComplete="current-complete"
                />
              </div>
             {validation.password !== '' && <span className="text-danger">{validation.password}</span>}
             {userStatus !== '' && <span className = "text-danger">{userStatus}</span>}
              <div className="text-danger"></div>
              <div className="d-flex justify-content-around align-items-center mb-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="form1Example3"
                  />
                  <label className="form-check-label" htmlFor="form1Example3">
                    {" "}
                    Remember me{" "}
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block"
              >
                Login
              </button>
              
            </form>
            
          </div>
        </div>
      </div>
    </div>
  );
}
