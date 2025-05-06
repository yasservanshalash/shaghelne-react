import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/authStore";
import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Register",
};

export default function RegisterPage() {
  const [userData, setUserData] = useState({ 
    name: "", 
    email: "", 
    password: "",
    role: "USER" // Default role
  });
  const [error, setError] = useState("");
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!userData.name || !userData.email || !userData.password) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      await register(userData);
      navigate("/"); // Redirect to home page after successful registration
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <>
      <MetaComponent meta={metadata} />
      <section className="our-register">
        <div className="container">
          <div className="row">
            <div
              className="col-lg-6 m-auto wow fadeInUp"
              data-wow-delay="300ms"
            >
              <div className="main-title text-center">
                <h2 className="title">Register</h2>
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
                  <h4>Let's create your account!</h4>
                  <p className="text mt20">
                    Already have an account?{" "}
                    <Link to="/login" className="text-thm">
                      Log In!
                    </Link>
                  </p>
                </div>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="mb25">
                    <label className="form-label fw500 dark-color">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your full name"
                      name="name"
                      value={userData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb25">
                    <label className="form-label fw500 dark-color">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="email@example.com"
                      name="email"
                      value={userData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb15">
                    <label className="form-label fw500 dark-color">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="*******"
                      name="password"
                      value={userData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb25">
                    <label className="form-label fw500 dark-color">
                      Account Type
                    </label>
                    <select
                      className="form-select form-control"
                      name="role"
                      value={userData.role}
                      onChange={handleChange}
                    >
                      <option value="USER">User</option>
                      <option value="FREELANCER">Freelancer</option>
                      <option value="EMPLOYER">Employer</option>
                    </select>
                  </div>
                  <div className="d-grid mb20">
                    <button
                      className="ud-btn btn-thm default-box-shadow2"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating Account..." : "Create Account"}{" "}
                      {!isLoading && <i className="fal fa-arrow-right-long" />}
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
