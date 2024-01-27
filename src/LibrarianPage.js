import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

export default function LibrarianPage() {
  const navigate = useNavigate();
  const data = useLocation().state.userData;
  const [users, setUsers] = useState([]);
  const [totalGroups, setTotalGroups] = useState();
  const [totalBooks, setTotalBooks] = useState();
  const [totalTeachers, setTotalTeachers] = useState(0);
  //search
  const [query, setQuery] = useState("");
  const handleSearch = (event) => {
    setQuery(event.target.value);
    var usersFound = users.filter(
      (user) => user.username === event.target.value 
    );
    if(usersFound.length === 0) usersFound = users.filter(
      (user) => user.username.toLowerCase().charAt(0) === event.target.value.toLowerCase().charAt(0)
    );
    if (usersFound.length > 0) setUsers(usersFound);
    else refreshData();
  };

  useEffect(() => {
    if (typeof Cookies.get("roleToken") === "undefined") navigate("/");
    refreshData();
    getGroups();
    getBooks();
  }, []);
  const refreshData = () => {
    fetch("https://localhost:7287/api/Users", {
      headers: {
        Authorization: `Bearer ${data.token}`, // librarian token
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setTotalTeachers(data.filter((user) => user.role === "Teacher").length);
        console.log(data);
      });
  };
  const getBooks = () => {
    fetch(`https://localhost:7287/api/Books`, {
      headers: {
        Authorization: `Bearer ${data.token}`, // librarian or teacher token
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setTotalBooks(data);
      });
  };
  const getGroups = () => {
    fetch(`https://localhost:7287/api/Groups`, {
      headers: {
        Authorization: `Bearer ${data.token}`, // librarian token
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.length);
        setTotalGroups(data.length);
      });
  };
  const deleteUser = (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://localhost:7287/api/Users/${userId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${data.token}`, // librarian token
          },
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            console.log(data.token);
            Swal.fire({
              title: "Deleted!",
              text: "Your user has been deleted.",
              icon: "success",
            });
            refreshData();
          });
      }
    });
  };
  const signOut = () => {
    Cookies.remove("roleToken");
    navigate("/");
  };
  return (
    <div>
      Role: {data.role}
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
              navigate("/librarianPage/profile", { state: { userData: data } })
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
            onClick={() =>
              navigate("/librarianPage/register", { state: { userData: data } })
            }
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
            onClick={() =>
              navigate("/librarianPage/group", {
                state: { userData: data, totalBooks: totalBooks },
              })
            }
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
          onClick={signOut}
        >
          Sign out
        </button>
      </ul>
      <ul className="list-group">
        <li className="list-group-item d-flex justify-content-between align-items-center">
          Total numbers of teachers
          <span className="badge bg-primary rounded-pill">
            {totalTeachers}
          </span>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
          Total numbers of books
          <span className="badge bg-primary rounded-pill">
            {totalBooks ? totalBooks.map((book) => book).length : "waiting"}
          </span>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
          Total numbers of groups
          <span className="badge bg-primary rounded-pill">
            {totalGroups ? totalGroups : "waiting"}
          </span>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
          Total numbers of downloaded books
          <span className="badge bg-primary rounded-pill">0</span>
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
     
      <div className="container">
      <div className="input-group d-flex justify-content-end" style={{marginRight: '10px'}}>
        <div className="form-outline" data-mdb-input-init>
          <label className="form-label" htmlFor="form1">
            Search
          </label>
          <input
            type="search"
            className="form-control"
            id="query"
            name="query"
            defaultValue={query}
            onChange={handleSearch}
          />
          
        </div>
      </div>
        <div className="row">
          <div className="col-12 mb-3 mb-lg-5">
            <div className="overflow-hidden card table-nowrap table-card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">User list</h5>
              </div>
              <div className="table-responsive">
                <table className="table mb-0">
                  <thead className="small text-uppercase bg-body text-muted">
                    <tr>
                      <th>Id</th>
                      <th>Profile</th>
                      <th>username</th>
                      <th>PassWord</th>
                      <th>Role</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users ? (
                      users.map((user) => (
                        <tr className="align-middle" key={user.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div>
                                <div className="h6 mb-0 lh-1">{user.id}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <img
                              src={`https://localhost:7287/images/userprofiles/${user.imagePath}`}
                              className="rounded-circle "
                              alt="Customer"
                              style={{ width: "158px", height: "158px" }}
                            ></img>
                          </td>

                          <td>{user.username}</td>
                          <td>
                            <span>{user.password}</span>
                          </td>
                          <td>
                            {" "}
                            <span className="d-inline-block align-middle">
                              {user.role}
                            </span>
                          </td>
                          <td className="text-end">
                            <div className="dropdown">
                              <button
                                className="btn btn-secondary dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-list"
                                  viewBox="0 0 16 16"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
                                  />
                                </svg>
                              </button>
                              <ul className="dropdown-menu">
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() =>
                                      navigate("/librarianPage/viewDetail", {
                                        state: {
                                          userDetail: user,
                                          userData: data,
                                        },
                                      })
                                    }
                                  >
                                    View detail
                                  </button>
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() =>
                                      navigate("/librarianPage/edit", {
                                        state: {
                                          userData: data,
                                          userId: user.id,
                                          isEditStudentGroup: false,
                                        },
                                      })
                                    }
                                  >
                                    Edit
                                  </button>
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => deleteUser(user.id)}
                                  >
                                    Delete
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <p>Loading....</p>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}