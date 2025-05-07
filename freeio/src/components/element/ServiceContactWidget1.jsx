import { Link } from "react-router-dom";

export default function ServiceContactWidget1({ seller }) {
  // Default seller information if none provided
  const sellerInfo = seller || {
    name: "Ali Tufan",
    img: "/images/team/seller-1.png",
    rating: 4.9,
    contactCount: 12
  };
  
  return (
    <>
      <div className="freelancer-style1 service-single mb-0">
        <div className="d-flex align-items-center">
          <div className="thumb position-relative mb25">
            <img
              className="rounded-circle mx-auto"
              src={sellerInfo.img}
              alt="profile"
            />
            <span className="online" />
          </div>
        </div>
        <div className="details">
          <h5 className="title mb-1">{sellerInfo.name}</h5>
          <div className="review-meta d-flex align-items-center">
            <i className="fas fa-star fz10 review-color me-2" />
            <p className="mb-0 fz14">
              <span className="dark-color me-2">{sellerInfo.rating || 4.9}</span>
              ({sellerInfo.contactCount || 12} Contacts)
            </p>
          </div>
          <div className="review-meta d-flex align-items-center">
            <p className="mb-0 fz14">Lueilwitz, Kuphal</p>
          </div>
          <p className="text mt20 line-height-30 mb-0">
            I am a professional graphic designer. I have{" "}
            {sellerInfo.experience || "5+ years"} experience in this
            field and now my main focus is logo design. I create versatile,
            unique, and memorable vector art.
          </p>
          <hr className="opacity-100 mb15 mt30" />
          <div className="service-extra-info">
            <div className="info-list d-flex justify-content-between mb20">
              <p className="mb-0 fw500 text-start">Location</p>
              <p className="mb-0 text-end">{sellerInfo.location || "United States"}</p>
            </div>
            <div className="info-list d-flex justify-content-between mb20">
              <p className="mb-0 fw500 text-start">Member since</p>
              <p className="mb-0 text-end">{sellerInfo.memberSince || "April 2022"}</p>
            </div>
            <div className="info-list d-flex justify-content-between mb20">
              <p className="mb-0 fw500 text-start">Last delivery</p>
              <p className="mb-0 text-end">13 days ago</p>
            </div>
            <div className="info-list d-flex justify-content-between">
              <p className="mb-0 fw500 text-start">Languages</p>
              <p className="mb-0 text-end">{sellerInfo.languages?.join(", ") || "English"}</p>
            </div>
          </div>
          <div className="d-grid mt30">
            <a className="ud-btn btn-light-gray mb10">
              Contact Seller
              <i className="fal fa-arrow-right-long" />
            </a>
            <a className="ud-btn btn-white2">
              Browse Similar Services
              <i className="fal fa-arrow-right-long" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
