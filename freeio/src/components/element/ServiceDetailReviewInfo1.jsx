import { Link } from "react-router-dom";

export default function ServiceDetailReviewInfo1({ rating = 4.8, reviewCount = 12 }) {
  // Calculate percentages for progress bars
  const starPercentages = {
    five: 78,
    four: 12,
    three: 5,
    two: 3,
    one: 2
  };

  // Calculate how many reviews for each star rating
  const calculateReviewsForStars = (totalReviews, percentage) => {
    return Math.round((percentage / 100) * totalReviews);
  };

  return (
    <>
      <div className="product_single_content mb45">
        <div className="mbp_pagination_comments">
          <div className="total_review d-flex align-items-center justify-content-between mb20">
            <h4 className="mb-0">Reviews</h4>
            <div className="star-rating">
              <span className="fz14">
                {rating} Ratings, {reviewCount} Reviews
              </span>
            </div>
          </div>
          <div className="review_content pc20">
            <div className="d-flex">
              <div className="sspd_review_left">
                <div className="ui_content">
                  <div className="ui_content_style ps-0">
                    <h4 className="m0">{rating}</h4>
                    <ul>
                      <li>
                        <i className="fas fa-star"></i>
                      </li>
                      <li>
                        <i className="fas fa-star"></i>
                      </li>
                      <li>
                        <i className="fas fa-star"></i>
                      </li>
                      <li>
                        <i className="fas fa-star"></i>
                      </li>
                      <li>
                        <i className="fas fa-star"></i>
                      </li>
                    </ul>
                    <span className="mr10">{reviewCount} reviews</span>
                  </div>
                </div>
              </div>
              <div className="sspd_review_right">
                <div className="progress_item">
                  <div className="item">
                    <h5 className="mb0 fz14">5 Star</h5>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        style={{ width: `${starPercentages.five}%` }}
                      ></div>
                    </div>
                    <span className="fz14">{calculateReviewsForStars(reviewCount, starPercentages.five)}</span>
                  </div>
                  <div className="item">
                    <h5 className="mb0 fz14">4 Star</h5>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        style={{ width: `${starPercentages.four}%` }}
                      ></div>
                    </div>
                    <span className="fz14">{calculateReviewsForStars(reviewCount, starPercentages.four)}</span>
                  </div>
                  <div className="item">
                    <h5 className="mb0 fz14">3 Star</h5>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        style={{ width: `${starPercentages.three}%` }}
                      ></div>
                    </div>
                    <span className="fz14">{calculateReviewsForStars(reviewCount, starPercentages.three)}</span>
                  </div>
                  <div className="item">
                    <h5 className="mb0 fz14">2 Star</h5>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        style={{ width: `${starPercentages.two}%` }}
                      ></div>
                    </div>
                    <span className="fz14">{calculateReviewsForStars(reviewCount, starPercentages.two)}</span>
                  </div>
                  <div className="item">
                    <h5 className="mb0 fz14">1 Star</h5>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        style={{ width: `${starPercentages.one}%` }}
                      ></div>
                    </div>
                    <span className="fz14">{calculateReviewsForStars(reviewCount, starPercentages.one)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
