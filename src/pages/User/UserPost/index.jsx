import DashBoardUser from "@layouts/DashboardUser";
import { useState, useEffect } from "react";
import classnames from "classnames/bind";
import styles from "./userPost.module.scss";
import { fetchApi, formatUnitPrice, formatDateUI } from "@utils/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faLocation, faHeart } from "@fortawesome/free-solid-svg-icons";
import { Phone } from "lucide-react";
import avatar from "@assets/avatar_defaults/male.png";
import zalo from "@images/zalo.png";
import { PropertySlider } from "@components/component";

const cx = classnames.bind(styles);

const UserPostContent = () => {
  const [activeOption, setActiveOption] = useState("all");
  const [listPost, setListPost] = useState([]);
  const [chooseListPost, setChooseListPost] = useState([]);
  const [countPost, setCountPost] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [choosePost, setChoosePost] = useState({});
  const [mode, setMode] = useState("view");

  useEffect(() => {
    const getListPost = async () => {
      const url = "/post/get-user-post";
      const response_data = await fetchApi(url, {
        method: "get",
        skipAuth: false,
      });

      if (response_data.success) {
        setListPost(response_data.data);
        setChooseListPost(response_data.data);
        setCountPost(response_data.data.length);
        setChoosePost(response_data.data[0]);
        setActiveOption("all");
        console.log("list post: ", response_data.data);
      }
    };

    getListPost();
  }, []);

  useEffect(() => {
    if (activeOption == "all") {
      setChooseListPost(listPost);
      setCountPost(listPost.length);
      setChoosePost(listPost[0]);
      setActiveIndex(0);
      return;
    }
    const newListRender = listPost.filter(
      (item) => item.status == activeOption
    );
    setChooseListPost(newListRender);
    setChoosePost(newListRender[0]);
    setCountPost(newListRender.length);
    setActiveIndex(0);
    return;
  }, [activeOption, listPost]);

  const handleClickOptionView = (option) => {
    const listOption = {
      all: "all",
      published: "published",
      hidden: "hidden",
      draft: "draft",
    };
    return listOption[option];
  };

  return (
    <div className={cx("user_post_container")}>
      <h1 className={cx("user_post_title")}>Quản lý tin đăng</h1>
      {/* ---- Option view --- */}
      <div className={cx("wrapper_option_view")}>
        <button
          className={cx("btn_option_view", { active: activeOption === "all" })}
          onClick={() => setActiveOption("all")}
        >
          Tất cả
        </button>
        <button
          className={cx("btn_option_view", {
            active: activeOption === "published",
          })}
          onClick={() => setActiveOption("published")}
        >
          Đang hiển thị
        </button>
        <button
          className={cx("btn_option_view", {
            active: activeOption === "hidden",
          })}
          onClick={() => setActiveOption("hidden")}
        >
          Đang ẩn
        </button>
        <button
          className={cx("btn_option_view", {
            active: activeOption === "draft",
          })}
          onClick={() => setActiveOption("draft")}
        >
          Đăng không thành công
        </button>
      </div>
      <div className={cx("count_post")}>Có {countPost} bài đăng</div>
      <div className={cx("user_post_layout")}>
        <div className={cx("choose_mode")}>
          <button
            className={cx("btn_mode", { active: mode == "view" })}
            onClick={() => setMode("view")}
          >
            Xem
          </button>
          <button
            className={cx("btn_mode", { active: mode == "edit" })}
            onClick={() => setMode("edit")}
          >
            Chỉnh sửa
          </button>
        </div>
        <div className={cx("user_post_left")}>
          <div className={cx("title_list_post")}>Bài đăng hiển thị</div>
          <div className={cx("user_customer_post")}>
            {chooseListPost.map((post, index) => (
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
                  <div className={cx("num_view", {rent: post.category_info.type == "rent"})}>
                    {post.category_info.type == "sell" ? "Bán" : "Thuê"}
                  </div>

                  <img
                    className={cx("post_item_image")}
                    src={post?.images.length > 0 ? post.images[0] : null}
                    alt=""
                  />
                  <div className={cx("overlay")}>
                    Giá: {post?.price ?? post.price} {formatUnitPrice(post?.unit_price ?? post.unit_price)}
                  </div>
                </div>
                <div className={cx("post_item_right")}>
                  <div className={cx("post_title")}>{post?.title ?? post.title}</div>
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
                    {post?.address ? post.address : ""}
                  </div>
                  <div className={cx("post_item_time")}>
                    {formatDateUI(post?.createdAt ? post.createdAt : new Date())}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={cx("user_customer_right")}>
          <div className={cx("customer_detail_wrapper")}>
            {mode == "view" && chooseListPost.length > 0 && (
              <div className={cx("mode_view_container")}>
                <h2 className={cx("customer_detail_title")}>
                  Chi tiết tin đăng
                </h2>
                <div className={cx("mode_view_content")}>
                  <div className={cx("images_post")}>
                    <PropertySlider
                      className={cx("slider_image")}
                      images={choosePost?.images}
                    />
                  </div>
                  <div className={cx("choose_post_title")}>
                    {choosePost?.title ?? choosePost.title}
                  </div>
                  <div className={cx("choose_post_address")}>
                    <div className={cx("address_content")}><FontAwesomeIcon color="#ccc" fontSize="12px" icon={faLocation} />{choosePost?.address ? choosePost.address : ""}</div>
                    <button className={cx("btn_view_in_address")}>Xem trên bản đồ</button>
                  </div>
                  
                  <div className={cx("choose_post_metrics")}>
                    <div className={cx("choose_post_metric_item")}>
                      <div className={cx("choose_post_metric_name")}>
                        Mức giá
                      </div>
                      <div className={cx("choose_post_metric_value")}>
                        {choosePost?.price > 0 ? choosePost.price : 0}{" "}
                        {formatUnitPrice(choosePost?.unit_price ? choosePost.unit_price : "")}
                      </div>
                    </div>
                    <div className={cx("choose_post_metric_item")}>
                      <div className={cx("choose_post_metric_name")}>
                        Diện tích
                      </div>
                      <div className={cx("choose_post_metric_value")}>
                        {choosePost?.acreage > 0 ? choosePost.acreage : 0} m<sup>2</sup>
                      </div>
                    </div>
                  </div>
                  <div className={cx("break_line")}></div>
                  <div className={cx("sub_title_choose_post")}>Mô tả</div>
                  <div className={cx("choose_post_description")}>
                    {choosePost?.description ? choosePost.description : ""}
                  </div>
                  <div className={cx("break_line")}></div>
                  <div className={cx("sub_title_choose_post")}>Cơ sở hạ tầng</div>
                </div>
              </div>
            )}

            {mode == "edit" && (
              <div className={cx("mode_edit_container")}>
                <h2 className={cx("customer_detail_title")}>
                  Chỉnh sửa tin đăng
                </h2>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function UserPost() {
  return (
    <DashBoardUser>
      <UserPostContent />
    </DashBoardUser>
  );
}

export default UserPost;
