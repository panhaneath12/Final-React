import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
export default function TeacherPage() {
  const navigate = useNavigate();
  const teacher = useLocation().state.userData;
  const [groups, setGroups] = useState();
  const [books, setBooks] = useState();
  useEffect(() => {
    if (typeof Cookies.get("roleToken") === "undefined") navigate("/");
    getGroups();
    getBooks();
  }, []);
  const signOut = () => {
    Cookies.remove("roleToken");
    navigate("/");
  };
  const getGroups = () => {
    fetch(`https://localhost:7287/api/Groups`, {
      headers: {
        Authorization: `Bearer ${teacher.token}`, // teacher token
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        //these groups belong to only one teacher id
        
        setGroups(
          data
            .filter((group) => group.userId === teacher.id)
            .map((group) => group)
        );
      });
  };
  const getBooks = () => {
    fetch(`https://localhost:7287/api/Books`, {
      headers: {
        Authorization: `Bearer ${teacher.token}`, // teacher token
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
      });
  };
  return (
    <div>
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
            onClick={() => {
              navigate("/teacherPage/profile", {
                state: { userData: teacher },
              });
            }}
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
          ></button>
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
          onClick={signOut}
        >
          Sign out
        </button>
      </ul>
      <ul className="list-group">
        <li className="list-group-item d-flex justify-content-between align-items-center">
          Total numbers of groups
          <span className="badge bg-primary rounded-pill">
            {" "}
            {groups ? (
              groups.filter((group) => {
                return groups;
              }).length
            ) : (
              <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
          </span>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
          Total numbers of books posted
          <span className="badge bg-primary rounded-pill">
            
            {books && groups ?  (                                                                                                                                                                                                                                         
              // books
              //   .filter((book) => 
              //    groups.map((group)=> book.groupId === group.id)                 
              //   )
              //   .map((book) => book).length
                books.filter((book) => {
                  return groups.map((group) => book.groupId === group.id).includes(true)
                }).length
            ) : (
              <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
          </span>
        </li>
      </ul>
      <div className="tab-content" id="myTabContent">
        <div
          className="tab-pane fade show active"
          id="home-tab-pane"
          role="tabpanel"
          aria-labelledby="home-tab"
          tabIndex="0"
        >
          ...
        </div>
        <div
          className="tab-pane fade"
          id="profile-tab-pane"
          role="tabpanel"
          aria-labelledby="profile-tab"
          tabIndex="0"
        >
          ...
        </div>
        <div
          className="tab-pane fade"
          id="contact-tab-pane"
          role="tabpanel"
          aria-labelledby="contact-tab"
          tabIndex="0"
        >
          ...
        </div>
        <div
          className="tab-pane fade"
          id="disabled-tab-pane"
          role="tabpanel"
          aria-labelledby="disabled-tab"
          tabIndex="0"
        >
          ...
        </div>
      </div>
      {/*  */}
      {groups ? (
        groups.map((group) => (
          <div className="row" key={group.id}>
            <div className="col-xl-4 col-lg-6 mb-4">
              <div className="card">
                <div className="card-body d-flex justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="ms-3">
                      <p className="text-muted mb-0">{group.id}</p>
                      <p className="fw-bold mb-1">Group name</p>
                      <p className="text-muted mb-0">{group.name}</p>
                    </div>
                  </div>
                  <button
                    className="btn btn-success"
                    onClick={() =>
                      navigate("/teacherPage/viewGroup", {
                        state: { data: teacher, group: group },
                      })
                    }
                  >
                    View group
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
}
