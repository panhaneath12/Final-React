import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import LibrarianPage from './LibrarianPage';
import TeacherPage from './TeacherPage';
import {RouterProvider, createBrowserRouter} from 'react-router-dom'
import Profile from './Profile';
import EditPage from './EditPage';
import ViewDetail from './ViewDetail';
import GroupPage from './GroupPage';
import ViewGroup from './ViewGroup';
const router = createBrowserRouter([
  {path: '/', element: <LoginPage></LoginPage> },
  //librarain
  {path: '/librarianPage', element: <LibrarianPage></LibrarianPage>},
  {path: '/librarianPage/profile', element: <Profile></Profile>},
  {path: '/librarianPage/register', element: <RegisterPage></RegisterPage>},
  {path: '/librarianPage/edit', element: <EditPage></EditPage>},  
  {path: '/librarianPage/viewDetail', element: <ViewDetail></ViewDetail>},
  {path: '/librarianPage/group', element: <GroupPage></GroupPage>},

  //teacher
  {path: '/teacherPage', element: <TeacherPage></TeacherPage>}, 
  {path: '/teacherPage/profile', element: <Profile></Profile>}, 
  {path: '/teacherPage/viewGroup', element: <ViewGroup></ViewGroup>}, 
  {path: 'user/:{userId}', element: <h1>userId</h1>},

])
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/*  */}
    {/* Role: {userProfileData.role} */}
      <ul className="nav nav-tabs" id="myTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active"
            id="home-tab"
            data-bs-toggle="tab"
            data-bs-target="#home-tab-pane"
            type="button"
            role="tab"
            aria-controls="home-tab-pane"
            aria-selected="true"
          >
            Home
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="profile-tab"
            data-bs-toggle="tab"
            data-bs-target="#profile-tab-pane"
            type="button"
            role="tab"
            aria-controls="profile-tab-pane"
            aria-selected="false"
            onClick={() =>
              navigate("/librarianPage/profile", { state: { userData: userProfileData } })
            }
          >
            Profile
          </button>
        </li>

        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="disabled-tab"
            data-bs-toggle="tab"
            data-bs-target="#disabled-tab-pane"
            type="button"
            role="tab"
            aria-controls="disabled-tab-pane"
            // onClick={() =>
            //   navigate("/librarianPage/register", { state: { userData: userProfileData } })
            // }
          >
            Register teacher
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="disabled-tab"
            data-bs-toggle="tab"
            data-bs-target="#disabled-tab-pane"
            type="button"
            role="tab"
            aria-controls="disabled-tab-pane"
            // onClick={() =>
            //   navigate("/librarianPage/group", {
            //     state: { userData: userProfileData, totalBooks: totalBooks },
            //   })
            // }
          >
            Student Group
          </button>
        </li>
        <button
          className="btn btn-danger"
          id="home-tab"
          data-bs-toggle="tab"
          data-bs-target="#home-tab-pane"
          type="button"
          role="tab"
          aria-controls="home-tab-pane"
          aria-selected="true"
          // onClick={signOut}
        >
          Sign out
        </button>
      </ul>
      {/*  */}
    <RouterProvider router = {router}></RouterProvider>
   
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
