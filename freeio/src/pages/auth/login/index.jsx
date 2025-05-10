import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/authStore";

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDebug, setShowDebug] = useState(false);
  const { login, isLoading, user, token, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  // Check if already logged in
  useEffect(() => {
    if (isAuthenticated && user && token) {
      setSuccess(`Already logged in as ${user.email || user.name || "a user"}`);
    }
  }, [isAuthenticated, user, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!credentials.email || !credentials.password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      console.log("Attempting login with:", { email: credentials.email });
      
      const data = await login(credentials);
      
      console.log("Login successful, user data:", { 
        userId: data.user._id,
        email: data.user.email,
        tokenAvailable: !!data.token,
        tokenLength: data.token ? data.token.length : 0
      });
      
      setSuccess(`Login successful! Welcome, ${data.user.name || data.user.email}`);
      
      // Short delay before redirecting to show success message
      setTimeout(() => {
        navigate("/"); // Redirect to home page after successful login
      }, 1500);
      
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please try again.");
    }
  };
  
  const debugInfo = {
    isAuthenticated,
    hasUser: !!user,
    hasToken: !!token,
    userId: user ? user._id : null,
    email: user ? user.email : null,
  };

  return (
    <section className="our-login">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 m-auto">
            <div className="login_form">
              <div className="login_title text-center mb30">
                <h2>Sign In to Freeio</h2>
                <p className="text">
                  Access your dashboard, jobs, and account settings
                </p>
              </div>
              {error && (
                <div className="alert alert-danger mb-3">
                  <p className="mb-0">{error}</p>
                </div>
              )}
              {success && (
                <div className="alert alert-success mb-3">
                  <p className="mb-0">{success}</p>
                </div>
              )}
              {showDebug && (
                <div className="alert alert-info mb-3">
                  <h6>Auth Debug Info</h6>
                  <pre className="mb-0" style={{ fontSize: '12px' }}>{JSON.stringify(debugInfo, null, 2)}</pre>
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-2 mr-sm-2">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="Your email address"
                    value={credentials.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group mb5">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="exampleCheck3"
                  />
                  <label className="custom-control-label" htmlFor="exampleCheck3">
                    Remember me
                  </label>
                  <Link className="btn-fpswd float-end" to="#">
                    Forgot password?
                  </Link>
                </div>
                <div className="d-grid">
                  <button
                    className="ud-btn btn-thm w-100 mt-4"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </button>
                </div>
                <div className="hr_content">
                  <hr />
                  <span className="hr_top_text">OR</span>
                </div>
                <div className="d-grid">
                  <button className="ud-btn btn-white" type="button">
                    <i className="fab fa-google"></i> Continue with Google
                  </button>
                </div>
                <p className="text-center mb-0 mt-4">
                  Don't have an account?{" "}
                  <Link className="fw-bold" to="/register">
                    Sign up
                  </Link>
                </p>
                <div className="text-center mt-2">
                  <button 
                    type="button" 
                    className="btn btn-link btn-sm" 
                    onClick={() => setShowDebug(!showDebug)}
                  >
                    {showDebug ? "Hide Debug Info" : "Show Debug Info"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
