import { useEffect } from "react";
import { Link } from "react-router-dom";
import PopularServiceSlideCard1 from "../card/PopularServiceSlideCard1";
import PopularServiceCard1 from "../card/PopularServiceCard1";
import useServiceStore from "@/store/serviceStore";

export default function PopulerService() {
  const { services, isLoading, error, fetchServices } = useServiceStore();

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return (
    <>
      <section className="pb40-md pb70 mt70 mt0-lg">
        <div className="container">
          <div className="row align-items-center wow fadeInUp">
            <div className="col-lg-12">
              <div className="main-title mb30-lg">
                <h2 className="title">
                  People Who Viewed This Service Also Viewed
                </h2>
                <p className="paragraph">
                  Give your visitor a smooth online experience with a solid UX
                  design
                </p>
              </div>
            </div>
          </div>
          {isLoading ? (
            <div className="text-center">Loading...</div>
          ) : error ? (
            <div className="text-center text-danger">Error: {error}</div>
          ) : (
            <div className="row">
              {services.slice(0, 4).map((item, i) => (
                <div key={i} className="col-sm-6 col-xl-3">
                  {item.gallery ? (
                    <PopularServiceSlideCard1
                      style="listing-style1"
                      data={item}
                    />
                  ) : (
                    <PopularServiceCard1 style="listing-style1" data={item} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
