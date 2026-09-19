import { useState } from "react";
import "./App.css";
import Dashboard from "./Dashboard.jsx";
import Patients from "./Patients.jsx";
import DoctorDashboard from "./DoctorDashboard.jsx";

function App() {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Patient");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  // =========================
  // LOGIN
  // =========================
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please enter email and password");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (response.ok) {
        // Save logged-in user information
        // Keep username for existing dashboard functionality
        localStorage.setItem(
          "username",
          data.username
        );

        localStorage.setItem(
          "role",
          data.role
        );

        localStorage.setItem(
          "userId",
          data.userId
        );

        if (rememberMe) {
          localStorage.setItem(
            "rememberMe",
            "true"
          );
        } else {
          localStorage.removeItem(
            "rememberMe"
          );
        }

        setShowDashboard(true);
      } else {
        alert(
          "Login Failed: " +
            (data.message ||
              data.error ||
              (typeof data === "string"
                ? data
                : JSON.stringify(data)) ||
              "Invalid email or password")
        );
      }
    } catch (error) {
      console.error("Login Error:", error);

      alert(
        "Backend connection error. Please make sure Spring Boot is running on port 8080."
      );
    }
  };

  // =========================
  // SIGNUP
  // =========================
  const handleSignup = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert("Please enter username and password");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username.trim(),
            password: password,
            role: role,
          }),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (response.ok) {
        alert(
          "Signup Successful! Please login."
        );

        setUsername("");
        setEmail("");
        setPassword("");
        setRole("Patient");
        setIsSignup(false);
      } else {
        console.error(
          "Signup response:",
          data
        );

        alert(
          "Signup Failed: " +
            (data.message ||
              data.error ||
              data ||
              "Unable to create account")
        );
      }
    } catch (error) {
      console.error(
        "Signup Error:",
        error
      );

      alert(
        "Backend connection error. Please make sure Spring Boot is running on port 8080."
      );
    }
  };

  // =========================
  // ROLE BASED DASHBOARD
  // =========================
  if (showDashboard) {
    const loggedInRole =
      localStorage.getItem("role");

    // Patient gets Patient Dashboard
    if (loggedInRole === "Patient") {
      return <Patients />;
    }

    if (loggedInRole === "Doctor") {
      return <DoctorDashboard />;
    }

    // Admin continues with existing Dashboard
    return <Dashboard />;
  }

  // =========================
  // LOGIN / SIGNUP PAGE
  // =========================
  return (
    <div className="page">
      <div className="background-overlay"></div>

      <div className="login-card">

        <div className="logo">
          <div className="heart">
            ♥
            <span className="pulse">
              ⌁
            </span>
          </div>
        </div>

        <h1>
          Hospital Dashboard
        </h1>

        <p className="subtitle">
          {isSignup
            ? "Create your account"
            : "Sign in to your account"}
        </p>

        <form
          onSubmit={
            isSignup
              ? handleSignup
              : handleLogin
          }
        >

          {/* USERNAME - SIGNUP ONLY */}
          {isSignup && (
            <div className="input-group">
              <span className="icon">
                👤
              </span>

              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) =>
                  setUsername(
                    e.target.value
                  )
                }
              />
            </div>
          )}

          {/* EMAIL - LOGIN ONLY */}
          {!isSignup && (
            <div className="input-group">
              <span className="icon">
                👤
              </span>

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
              />
            </div>
          )}

          {/* PASSWORD */}
          <div className="input-group">
            <span className="icon">
              🔒
            </span>

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

            <button
              type="button"
              className="eye-button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
            >
              {showPassword
                ? "🙈"
                : "👁️"}
            </button>
          </div>

          {/* ROLE - SIGNUP ONLY */}
          {isSignup && (
            <div className="input-group">
              <span className="icon">
                🏥
              </span>

              <select
                value={role}
                onChange={(e) =>
                  setRole(
                    e.target.value
                  )
                }
              >
                <option value="Admin">
                  Admin
                </option>

                <option value="Doctor">
                  Doctor
                </option>

                <option value="Patient">
                  Patient
                </option>
              </select>
            </div>
          )}

          {/* REMEMBER ME */}
          {!isSignup && (
            <div className="options">

              <label>
                <input
                  type="checkbox"
                  checked={
                    rememberMe
                  }
                  onChange={(e) =>
                    setRememberMe(
                      e.target.checked
                    )
                  }
                />

                Remember me
              </label>

              <button
                type="button"
                className="forgot"
                onClick={() =>
                  alert(
                    "Please contact the administrator."
                  )
                }
              >
                Forgot Password?
              </button>

            </div>
          )}

          {/* MAIN BUTTON */}
          <button
            type="submit"
            className="main-button"
          >
            {isSignup
              ? "Create Account"
              : "Login"}
          </button>

        </form>

        {/* LOGIN / SIGNUP SWITCH */}
        <div className="switch-text">

          {isSignup
            ? "Already have an account?"
            : "Don't have an account?"}

          <button
            type="button"
            onClick={() => {
              setIsSignup(
                !isSignup
              );

              setUsername("");
              setEmail("");
              setPassword("");
            }}
          >
            {isSignup
              ? " Login"
              : " Sign up"}
          </button>

        </div>

        {/* SECURITY TEXT */}
        <div className="secure-text">
          🔐 Secure & Reliable Healthcare
          Management
        </div>

      </div>
    </div>
  );
}

export default App;
