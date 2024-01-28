import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
export default function GroupPage() {
  const navigate = useNavigate();
  const data = useLocation().state.userData;
  const totalBooks = useLocation().state.totalBooks;
  const [groups, setGroups] = useState([]);
  const [group, setGroup] = useState({ userId: 0, name: "" });
  const [teachers, setTeachers] = useState([]);
  const [isCreateStudentGroupPage, setIsCreateStudentGroupPage] =
    useState(false);
  useEffect(() => {
    refreshData();
  }, []);
  const refreshData = () => {
    fetch(`https://localhost:7287/api/Groups`, {
      headers: {
        Authorization: `Bearer ${data.token}`, // librarian token
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setGroups(data);
        console.log(groups);
        console.log(data);
      });
  };
  const switchPage = (e) => {
    if (isCreateStudentGroupPage === false) setIsCreateStudentGroupPage(true);
    else setIsCreateStudentGroupPage(false);
    refreshData();
  };
  const getTeachers = (e) => {
    fetch(`https://localhost:7287/api/Users`, {
      headers: {
        Authorization: `Bearer ${data.token}`, // librarian token
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTeachers(data);
        console.log(data);
      });
    console.log(e.target.value);
    setGroup({ ...group, userId: e.target.value });
  };
  const createGroup = (e) => {
    e.preventDefault();
    fetch("https://localhost:7287/api/Groups", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${data.token}`, // librarian token
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: group.name,
        userId: group.userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.status === "error") {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: data.message,
          });
        } else if(data.status === "success") {
          Swal.fire({
            title: "Group has been created successfully!",
            text: "You clicked the button!",
            icon: "success",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleGroupNameInput = (e) => {
    setGroup({ ...group, name: e.target.value });
  };
  const deleteGroup = (groupId) => {
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
        fetch(`https://localhost:7287/api/Groups/${groupId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${data.token}`, // librarian token
          },
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            console.log(data.token); 
            totalBooks.filter((book)=> book.groupId === groupId).map(book=> deleteBook(book.id));
            Swal.fire({
              title: "Deleted!",
              text: "Your Group has been deleted.",
              icon: "success",
            });
         
             
          }).then(()=>{
            refreshData();
          });
      }
    });
  };
  const deleteBook = (bookId) => {
    fetch(`https://localhost:7287/api/Books/${bookId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${data.token}`, // teacher or librarian token
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        console.log(data.token);
      });
  };
  if (isCreateStudentGroupPage !== true) {
    return (
      <div>
        <div className="d-flex justify-content-end mb-5">
          <button
            type="submit"
            className="btn btn-success btn-lg btn-block"
            onClick={switchPage}
          >
            Create student Group
          </button>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12 mb-3 mb-lg-5">
              <div className="overflow-hidden card table-nowrap table-card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Student Group list</h5>
                </div>
                <div className="table-responsive">
                  <table className="table mb-0">
                    <thead className="small text-uppercase bg-body text-muted">
                      <tr>
                        <th>Id</th>
                        <th>name</th>
                        <th>teacher id</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groups ? (
                        groups.map((group) => (
                          <tr className="align-middle" key={group.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div>
                                  <div className="h6 mb-0 lh-1">{group.id}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div>
                                  <div className="h6 mb-0 lh-1">
                                    {group.name}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div>
                                  <div className="h6 mb-0 lh-1">
                                    {group.userId}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="text-end">
                              <div className="dropdown">
                                <button
                                  className="btn btn-secondary dropdown-toggle"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  |||
                                </button>
                                <ul className="dropdown-menu">
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      onClick={() =>
                                        navigate("/librarianPage/edit", {
                                          state: {
                                            userData: data,
                                            groupId: group.id,
                                            isEditStudentGroup: true,
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
                                      onClick={() => deleteGroup(group.id)}
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
                        <div className="d-flex justify-content-center">
                          <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
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
  } else {
    return (
      <div>
        <div className="d-flex  justify-content-end mb-5">
          <button
            type="submit"
            className="btn btn-danger btn-lg btn-block"
            onClick={switchPage}
          >
             back to Student Group list
          </button>
        </div>
        <div className="container">
          <div className="row d-flex align-items-center justify-content-center h-100">
            <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
              <form
                className="d-flex flex-column justify-content-center"
                // onSubmit={register}
              >
                <div className="form-outline mb-4 ">
                  <label className="form-label" htmlFor="name">
                    Group name
                  </label>
                  <input
                    value={group.name}
                    name="name"
                    type="text"
                    id="name"
                    className="form-control form-control-lg"
                    onChange={handleGroupNameInput}
                  />
                </div>

                <select
                  className="form-select form-select-lg mb-3"
                  aria-label="Large select example"
                  onClick={getTeachers}
                >
                  <option value>Add teacher to this group</option>
                  {teachers.map((teacher) => {
                    if (teacher.role !== "Librarian")
                      return (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.username}
                        </option>
                      );
                    return null;
                  })}
                </select>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-block"
                  onClick={createGroup}
                >
                  done
                </button>
              </form>
              <br></br>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
