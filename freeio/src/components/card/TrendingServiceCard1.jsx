import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { useState, useEffect } from "react";

export default function TrendingServiceCard1({ data }) {
  const [isFavActive, setFavActive] = useState(false);

  const { pathname } = useLocation();
  
  // Enhanced debugging to ensure correct ID is used in links
  useEffect(() => {
    if (data) {
      console.log(`TrendingServiceCard1 - Service data for link:`, {
        id: data.id,
        idType: typeof data.id,
        title: data.title,
        linkPath: data.id ? `/service-single/${data.id}` : '/service-single'
      });
    }
  }, [data]);

  // Ensure service ID is explicitly converted to string and is not null/undefined
  const serviceId = data && data.id ? String(data.id) : null;
  const serviceLink = serviceId ? `/service-single/${serviceId}` : `/service-single`;
  
  return (
    <>
      <div
        className={`listing-style1 ${
          pathname === "/home-4" ? "default-box-shadow1 bdrs8" : ""
        } ${pathname === "/home-6" ? "default-box-shadow1 border-0" : ""}
                 ${
                   pathname === "/home-9"
                     ? "border-0 default-box-shadow1 bdrs16"
                     : ""
                 } 
                ${pathname === "/home-10" ? "bdrs16" : ""}
                ${pathname === "/home-17" ? "bdrs16" : ""}
                ${pathname === "/home-15" ? "bdrs16" : ""}
                ${pathname === "/home-12" ? "bdrs16" : ""}
                 ${
                   pathname === "/home-5"
                     ? "style4 default-box-shadow1 mb60"
                     : ""
                 } 
                 ${
                   pathname === "/home-18"
                     ? "style4 default-box-shadow1 mb60"
                     : ""
                 } 
                 ${
                   pathname === "/home-19"
                     ? "style4 default-box-shadow1 mb60"
                     : ""
                 } 
                ${pathname === "/home-8" ? "style5" : ""}`}
      >
        <div className="list-thumb">
          <img
            className="w-100 h-100 object-fit-cover"
            src={data.img}
            alt="thumbnail"
          />
          <a
            onClick={() => setFavActive(!isFavActive)}
            className={`listing-fav fz12 ${isFavActive ? "ui-fav-active" : ""}`}
          >
            <span className="far fa-heart" />
          </a>
        </div>
        <div className={`list-content ${pathname === "/home-8" ? "px-0" : ""}`}>
          <p className="list-text body-color fz14 mb-1">{data.category}</p>
          <h5 className="list-title">
            <Link to={serviceLink}>
              {data.title.slice(0, 40) + "..."}
            </Link>
          </h5>
          <div className="review-meta d-flex align-items-center">
            <i className="fas fa-star fz10 review-color me-2" />
            <p className="mb-0 body-color fz14">
              <span className="dark-color me-2">{data.rating}</span>
              {data.review} reviews
            </p>
          </div>
          <hr className="my-2" />
          <div className="list-meta d-flex justify-content-between align-items-center mt15">
            <a className="d-flex" href="#">
              <span className="position-relative mr10">
                <img
                  className="rounded-circle wa"
                  src={data.author.img}
                  alt="Freelancer Photo"
                />
                <span className="online-badges" />
              </span>
              <span className="fz14">{data.author.name}</span>
            </a>
            <div className="budget">
              <p className="mb-0 body-color">
                Starting at
                <span className="fz17 fw500 dark-color ms-1">
                  ${data.price}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
