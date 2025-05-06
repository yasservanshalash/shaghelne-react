import ServiceDetailComment1 from "../element/ServiceDetailComment1";
import ServiceDetailExtra1 from "../element/ServiceDetailExtra1";
import ServiceDetailFaq1 from "../element/ServiceDetailFaq1";
import ServiceDetailPrice1 from "../element/ServiceDetailPrice1";
import ServiceDetailReviewInfo1 from "../element/ServiceDetailReviewInfo1";
import ServiceDetailSlider1 from "../element/ServiceDetailSlider1";
import { Sticky, StickyContainer } from "react-sticky";
import useScreen from "@/hook/useScreen";
import ServiceContactWidget1 from "../element/ServiceContactWidget1";
import { useParams } from "react-router-dom";
import { product1 } from "@/data/product";
import { useEffect } from "react";

export default function ServiceDetail1({ serviceData }) {
  const isMatchedScreen = useScreen(1216);
  const { id } = useParams();
  
  // Use the service data passed through props or find it in the static data as fallback
  const service = serviceData || (id ? product1.find(item => item.id == id) : product1[0]);

  // Log service data on component render
  useEffect(() => {
    if (serviceData) {
      console.log("ServiceDetail1 - Received service data from props:", serviceData);
    } else if (service && id) {
      console.log(`ServiceDetail1 - No props data, found service in product1 with ID=${id}, Title="${service.title}"`);
    } else if (service) {
      console.log("ServiceDetail1 - Using default service data:", service);
    } else {
      console.log("ServiceDetail1 - No service data available");
    }
  }, [serviceData, service, id]);

  // If no service data is available, show a message
  if (!service) {
    return (
      <section className="pt50 pb90">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <h3>Service not found</h3>
              <p>The requested service could not be found.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <StickyContainer>
        <section className="pt10 pb90 pb30-md">
          <div className="container">
            <div className="row wrap">
              <div className="col-lg-8">
                <div className="column">
                  <ServiceDetailSlider1 serviceData={service} />
                  <div className="service-about">
                    <h4>About</h4>
                    <p className="text mb30">
                      {service?.description || "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English."}
                    </p>
                    <p className="text mb-0">Services I provide:</p>
                    <p className="text mb-0">1{")"} Website Design</p>
                    <p className="text mb-0">2{")"} Mobile App Design</p>
                    <p className="text mb-0">3{")"} Brochure Design</p>
                    <p className="text mb-0">4{")"} Business Card Design</p>
                    <p className="text mb30">5{")"} Flyer Design</p>
                    <p className="text mb30">
                      Many desktop publishing packages and web page editors now
                      use Lorem Ipsum as their default model text, and a search
                      for 'lorem ipsum' will uncover many web sites still in
                      their infancy. Various versions have evolved over the
                      years, sometimes by accident, sometimes on purpose
                      (injected humour and the like).
                    </p>
                    <div className="d-flex align-items-start mb50">
                      <div className="list1">
                        <h6>App type</h6>
                        <p className="text mb-0">Business, Food &amp; drink,</p>
                        <p className="text">Graphics &amp; design</p>
                      </div>
                      <div className="list1 ml80">
                        <h6>Design tool</h6>
                        <p className="text mb-0">Adobe XD, Figma,</p>
                        <p className="text">Adobe Photoshop</p>
                      </div>
                      <div className="list1 ml80">
                        <h6>Device</h6>
                        <p className="text">Mobile, Desktop</p>
                      </div>
                    </div>
                    <hr className="opacity-100 mb60" />
                    <h4>Compare Packages</h4>
                    <div className="table-style2 table-responsive bdr1 mt30 mb60">
                      <table className="table table-borderless mb-0">
                        <thead className="t-head">
                          <tr>
                            <th className="col" scope="col" />
                            <th className="col" scope="col">
                              <span className="h2">
                                $29 <small>/ monthly</small>
                              </span>
                              <br />
                              <span className="h4">Basic</span>
                              <br />
                              <span className="text">
                                I will redesign your current{" "}
                                <br className="d-none d-lg-block" /> landing
                                page or create one for{" "}
                                <br className="d-none d-lg-block" /> you (upto 4
                                sections)
                              </span>
                            </th>
                            <th className="col" scope="col">
                              <span className="h2">
                                $49 <small>/ monthly</small>
                              </span>
                              <br />
                              <span className="h4">Standard</span>
                              <br />
                              <span className="text">
                                4 High Quality Desktop{" "}
                                <br className="d-none d-lg-block" /> Pages.
                              </span>
                            </th>
                            <th className="col" scope="col">
                              <span className="h2">
                                $89 <small>/ monthly</small>
                              </span>
                              <br />
                              <span className="h4">Premium</span>
                              <br />
                              <span className="text">
                                4 High Quality Desktop and{" "}
                                <br className="d-none d-lg-block" /> Mobile
                                Pages.
                              </span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="t-body">
                          <tr className="bgc-thm3">
                            <th scope="row">Source file</th>
                            <td>
                              <a className="check_circle bgc-thm">
                                <span className="fas fa-check" />
                              </a>
                            </td>
                            <td>
                              <a className="check_circle bgc-thm">
                                <span className="fas fa-check" />
                              </a>
                            </td>
                            <td>
                              <a className="check_circle bgc-thm">
                                <span className="fas fa-check" />
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">Number of pages</th>
                            <td>2</td>
                            <td>4</td>
                            <td>6</td>
                          </tr>
                          <tr className="bgc-thm3">
                            <th scope="row">Revisions</th>
                            <td>1</td>
                            <td>3</td>
                            <td>5</td>
                          </tr>
                          <tr>
                            <th scope="row">Delivery Time </th>
                            <td>2 Days</td>
                            <td>3 Days</td>
                            <td>4 Days</td>
                          </tr>
                          <tr className="bgc-thm3">
                            <th scope="row">Total</th>
                            <td>$29</td>
                            <td>$49</td>
                            <td>$89</td>
                          </tr>
                          <tr>
                            <th scope="row" />
                            <td>
                              <a className="ud-btn btn-thm">
                                Select
                                <i className="fal fa-arrow-right-long" />
                              </a>
                            </td>
                            <td>
                              <a className="ud-btn btn-thm">
                                Select
                                <i className="fal fa-arrow-right-long" />
                              </a>
                            </td>
                            <td>
                              <a className="ud-btn btn-thm">
                                Select
                                <i className="fal fa-arrow-right-long" />
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <hr className="opacity-100 mb60" />
                    <h4>Frequently Asked Questions</h4>
                    <ServiceDetailFaq1 />
                    <hr className="opacity-100 mb60" />
                    <h4>Add Extra Services</h4>
                    <ServiceDetailExtra1 />
                    <hr className="opacity-100 mb15" />
                    <ServiceDetailReviewInfo1 />
                    <ServiceDetailComment1 />
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="column">
                  {isMatchedScreen ? (
                    <Sticky>
                      {({ style }) => (
                        <div className="scrollbalance-inner" style={style}>
                          <div className="blog-sidebar ms-lg-auto">
                            <ServiceDetailPrice1 />
                            <ServiceContactWidget1 />
                          </div>
                        </div>
                      )}
                    </Sticky>
                  ) : (
                    <div className="scrollbalance-inner">
                      <div className="blog-sidebar ms-lg-auto">
                        <ServiceDetailPrice1 />
                        <ServiceContactWidget1 />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </StickyContainer>
    </>
  );
}
