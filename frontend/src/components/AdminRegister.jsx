import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";

export default function AdminRegister() {
  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/");
      }
    });
  }, []);

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmission = () => {
    const { name, email, password, confirmPassword } = values;

    // Basic field check
    if (!name || !email || !password || !confirmPassword) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    // Password strength check
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
      setErrorMsg(
        "Password must be at least 6 characters and include letters and numbers."
      );
      return;
    }

    // Password match check
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    // Clear errors before Firebase call
    setErrorMsg("");

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (response) => {
        const user = response.user;
        await updateProfile(user, {
          displayName: name,
        });
        setSuccessMsg("Registration done successfully!");
        setTimeout(() => {
          setSuccessMsg("");
          navigate("/");
        }, 3000);
      })
      .catch((err) => {
        // Firebase error messages
        if (err.code === "auth/email-already-in-use") {
          setErrorMsg("This email is already in use.");
        } else if (err.code === "auth/invalid-email") {
          setErrorMsg("Invalid email address.");
        } else if (err.code === "auth/weak-password") {
          setErrorMsg("Password is too weak.");
        } else {
          setErrorMsg("Registration failed. Please try again.");
        }
        console.error(err);
      });
  };

  return (
    <>
      <div className="d-flex h-100">
        <div className="card container col-10 col-sm-10 col-md-9 col-lg-8 mt-2 p-0 align-self-center border-success">
          <div className="card-header border-dark">
            <div className="mt-2 text-center">
              <h3>Pharmacy Management System</h3>
              <h4>Register</h4>
            </div>
          </div>
          <div className="card-body">
            <div className="container align-self-center">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Full Name"
                  onChange={(event) =>
                    setValues((prev) => ({ ...prev, name: event.target.value }))
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="Email Address"
                  onChange={(event) =>
                    setValues((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputPassword1">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="exampleInputPassword1"
                  placeholder="Password"
                  onChange={(event) =>
                    setValues((prev) => ({
                      ...prev,
                      password: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputPassword2">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="exampleInputPassword2"
                  placeholder="Confirm Password"
                  onChange={(event) =>
                    setValues((prev) => ({
                      ...prev,
                      confirmPassword: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="text-center text-danger mt-2">{errorMsg}</div>
              <div className="text-center text-success mt-2">{successMsg}</div>
              <div className="form-group mt-4">
                <button
                  type="submit"
                  onClick={handleSubmission}
                  className="btn btn-success btn-block"
                >
                  Register
                </button>
              </div>
              <div className="form-group text-center">
                Already have an account? <Link to="/login">Login here!</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
