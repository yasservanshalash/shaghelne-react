import { Link } from "react-router-dom";
import { useAuth } from "../common/AuthContext";

export default function MobileNavigation1() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <>
      <div className="mobilie_header_nav stylehome1">
        <div className="mobile-menu">
          <div className="header bb-white-light">
            <div className="menu_and_widgets">
              <div className="mobile_menu_bar d-flex justify-content-between align-items-center">
                <Link className="mobile_logo" to="/">
                  <img src="/images/header-logo.svg" alt="Header Logo" />
                </Link>
                <div className="right-side text-end">
                  {isAuthenticated ? (
                    <div className="d-flex align-items-center">
                      <span className="text-white me-2">{user.name}</span>
                      <button
                        className="text-white bg-transparent border-0"
                        onClick={logout}
                      >
                        <i className="fas fa-sign-out-alt"></i>
                      </button>
                    </div>
                  ) : (
                    <Link className="text-white" to="/login">
                      join
                    </Link>
                  )}
                  <a
                    className="menubar ml30"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasExample"
                    aria-controls="offcanvasExample"
                  >
                    <img src="/images/white-nav-icon.svg" alt="icon" />
                  </a>
                </div>
              </div>
            </div>
            <div className="posr">
              <div className="mobile_menu_close_btn">
                <span className="far fa-times" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
