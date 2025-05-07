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
import { useEffect } from "react";

export default function ServiceDetail1({ serviceData }) {
  const isMatchedScreen = useScreen(1216);
  const { id } = useParams();
  
  // Use the service data passed through props
  const service = serviceData;

  // Log service data on component render
  useEffect(() => {
    if (serviceData) {
      console.log("ServiceDetail1 - Received service data from props:", {
        id: serviceData.id,
        title: serviceData.title,
        tools: serviceData.tools,
        appTypes: serviceData.appTypes,
        deviceTypes: serviceData.deviceTypes
      });
    } else {
      console.log("ServiceDetail1 - No service data available");
    }
  }, [serviceData]);

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
                      {service.description}
                    </p>
                    <p className="text mb-0">Services I provide:</p>
                    {(service.features || []).map((feature, index) => (
                      <p key={index} className="text mb-0">{index + 1}{") "}{feature}</p>
                    ))}
                    <p className="text mb30"></p>
                    <p className="text mb30">
                      {service.requirements || 
                        "Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy."}
                    </p>
                    <div className="d-flex align-items-start mb50">
                      <div className="list1">
                        <h6>App type</h6>
                        <p className="text mb-0">
                          {(service.appTypes || ["Business", "Graphics & design"]).join(", ")}
                        </p>
                      </div>
                      <div className="list1 ml80">
                        <h6>Design tool</h6>
                        <p className="text mb-0">
                          {(service.tools || ["Adobe XD", "Figma", "Adobe Photoshop"]).join(", ")}
                        </p>
                      </div>
                      <div className="list1 ml80">
                        <h6>Device</h6>
                        <p className="text">
                          {(service.deviceTypes || ["Mobile", "Desktop"]).join(", ")}
                        </p>
                      </div>
                    </div>
                    <hr className="opacity-100 mb60" />
                    <h4>Compare Packages</h4>
                    <div className="table-style2 table-responsive bdr1 mt30 mb60">
                      <table className="table table-borderless mb-0">
                        <thead className="t-head">
                          <tr>
                            <th className="col" scope="col" />
                            {service.packagePlans && Object.keys(service.packagePlans).map((planKey, index) => {
                              const plan = service.packagePlans[planKey];
                              return (
                                <th key={index} className="col" scope="col">
                                  <span className="h2">
                                    ${plan.price} <small>/ monthly</small>
                                  </span>
                                  <br />
                                  <span className="h4">{plan.title}</span>
                                  <br />
                                  <span className="text">
                                    {plan.description}
                                  </span>
                                </th>
                              );
                            })}
                          </tr>
                        </thead>
                        <tbody className="t-body">
                          <tr className="bgc-thm3">
                            <th scope="row">Source file</th>
                            {service.packagePlans && Object.keys(service.packagePlans).map((planKey, index) => (
                              <td key={index}>
                                <a className="check_circle bgc-thm">
                                  <span className="fas fa-check" />
                                </a>
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <th scope="row">Number of pages</th>
                            {service.packagePlans && Object.keys(service.packagePlans).map((planKey, index) => (
                              <td key={index}>{service.packagePlans[planKey].includedPages || [2, 4, 6][index]}</td>
                            ))}
                          </tr>
                          <tr className="bgc-thm3">
                            <th scope="row">Revisions</th>
                            {service.packagePlans && Object.keys(service.packagePlans).map((planKey, index) => (
                              <td key={index}>{service.packagePlans[planKey].revisions || [1, 3, 5][index]}</td>
                            ))}
                          </tr>
                          <tr>
                            <th scope="row">Delivery Time </th>
                            {service.packagePlans && Object.keys(service.packagePlans).map((planKey, index) => (
                              <td key={index}>{service.packagePlans[planKey].deliveryTime || [2, 3, 4][index]} Days</td>
                            ))}
                          </tr>
                          <tr className="bgc-thm3">
                            <th scope="row">Total</th>
                            {service.packagePlans && Object.keys(service.packagePlans).map((planKey, index) => (
                              <td key={index}>${service.packagePlans[planKey].price}</td>
                            ))}
                          </tr>
                          <tr>
                            <th scope="row" />
                            {service.packagePlans && Object.keys(service.packagePlans).map((planKey, index) => (
                              <td key={index}>
                                <a className="ud-btn btn-thm">
                                  Select
                                  <i className="fal fa-arrow-right-long" />
                                </a>
                              </td>
                            ))}
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
                    <ServiceDetailReviewInfo1 reviewCount={service.reviewCount} rating={service.rating} />
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
                            <ServiceDetailPrice1 serviceData={service} />
                            <ServiceContactWidget1 seller={service.author} />
                          </div>
                        </div>
                      )}
                    </Sticky>
                  ) : (
                    <div className="scrollbalance-inner">
                      <div className="blog-sidebar ms-lg-auto">
                        <ServiceDetailPrice1 serviceData={service} />
                        <ServiceContactWidget1 seller={service.author} />
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
