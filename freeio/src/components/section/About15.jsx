import { funfactsData2 } from "@/data/fanfact";

import { Link } from "react-router-dom";
import React from "react";

export default function About15() {
  return (
    <section className="bgc-light-yellow mx30 bdrs24">
      <div className="cta-banner3 position-relative overflow-hidden">
        <div className="container">
          <div className="row align-items-center justify-content-between">
            <div className="col-lg-6 col-xl-5 wow fadeInRight">
              <div className="home13-ctaimg-1">
                <div className="d-sm-flex align-items-center">
                  <div>
                    <img
                      className="mb35"
                      src="/images/about/home15-cta-1.png"
                      alt=" image "
                    />
                    <img
                      className="mb30-sm"
                      src="/images/about/home13-cta-2.png"
                      alt=" image "
                    />
                  </div>
                  <div>
                    <img
                      className="mb35"
                      src="/images/about/home15-cta-2.png"
                      alt=" image "
                    />
                    <img src="/images/about/home15-cta-3.png" alt=" image " />
                  </div>
                </div>
              </div>
              <div className="position-relative mb30-md">
                <div className="imgbox-about-page position-relative d-none d-xl-block">
                  <img
                    className="img-1 spin-right"
                    src="/images/about/element-1.png"
                    alt=" image "
                  />
                  <img
                    className="img-2 bounce-x"
                    src="/images/about/element-2.png"
                    alt=" image "
                  />
                  <img
                    className="img-3 bounce-y"
                    src="/images/about/element-3.png"
                    alt=" image "
                  />
                  <img
                    className="img-4 bounce-y"
                    src="/images/about/element-4.png"
                    alt=" image "
                  />
                  <img
                    className="img-5 spin-right"
                    src="/images/about/element-5.png"
                    alt=" image "
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-xl-5 wow fadeInLeft">
              <div
                className="about-box-1 pe-xl-4 ps-3 ps-xl-0 wow fadeInLeft"
                data-wow-delay="300ms"
              >
                <h2 className="title mb10">
                  Truested By Best <br className="d-none d-xl-block" />
                  Freelancer
                </h2>
                <p className="text mb25 mb30-md">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod <br className="d-none d-xl-block" /> tempor
                  incididunt.
                </p>
                <div className="list-style3 mb40 mb30-md">
                  <ul>
                    {funfactsData2.map((elm, i) => (
                      <li key={i}>
                        <i className="far fa-check text-white bgc-thm"></i>
                        {elm}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link to="/become-seller" className="ud-btn btn-dark bdrs16">
                  Become a Seller
                  <i className="fal fa-arrow-right-long" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
