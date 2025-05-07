import { useEffect, useState } from "react";
import ListingOption1 from "../element/ListingOption1";
import ListingSidebarModal1 from "../modal/ListingSidebarModal1";
import Pagination1 from "./Pagination1";
import TrendingServiceCard1 from "../card/TrendingServiceCard1";
import listingStore from "@/store/listingStore";
import priceStore from "@/store/priceStore";
import PopularServiceSlideCard1 from "../card/PopularServiceSlideCard1";
import useServiceStore from "@/store/serviceStore";

export default function Listing1() {
  const { services, pagination, isLoading, error, fetchServices } = useServiceStore();
  const getDeliveryTime = listingStore((state) => state.getDeliveryTime);
  const getPriceRange = priceStore((state) => state.priceRange);
  const getLevel = listingStore((state) => state.getLevel);
  const getLocation = listingStore((state) => state.getLocation);
  const getBestSeller = listingStore((state) => state.getBestSeller);
  const getDesginTool = listingStore((state) => state.getDesginTool);
  const getSpeak = listingStore((state) => state.getSpeak);
  const getSearch = listingStore((state) => state.getSearch);
  
  // Track current page for pagination
  const [currentPage, setCurrentPage] = useState(1);
  
  // Initial data load
  useEffect(() => {
    fetchFiltered(1);
  }, []);

  // Function to fetch with all filters applied
  const fetchFiltered = (page = 1) => {
    // Create filter object
    const filters = {
      page: page,
      limit: 12,
      // Only add filters that have values
      ...(getDeliveryTime && getDeliveryTime !== "anytime" && { deliveryTime: getDeliveryTime }),
      ...(getPriceRange.min > 0 && { minPrice: getPriceRange.min }),
      ...(getPriceRange.max < 10000 && { maxPrice: getPriceRange.max })
    };
    
    fetchServices(filters);
    setCurrentPage(page);
  };

  // When filters change, refetch first page of results
  useEffect(() => {
    fetchFiltered(1);
  }, [
    getDeliveryTime,
    getPriceRange.min,
    getPriceRange.max,
    getBestSeller
  ]);

  // Handle page change from pagination component
  const handlePageChange = (page) => {
    console.log(`Changing to page ${page}, current page is ${currentPage}`);
    fetchFiltered(page);
    window.scrollTo(0, 0);
  };

  // Client-side filtering for filters not supported by the backend
  const filtered = services
    .filter(item => getLevel?.length !== 0 ? getLevel.includes(item.level) : true)
    .filter(item => getLocation?.length !== 0 ? getLocation.includes(item.location) : true)
    .filter(item => getSearch !== "" ? 
      item.location.split("-").join(" ").includes(getSearch.toLowerCase()) : true)
    .filter(item => getBestSeller === "best-seller" ? true : item.sort === getBestSeller)
    .filter(item => getDesginTool?.length !== 0 ? getDesginTool.includes(item.tool) : true)
    .filter(item => getSpeak?.length !== 0 ? getSpeak.includes(item.language) : true);

  if (isLoading && services.length === 0) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-danger">Error: {error}</div>;
  }

  return (
    <section className="our-listing bgc-f7 pb30-md">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="row">
              <div className="col-lg-6">
                <div className="mb30">
                  <h2 className="title">All Services</h2>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="text-start text-lg-end mb30">
                  <ListingOption1 />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="row">
              {filtered.length > 0 ? (
                filtered.map((item, i) => (
                  <div key={i} className="col-sm-6 col-xl-3">
                    {item.gallery ? (
                      <PopularServiceSlideCard1
                        style="listing-style1"
                        data={item}
                      />
                    ) : (
                      <TrendingServiceCard1 style="listing-style1" data={item} />
                    )}
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-5">
                  <h3>No services found matching your criteria</h3>
                </div>
              )}
            </div>
            <div className="row mt30">
              <div className="col-lg-12">
                <div className="mbp_pagination">
                  <Pagination1 
                    currentPage={currentPage}
                    itemsPerPage={12}
                    totalItems={pagination.total || 0}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ListingSidebarModal1 />
    </section>
  );
}
