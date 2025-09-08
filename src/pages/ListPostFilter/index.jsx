import { useState, useEffect } from "react";
import classnames from "classnames/bind";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./ListPostFilter.module.scss";
import {
  Header,
  Footer,
  CollapseSection,
  Spinner,
} from "@components/component";
import { fetchApi, formatUnitPrice } from "@utils/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap } from "@fortawesome/free-regular-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Settings2,
  SlidersVertical,
  MapPin,
  IdCard,
  ChevronsRight,
  Star,
} from "lucide-react";
import avatar from "@assets/avatar_defaults/male.png";
const cx = classnames.bind(styles);

const ContentListPostFilter = () => {
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const [totalPage, setTotalPage] = useState(0);
  const [currentIndexPage, setCurrentIndexPage] = useState(0);
  const [countPost, setCountPost] = useState(0);
  const [listPost, setListPost] = useState([]);

  const navigate = useNavigate();

  // handle collapse
  const [collapseNeeds, setCollapseNeeds] = useState(false);
  const [needsFilter, setNeedsFilter] = useState(null);

  const [collapseCategory, setCollapseCategory] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState(
    "Loại hình bất động sản"
  );

  // Các trường params sẽ đọc từ query
  const needs_param = searchParams.get("needs");
  const category_param = searchParams.get("category");
  const province_param = searchParams.get("province");
  const ward_param = searchParams.get("ward");
  const min_price_param = searchParams.get("min_price");
  const max_price_param = searchParams.get("max_price");
  const min_acreage_param = searchParams.get("min_acreage");
  const max_acreage_param = searchParams.get("max_acreage");
  const limit_post_param = searchParams.get("limit");
  const page_post_param = searchParams.get("page");

  const bufferParams = useState({
    needs: "",
    category: "",
    province: "",
    ward: "",
    min_price: "",
    max_price: "",
    min_acreage: "",
    max_acreage: "",
    limit: "",
    page: "",
  });

  // tải trang với query được đọc từ useSearchParams
  useEffect(() => {
    const handleLoadListPostByParam = async () => {
      setLoading(true);
      const url = "/post/get-posts";
      const rawParams = {
        needs: needs_param,
        category: category_param,
        province: province_param,
        ward: ward_param,
        min_price: min_price_param,
        max_price: max_price_param,
        min_acreage: min_acreage_param,
        max_acreage: max_acreage_param,
        limit: limit_post_param,
        page: page_post_param,
      };

      const listParams = Object.fromEntries(
        Object.entries(rawParams).filter(([_, v]) => v != null)
      );
      const response_data = await fetchApi(url, {
        method: "get",
        skipAuth: true,
        params: listParams,
      });

      if (response_data.success) {
        console.log(
          "[List Post]: get post successfully ",
          response_data.data_posts
        );
        setListPost(response_data.data_posts);
        setTotalPage(response_data.total_pages);
        setCurrentIndexPage(response_data.current_index_page);
        setCountPost(response_data.count_post_in_page);
      } else {
        console.log("get post error");
      }

      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };
    handleLoadListPostByParam();
  }, [searchParams]);

  return (
    <div className={cx("listpost_container")}>
      {loading && <Spinner />}
      <div className={cx("filter_post_container")}>
        <div className={cx("filter_post_input")}>
          <Search className={cx("icon_search")} size={24} color="#777777" />
          <input
            className={cx("filter_input")}
            type="text"
            placeholder="Bạn muốn tìm kiếm gì?"
          />
          <button className={cx("filter_finding")}>Tìm kiếm</button>
        </div>
        <button className={cx("btn_view_in_map")}>
          {" "}
          <FontAwesomeIcon
            className={cx("icon_location_map")}
            icon={faMap}
            color="#fff"
            fontSize="22px"
          />{" "}
          Xem bản đồ{" "}
        </button>
      </div>
      <div className={cx("sub_filter")}>
        <div className={cx("sub_filter_item")}>
          <div
            className={cx("sub_filter_title")}
            onClick={() => setCollapseNeeds(!collapseNeeds)}
          >
            {needsFilter ? needsFilter : "Nhu cầu"}
            <Settings2 color="#575757ff" size={24} />
          </div>
          <div className={cx("sub_item_collapse", { show: collapseNeeds })}>
            <div className={cx("item_collapse_title")}>
              Nhu cầu tìm bất động sản
            </div>
            <div className={cx("break_line")}></div>
            <div
              className={cx("item_collapse_name")}
              onClick={() => {
                setNeedsFilter("Tìm thuê");
                setCollapseNeeds(false);
              }}
            >
              Tìm thuê
            </div>
            <div
              className={cx("item_collapse_name")}
              onClick={() => {
                setNeedsFilter("Tìm mua");
                setCollapseNeeds(false);
              }}
            >
              Tìm mua
            </div>
          </div>
        </div>
        <div className={cx("sub_filter_item")}>
          <div
            className={cx("sub_filter_title")}
            onClick={() => setCollapseCategory(!collapseCategory)}
          >
            {categoryFilter}
            <Settings2 color="#575757ff" size={24} />
          </div>
          <div className={cx("sub_item_collapse", { show: collapseCategory })}>
            <div className={cx("item_collapse_title")}>
              Lựa chọn loại hình bất động sản bạn muốn
            </div>
            <div className={cx("break_line")}></div>
            <div
              className={cx("item_collapse_name")}
              onClick={() => {
                setCategoryFilter("Tất cả");
                setCollapseCategory(false);
              }}
            >
              Tất cả
            </div>
            <div
              className={cx("item_collapse_name")}
              onClick={() => {
                setCategoryFilter("Căn hộ chung cư");
                setCollapseCategory(false);
              }}
            >
              Căn hộ chung cư
            </div>
            <div
              className={cx("item_collapse_name")}
              onClick={() => {
                setCategoryFilter("Chung cư mini");
                setCollapseCategory(false);
              }}
            >
              Chung cư mini
            </div>
            <div
              className={cx("item_collapse_name")}
              onClick={() => {
                setCategoryFilter("Nhà riêng");
                setCollapseCategory(false);
              }}
            >
              Nhà riêng
            </div>
            <div
              className={cx("item_collapse_name")}
              onClick={() => {
                setCategoryFilter("Văn phòng làm việc");
                setCollapseCategory(false);
              }}
            >
              Văn phòng làm việc
            </div>
            <div
              className={cx("item_collapse_name")}
              onClick={() => {
                setCategoryFilter("Phòng trọ, nhà trọ");
                setCollapseCategory(false);
              }}
            >
              Phòng trọ, nhà trọ
            </div>
            <div
              className={cx("item_collapse_name")}
              onClick={() => {
                setCategoryFilter("Kho, nhà xưởng");
                setCollapseCategory(false);
              }}
            >
              Kho, nhà xưởng
            </div>
            <div
              className={cx("item_collapse_name")}
              onClick={() => {
                setCategoryFilter("Đất nền");
                setCollapseCategory(false);
              }}
            >
              Đất nền
            </div>
            <div
              className={cx("item_collapse_name")}
              onClick={() => {
                setCategoryFilter("Bất động sản khác");
                setCollapseCategory(false);
              }}
            >
              Bất động sản khác
            </div>
          </div>
        </div>
      </div>
      <div className={cx("break_line")}></div>
      <div className={cx("category_subtitle")}>Danh mục</div>
      <div className={cx("category_title")}>
        Mua chung cư mini trên toàn quốc với giá từ 200 triệu - 3 tỷ
      </div>
      <div className={cx("number_result")}>Hiện có: {countPost} kết quả</div>
      {listPost.map((post, index) => (
        <div
          key={index}
          className={cx("wrapper_post", {
            standard: post.package_name == "Standard",
            started: post.package_name == "Started",
          })}
          onClick={() => navigate(`/post/${post._id}`)}
        >
          {post.package_name === "Premium" && (
            <div className={cx("wrap_premium_post")}>
              <div className={cx("tag_premium_post")}>
                <FontAwesomeIcon
                  fontSize="25px"
                  icon={faStar}
                  className={cx("tag_premium_icon")}
                />
                <div className={cx("tag_name_premium")}>Premium</div>
              </div>
              <div className={cx("owner_post")}>
                <div className={cx("owner_card_top")}>
                  <p className={cx("owner_name")}>Tạ Nguyễn Tiến Dũng</p>
                  <div className={cx("owner_avatar")}>
                    <img className={cx("avatar_img")} src={avatar} alt="" />
                  </div>
                </div>
                <div className={cx("owner_card_bottom")}>
                  <div className={cx("premium_post_time")}>Đăng hôm nay</div>
                  <div className={cx("premium_post_detail")}>
                    Hiện có 25 tin đăng khác
                  </div>
                  <button className={cx("btn_contact")}>
                    <ChevronsRight size={24} color="#777" />
                    Xem chi tiết
                  </button>
                </div>
              </div>
              <div className={cx("post_image_wrap")}>
                <div className={cx("main_image")}>
                  <img
                    className={cx("large_img")}
                    src={post.images[0]}
                    alt=""
                  />
                </div>
                <div className={cx("sub_image")}>
                  <div className={cx("sub_top_image")}>
                    <img
                      className={cx("medium_img")}
                      src={post.images[1]}
                      alt=""
                    />
                  </div>
                  <div className={cx("sub_botton_image")}>
                    <img
                      className={cx("small_img")}
                      src={post.images[2]}
                      alt=""
                    />
                    <img
                      className={cx("small_img")}
                      src={post.images[3]}
                      alt=""
                    />
                  </div>
                </div>
              </div>
              <div className={cx("post_content")}>
                <div className={cx("post_title")}>{post.title}</div>
                <div className={cx("post_sub_content")}>
                  <div className={cx("sub_content_left")}>
                    <div className={cx("sub_content_price")}>
                      {post.price} {formatUnitPrice(post.unit_price)}
                    </div>
                    <div className={cx("sub_content_acreage")}>
                      {post.acreage} m<sup>2</sup>
                    </div>
                  </div>
                  <div className={cx("sub_content_right")}>
                    <MapPin size={20} color="#db2b2b" />
                    {post.address}
                  </div>
                </div>
                <div className={cx("post_description")}>{post.description}</div>
              </div>
            </div>
          )}

          {post.package_name === "Standard" && (
            <>
              <div className={cx("standard_post_image")}>
                <div className={cx("tag_standard_post")}>
                  <div className={cx("tag_name_standard")}>Standard</div>
                </div>
                <div className={cx("wrap_standard_image")}>
                  <div className={cx("wrap_main_standard_image")}>
                    <img
                      className={cx("img_standard_main")}
                      src={post.images[0]}
                    ></img>
                  </div>
                  <div className={cx("wrap_sub_standard_image")}>
                    <img
                      className={cx("sub_standard_img")}
                      src={post.images[1]}
                    />
                    <img
                      className={cx("sub_standard_img")}
                      src={post.images[2]}
                    />
                    <img
                      className={cx("sub_standard_img")}
                      src={post.images[3]}
                    />
                  </div>
                </div>
              </div>
              <div className={cx("standard_post_content")}>
                <div className={cx("standard_post_title")}>{post.title}</div>
                <div className={cx("standard_post_metric")}>
                  <div className={cx("standard_post_price")}>
                    {post.price} {formatUnitPrice(post.unit_price)}
                  </div>
                  <div className={cx("standard_post_acreage")}>
                    {post.acreage} m<sup>2</sup>
                  </div>
                </div>
                <div className={cx("standard_post_description")}>
                  {post.description}
                </div>
                <div className={cx("standard_post_owner")}>
                  <img
                    className={cx("standard_avatar_img")}
                    src={avatar}
                    alt=""
                  />
                  <div className={cx("standard_post_name")}>
                    Tạ Nguyễn Tiến Dũng{" "}
                    <div className={cx("standard_post_time")}>Đăng hôm nay</div>
                  </div>
                </div>
                <button className={cx("btn_view_post")}>Xem chi tiết</button>
              </div>
            </>
          )}

          {post.package_name === "Started" && (
            <div className={cx("started_post_wrap")}>
              <img
                className={cx("img_started_post")}
                src={post.images[0]}
                alt=""
              />
              <div className={cx("started_post_content")}>
                <div className={cx("started_post_title")}>{post.title}</div>
                <div className={cx("started_post_time")}>Đăng hôm nay</div>
                <div className={cx("started_post_metric")}>
                  <div className={cx("started_post_price")}>
                    {post.price} {formatUnitPrice(post.unit_price)}
                  </div>
                  <div className={cx("started_post_acreage")}>
                    {post.acreage} m<sup>2</sup>
                  </div>
                </div>
                <div className={cx("started_post_description")}>
                  {post.description}
                </div>
                <div className={cx("started_post_owner")}>
                  <img
                    className={cx("started_avatar_img")}
                    src={avatar}
                    alt=""
                  />
                  <div className={cx("started_post_name")}>
                    Tạ Nguyễn Tiến Dũng
                  </div>
                  <button className={cx("btn_view_post_started")}>
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const ListPostFilter = () => {
  return (
    <>
      <Header />
      <ContentListPostFilter />
      <Footer />
    </>
  );
};

export default ListPostFilter;
