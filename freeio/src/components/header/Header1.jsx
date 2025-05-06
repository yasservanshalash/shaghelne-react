import { Link } from "react-router-dom";
import Mega from "./Mega";

import Navigation from "./Navigation";
import useStickyMenu from "@/hook/useStickyMenu";
import MobileNavigation1 from "./MobileNavigation1";

export default function Header1() {
  const sticky = useStickyMenu(50);

  return (
    <>
      <header
        className={`header-nav nav-homepage-style stricky main-menu animated   ${
          sticky ? "slideInDown stricky-fixed" : "slideIn"
        }`}
      >
        <nav className="posr">
          <div className="container-fluid posr menu_bdrt1 px30">
            <div className="row align-items-center justify-content-between">
              <div className="col-auto px-0">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="logos br-white-light pr30 pr5-xl">
                    <Link className="header-logo logo1" to="/">
                      <img src="/images/header-logo.svg" alt="Header Logo" />
                    </Link>
                    <Link className="header-logo logo2" to="/">
                      <img src="/images/header-logo2.svg" alt="Header Logo" />
                    </Link>
                  </div>
                  <div className="home1_style">
                    <Mega />
                  </div>
                </div>
              </div>
              <div className="col-auto px-0">
                <div className="d-flex align-items-center">
                  <Navigation />
                  <a
                    className="login-info bdrl1 pl15-lg pl30"
                    data-bs-toggle="modal"
                    href="#exampleModalToggle"
                  >
                    <span className="flaticon-loupe" />
                  </a>
                  <Link
                    className={`login-info mx15-lg mx30`}
                    to="/become-seller"
                  >
                    <span className="d-none d-xl-inline-block">Become a</span>{" "}
                    Seller
                  </Link>
                  <Link className={`login-info mr15-lg mr30`} to="/login">
                    Sign in
                  </Link>
                  <Link className="ud-btn btn-white add-joining" to="/register">
                    Join
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <MobileNavigation1 />
    </>
  );
}
