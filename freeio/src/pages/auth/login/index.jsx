import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/authStore";

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!credentials.email || !credentials.password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      await login(credentials);
      navigate("/"); // Redirect to home page after successful login
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <>
      <section className="our-login">
        <div className="container">
          <div className="row">
            <div
              className="col-lg-6 m-auto wow fadeInUp"
              data-wow-delay="300ms"
            >
              <div className="main-title text-center">
                <h2 className="title">Log In</h2>
                <p className="paragraph">
                  Give your visitor a smooth online experience with a solid UX
                  design
                </p>
              </div>
            </div>
          </div>
          <div className="row wow fadeInRight" data-wow-delay="300ms">
            <div className="col-xl-6 mx-auto">
              <div className="log-reg-form search-modal form-style1 bgc-white p50 p30-sm default-box-shadow1 bdrs12">
                <div className="mb30">
                  <h4>We're glad to see you again!</h4>
                  <p className="text">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-thm">
                      Sign Up!
                    </Link>
                  </p>
                </div>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="mb20">
                    <label className="form-label fw600 dark-color">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="email@example.com"
                      name="email"
                      value={credentials.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb15">
                    <label className="form-label fw600 dark-color">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="*******"
                      name="password"
                      value={credentials.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="checkbox-style1 d-block d-sm-flex align-items-center justify-content-between mb20">
                    <label className="custom_checkbox fz14 ff-heading">
                      Remember me
                      <input type="checkbox" defaultChecked="checked" />
                      <span className="checkmark" />
                    </label>
                    <a className="fz14 ff-heading">Lost your password?</a>
                  </div>
                  <div className="d-grid mb20">
                    <button 
                      className="ud-btn btn-thm" 
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging in..." : "Log In"} {!isLoading && <i className="fal fa-arrow-right-long" />}
                    </button>
                  </div>
                </form>
                <div className="hr_content mb20">
                  <hr />
                  <span className="hr_top_text">OR</span>
                </div>
                <div className="d-md-flex justify-content-between">
                  <button
                    className="ud-btn btn-fb fz14 fw400 mb-2 mb-md-0"
                    type="button"
                  >
                    <i className="fab fa-facebook-f pr10" /> Continue Facebook
                  </button>
                  <button
                    className="ud-btn btn-google fz14 fw400 mb-2 mb-md-0"
                    type="button"
                  >
                    <i className="fab fa-google" /> Continue Google
                  </button>
                  <button className="ud-btn btn-apple fz14 fw400" type="button">
                    <i className="fab fa-apple" /> Continue Apple
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
