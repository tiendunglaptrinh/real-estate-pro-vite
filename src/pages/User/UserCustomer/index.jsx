import DashBoardUser from "@layouts/DashboardUser";
import { useState, useEffect } from "react";
import classnames from "classnames/bind";
import styles from "./userCustomer.module.scss";
import { fetchApi, formatUnitPrice, formatDateUI } from "@utils/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faLocation, faHeart } from "@fortawesome/free-solid-svg-icons";
import { Phone } from "lucide-react";
import avatar from "@assets/avatar_defaults/male.png";
import zalo from "@images/zalo.png";

const cx = classnames.bind(styles);

const UserCustomerContent = () => {
  const [listPost, setListPost] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [choosePost, setChoosePost] = useState({});
  useEffect(() => {
    const getListPostUser = async () => {
      const url = "/post/get-user-post";
      const response_data = await fetchApi(url, {
        method: "get",
        skipAuth: false,
      });

      if (response_data.success) {
        setListPost(response_data.data);
        setChoosePost(response_data.data[0]);
        return;
      }

      return;
    };
    getListPostUser();
  }, []);

  return (
    <div className={cx("user_customer_container")}>
      <h1 className={cx("user_customer_title")}>Thông tin người xem</h1>
      <div className={cx("user_customer_layout")}>
        <div className={cx("user_customer_left")}>
          <div className={cx("title_list_post")}>Bài đăng hiển thị</div>
          <div className={cx("user_customer_post")}>
            {listPost.map((post, index) => (
              <div
                key={index}
                className={cx("wrapper_post_item", {
                  active: index == activeIndex,
                })}
                onClick={() => {
                  setActiveIndex(index);
                  setChoosePost(post);
                }}
              >
                <div className={cx("post_item_left")}>
                  <div className={cx("num_view")}>
                    <FontAwesomeIcon className={cx("icon_view")} icon={faEye} />
                    {post.views_count}
                  </div>

                  <img
                    className={cx("post_item_image")}
                    src={post.images[0]}
                    alt=""
                  />
                  <div className={cx("overlay")}>
                    Giá: {post.price} {formatUnitPrice(post.unit_price)}
                  </div>
                </div>
                <div className={cx("post_item_right")}>
                  <div className={cx("post_title")}>{post.title}</div>
                  <div className={cx("post_metrics")}>
                    <div className={cx("post_metric_item")}>
                      <div className={cx("post_metric_name")}>Diện tích</div>
                      <div className={cx("post_metric_value")}>
                        {post.acreage} m<sup>2</sup>
                      </div>
                    </div>
                  </div>
                  <div className={cx("post_item_address")}>
                    <FontAwesomeIcon fontSize="11px" icon={faLocation} />
                    {post.address}
                  </div>
                  <div className={cx("post_item_time")}>
                    {formatDateUI(post.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={cx("user_customer_right")}>
          <div className={cx("current_post")}>
            <img
              className={cx("current_post_image")}
              src={choosePost?.images ? choosePost?.images[0] : ""}
              alt=""
            />
            <div className={cx("current_post_content")}>
              <div className={cx("current_post_overlay")}>
                <div className={cx("current_post_title")}>
                  {" "}
                  {choosePost.title}{" "}
                </div>
                <div className={cx("current_post_address")}>
                  {" "}
                  <FontAwesomeIcon
                    className={cx("icon_location")}
                    icon={faLocation}
                  />{" "}
                  {choosePost.address ?? ""}{" "}
                </div>
                <div className={cx("current_post_views")}>
                  {" "}
                  <FontAwesomeIcon
                    className={cx("icon_current_post_view")}
                    icon={faEye}
                  />{" "}
                  <span className={cx("subtitle_current_post")}>
                    Lượt xem tin:{" "}
                  </span>
                  {choosePost.views_count ?? 0}{" "}
                </div>
                <div className={cx("current_post_views")}>
                  {" "}
                  <FontAwesomeIcon
                    className={cx("icon_current_post_view")}
                    icon={faHeart}
                  />{" "}
                  <span className={cx("subtitle_current_post")}>
                    Lượt yêu thích tin:{" "}
                  </span>
                  {choosePost.likes_count ?? 0}{" "}
                </div>
              </div>
            </div>
          </div>
          <div className={cx("customer_detail_wrapper")}>
            <h2 className={cx("customer_detail_title")}>Chi tiết tin đăng</h2>
            <div className={cx("option_customer_details")}>
              <button className={cx("option_customer_tag")}>
                Thông báo chưa xem
              </button>
              <button className={cx("option_customer_tag")}>
                Thông báo đã xem
              </button>
            </div>
            <div className={cx("option_customer_item")}>
              <div className={cx("customer_info_wrap")}>
                <div className={cx("customer_info")}>
                  <img className={cx("avatar_customer")} src={avatar} alt="" />
                  <div className={cx("user_name")}>
                    Tạ Nguyễn Tiến Dũng
                    <span className={cx("time_send")}>1 ngày trước</span>
                  </div>
                </div>
                <div className={cx("customer_message")}>
                  <label className={cx("tag_message")}>Lời nhắn</label>
                  <div className={cx("message_content")}>
                    Liên hệ với tôi qua số điện thoại đính kèm
                  </div>
                </div>
              </div>
              <div className={cx("group_btn")}>
                <button className={cx("btn_help_post")}>
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    fontSize="18px"
                    className={cx("icon_update")}
                  />
                  Đánh dấu đã đọc
                </button>
                <button className={cx("btn_help_post", "zalo")}>
                  <img className={cx("icon_zalo")} src={zalo} alt="" />
                  Chat với Zalo
                </button>
                <button className={cx("btn_help_post", "phone")}>
                  <Phone className={cx("icon_phone")} size={20} color="#fff" />
                  Liên hệ 0378515369
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function UserCustomer() {
  return (
    <DashBoardUser>
      <UserCustomerContent />
    </DashBoardUser>
  );
}

export default UserCustomer;
