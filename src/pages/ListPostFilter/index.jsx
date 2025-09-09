import { useState, useEffect, useRef } from "react";
import classnames from "classnames/bind";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./ListPostFilter.module.scss";
import {
  Header,
  Footer,
  CollapseSection,
  Spinner,
  PriceFilter,
  AcreageFilter
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
  // Sử dụng toàn cục
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // data in post list
  const [totalPage, setTotalPage] = useState(0);
  const [currentIndexPage, setCurrentIndexPage] = useState(0);
  const [countPost, setCountPost] = useState(0);
  const [listPost, setListPost] = useState([]);

  // ------------------------------------- Logic cho bufferParams ----------------------------
  // Buffer params state
  const [bufferParams, setBufferParams] = useState({
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

  const [applyParams, setApplyParams] = useState({
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

  // Sync từ URL query -> bufferParams khi load trang hoặc URL query thay đổi
  useEffect(() => {
    const newParams = {
      needs: searchParams.get("needs") || "",
      category: searchParams.get("category") || "",
      province: searchParams.get("province") || "",
      ward: searchParams.get("ward") || "",
      min_price: searchParams.get("min_price") || "",
      max_price: searchParams.get("max_price") || "",
      min_acreage: searchParams.get("min_acreage") || "",
      max_acreage: searchParams.get("max_acreage") || "",
      limit: searchParams.get("limit") || "",
      page: searchParams.get("page") || "",
    };
    const allEmpty = Object.values(newParams).every((val) => val === "");
    if (allEmpty) {
      newParams.page = "1"; // set mặc định page=1
    }
    setBufferParams(newParams);
    setApplyParams(newParams);
  }, [searchParams]);

  // Gọi API mỗi khi searchParams thay đổi
  useEffect(() => {
    if (
      bufferParams.needs !== "" ||
      bufferParams.category !== "" ||
      bufferParams.province !== "" ||
      bufferParams.ward !== "" ||
      bufferParams.min_price !== "" ||
      bufferParams.max_price !== "" ||
      bufferParams.page !== ""
    ) {
      const handleLoadListPostByParam = async () => {
        // setLoading(true);
        const listParams = Object.fromEntries(
          Object.entries(bufferParams).filter(([_, v]) => v !== "")
        );
        if (listParams.category) {
          listParams.category = listParams.category.split(",");
        }
        const response_data = await fetchApi("/post/get-posts", {
          method: "get",
          skipAuth: true,
          params: listParams,
        });

        if (response_data.success) {
          setListPost(response_data.data_posts);
          setTotalPage(response_data.total_pages);
          setCurrentIndexPage(response_data.current_index_page);
          setCountPost(response_data.count_post_in_page);
        } else {
          setListPost([]);
          setTotalPage(0);
          setCurrentIndexPage(0);
          setCountPost(0);
        }

        setTimeout(() => {
          setLoading(false);
        }, 1000);
      };
      handleLoadListPostByParam();
    }
  }, [bufferParams]);

  const updateFilter = (newValues) => {
    const updated = { ...bufferParams, ...newValues };
    const query = Object.fromEntries(
      Object.entries(updated).filter(([_, v]) => v !== "")
    );

    navigate({
      pathname: "/list-post",
      search: `?${new URLSearchParams(query).toString()}`,
    });
  };
  // ------------------------------------- End logic cho bufferParams ----------------------------

  // ----------------- Logic cho filter component -----------------
  // ----------------- Location Filter -----------------
  const [locations, setLocations] = useState([]);
  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [showWardCollapse, setShowWardCollapse] = useState(false);
  const [selectedWard, setSelectedWard] = useState(null);
  const [provinceSlug, setProvinceSlug] = useState("");
  const [wardSlug, setWardSlug] = useState("");

  const provinceInputRef = useRef(null);

  useEffect(() => {
    const fetchLocations = async () => {
      const res = await fetchApi("/location/all", { method: "get" });
      if (res.success) setLocations(res.locations);
    };
    fetchLocations();
  }, []);

  const focusInput = () => {
    if (!selectedProvince) {
      setShowWardCollapse(false);
      setShowProvinceDropdown(true);
    } else {
      setShowProvinceDropdown(false);
      setShowWardCollapse(true);
    }
  };

  // Khi chọn tỉnh/thành
  const handleSelectProvince = (province) => {
    setSelectedProvince(province);
    setSelectedWard(null);
    setShowProvinceDropdown(false);
    setShowWardCollapse(true);
  };

  // Khi chọn huyện/phường
  const handleSelectWard = (ward) => {
    setSelectedWard(ward);
    setShowWardCollapse(false);
  };

  const submitLocation = () => {
    updateFilter({
      province: selectedProvince ? selectedProvince.slug : "",
      ward: selectedWard ? selectedWard.slug : "",
      page: 1,
    });
  };

  // Đồng bộ selectedProvince và selectedWard từ bufferParams và locations
  useEffect(() => {
    if (!locations.length) return;

    // Tìm province theo slug
    let province = null;
    if (bufferParams.province) {
      province = locations.find((p) => p.slug === bufferParams.province);
      setSelectedProvince(province || null);
    } else {
      setSelectedProvince(null);
    }

    // Tìm ward theo slug (nếu có province và ward)
    if (province && bufferParams.ward) {
      const ward = (province.wards || []).find(
        (w) => w.slug === bufferParams.ward
      );
      setSelectedWard(ward || null);
    } else {
      setSelectedWard(null);
    }
  }, [bufferParams.province, bufferParams.ward, locations]);

  // ----------------- End Location Filter -----------------

  // ----------------- Needs Filter -----------------
  const [collapseNeeds, setCollapseNeeds] = useState(false);
  const [needsFilter, setNeedsFilter] = useState(null);

  // Đồng bộ needsFilter từ bufferParams
  useEffect(() => {
    if (bufferParams.needs === "rent") setNeedsFilter("Tìm thuê");
    else if (bufferParams.needs === "sell") setNeedsFilter("Tìm mua");
    else setNeedsFilter(null);
  }, [bufferParams.needs]);
  // ----------------- End Needs Filter -----------------

  // ----------------- Category Filter -----------------
  const [collapseCategory, setCollapseCategory] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState([]);

  const CATEGORY_OPTIONS = [
    { value: "can-ho-chung-cu", label: "Căn hộ chung cư" },
    { value: "chung-cu-mini", label: "Chung cư mini" },
    { value: "nha-rieng", label: "Nhà riêng" },
    { value: "van-phong-lam-viec", label: "Văn phòng làm việc" },
    { value: "phong-tro-nha-tro", label: "Phòng trọ, nhà trọ" },
    { value: "kho-nha-xuong", label: "Kho, nhà xưởng" },
    { value: "dat-nen", label: "Đất nền" },
    { value: "bat-dong-san-khac", label: "Bất động sản khác" },
  ];

  // Đồng bộ categoryFilter từ bufferParams
  useEffect(() => {
    if (bufferParams.category) {
      setCategoryFilter(bufferParams.category.split(","));
    } else {
      setCategoryFilter([]);
    }
  }, [bufferParams.category]);
  // ----------------- End Category Filter -----------------

  // ----------------- Price Filter -----------------
  const [collapsePrice, setCollapsePrice] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [textPriceFilter, setTextPriceFilter] = useState("Tất cả giá");

  useEffect(() => {
    if (bufferParams.min_price) setMinPrice(Number(bufferParams.min_price));
    else setMinPrice(null);
    if (bufferParams.max_price) setMaxPrice(Number(bufferParams.max_price));
    else setMaxPrice(null);
  }, [bufferParams.min_price, bufferParams.max_price]);

  const formatPriceText = (min, max) => {
    if (!min && !max) return "Tất cả giá";

    const formatUnit = (value) => {
      if (value >= 1e9) return { num: value / 1e9, unit: "tỷ" };
      return { num: value / 1e6, unit: "triệu" };
    };

    const minF = min ? formatUnit(min) : null;
    const maxF = max ? formatUnit(max) : null;

    if (minF && maxF) {
      if (minF.unit === maxF.unit) {
        return `${minF.num}-${maxF.num} ${minF.unit}`;
      } else {
        return `${minF.num} ${minF.unit} - ${maxF.num} ${maxF.unit}`;
      }
    } else if (minF) {
      return `Từ ${minF.num} ${minF.unit}`;
    } else {
      return `Đến ${maxF.num} ${maxF.unit}`;
    }
  };

  const handleResetPriceFilter = () => {
    // xóa param min_price / max_price trong URL
    const params = new URLSearchParams(location.search);
    params.delete("min_price");
    params.delete("max_price");
    params.set("page", "1"); // reset về page 1 nếu cần
    navigate({ pathname: location.pathname, search: params.toString() });

    // cập nhật state áp dụng
    setApplyParams((prev) => ({
      ...prev,
      min_price: null,
      max_price: null,
      page: 1,
    }));

    // tắt collapse nếu muốn
    setCollapsePrice(false);
  };
  // ----------------- End Price Filter -----------------

  // ----------------- Acreage Filter -----------------
  const [collapseAcreage, setCollapseAcreage] = useState(false);
  const [minAcreage, setMinAcreage] = useState(0);
  const [maxAcreage, setMaxAcreage] = useState(0);

  useEffect(() => {
    if (bufferParams.min_acreage)
      setMinAcreage(Number(bufferParams.min_acreage));
    else setMinAcreage(null);
    if (bufferParams.max_acreage)
      setMaxAcreage(Number(bufferParams.max_acreage));
    else setMaxAcreage(null);
  }, [bufferParams.min_acreage, bufferParams.max_acreage]);

  const formatAcreageText = (min, max) => {
    if (!min && !max) return "Tất cả khoảng diện tích";
    if (min && max) return `Từ ${min} - đến ${max} m²`;
  };

  // ----------------- Logic dùng chung -----------------
  // Đóng dropdown khi click ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        provinceInputRef.current &&
        !provinceInputRef.current.contains(event.target)
      ) {
        setShowProvinceDropdown(false);
        setShowWardCollapse(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDynamicTitle = () => {
    // 1. Nhu cầu
    let needsText = "Mua bán";
    if (applyParams.needs === "rent") needsText = "Cho thuê";
    else if (applyParams.needs === "sell") needsText = "Mua bán";

    // 2. Category
    let categoryText = "bất động sản";
    if (applyParams.category) {
      const categoryValues = applyParams.category.split(","); // tách query string thành array
      if (
        categoryValues.length > 0 &&
        categoryValues.length < CATEGORY_OPTIONS.length
      ) {
        const labels = categoryValues
          .map(
            (val) => CATEGORY_OPTIONS.find((opt) => opt.value === val)?.label
          )
          .filter(Boolean);
        if (labels.length > 0) {
          categoryText = labels.map((label) => label.toLowerCase()).join(", ");
        }
      }
    }

    // 3. Địa chỉ & giới từ
    let addressText = "trên toàn quốc";
    let gioiTu = applyParams.needs === "rent" ? "tại" : "trên";
    if (selectedProvince && selectedWard) {
      addressText = `${selectedWard.name} ${selectedProvince.name}`;
      gioiTu = "tại";
    } else if (selectedProvince) {
      addressText = selectedProvince.name;
      gioiTu = "tại";
    }

    // 4. Kết hợp
    return `${needsText} ${categoryText} ${gioiTu} ${addressText}`;
  };

  return (
    <div className={cx("listpost_container")}>
      {loading && <Spinner />}
      <div className={cx("filter_post_container")}>
        <div className={cx("filter_post_input")} ref={provinceInputRef}>
          <Search className={cx("icon_search")} size={24} color="#777777" />
          <div
            className={cx("info_location", {
              show: selectedProvince || selectedWard,
            })}
          >
            <span
              className={cx("info_location_item")}
              onClick={() => {
                setShowProvinceDropdown(!showProvinceDropdown);
                setShowWardCollapse(false);
              }}
            >
              {selectedProvince ? selectedProvince.name : ""}
            </span>
            <div className={cx("vertical_break_line")}></div>
            <span
              className={cx("info_location_item")}
              onClick={() => {
                setShowWardCollapse(!showWardCollapse);
                setShowProvinceDropdown(false);
              }}
            >
              {selectedWard ? selectedWard.name : "Xã/phường"}
            </span>
          </div>
          <input
            className={cx("filter_input")}
            type="text"
            placeholder={selectedProvince ? "" : "Chọn tỉnh/thành"}
            onFocus={focusInput}
            readOnly
            // value={selectedProvince ? selectedProvince.name : ""}
          />
          {/* Hiển thị tỉnh đã chọn ở cuối input */}
          <button className={cx("filter_finding")} onClick={submitLocation}>
            Tìm kiếm
          </button>
          {showProvinceDropdown && (
            <div className={cx("province_dropdown")}>
              {locations.map((province) => (
                <div
                  key={province.code}
                  className={cx("province_option")}
                  onClick={() => handleSelectProvince(province)}
                >
                  {province.name}
                </div>
              ))}
            </div>
          )}
          {selectedProvince &&
            Array.isArray(selectedProvince.wards) &&
            selectedProvince.wards.length > 0 && (
              <div
                className={cx("ward_collapse", "row", {
                  show: showWardCollapse,
                })}
              >
                {selectedProvince.wards.map((ward) => (
                  <div
                    key={ward.code}
                    className={cx("ward_option", "col-3")}
                    onClick={() =>
                      handleSelectWard(ward, selectedProvince.slug)
                    }
                  >
                    {ward.name}
                  </div>
                ))}
              </div>
            )}
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
        {/* ----------------------------- Fiter needs ----------------------------- */}
        <div
          className={cx("sub_filter_item")}
          onClick={() => setCollapseNeeds(!collapseNeeds)}
        >
          <div className={cx("sub_filter_title")}>
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
                updateFilter({ needs: "rent", page: 1 });
              }}
            >
              Tìm thuê
            </div>
            <div
              className={cx("item_collapse_name")}
              onClick={() => {
                setNeedsFilter("Tìm mua");
                setCollapseNeeds(false);
                updateFilter({ needs: "sell", page: 1 });
              }}
            >
              Tìm mua
            </div>
          </div>
        </div>
        {/* ----------------------------- Fiter category ----------------------------- */}
        <div
          className={cx("sub_filter_item")}
          onClick={() => setCollapseCategory(!collapseCategory)}
        >
          <div className={cx("sub_filter_title")}>
            {(() => {
              if (categoryFilter.length === 0) return "Loại hình bất động sản";
              const labels = categoryFilter
                .filter((val) => val !== "all")
                .map(
                  (val) =>
                    CATEGORY_OPTIONS.find((opt) => opt.value === val)?.label
                )
                .filter(Boolean);
              if (
                categoryFilter.length === CATEGORY_OPTIONS.length ||
                (categoryFilter.includes("all") &&
                  categoryFilter.length === CATEGORY_OPTIONS.length)
              ) {
                return "Tất cả";
              }
              const labelStr = labels.join(", ");
              if (labelStr.length > 40) {
                return labelStr.slice(0, 40) + "...";
              }
              return labelStr;
            })()}
            <Settings2 color="#575757ff" size={24} />
          </div>
          <div
            className={cx("sub_item_collapse", { show: collapseCategory })}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={cx("item_collapse_title")}>
              Lựa chọn loại hình bất động sản bạn muốn
            </div>
            <div className={cx("break_line")}></div>
            <div>
              {/* Checkbox "Tất cả" */}
              <label className={cx("item_collapse_checkbox")}>
                <input
                  type="checkbox"
                  checked={categoryFilter.length === CATEGORY_OPTIONS.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCategoryFilter(
                        CATEGORY_OPTIONS.map((opt) => opt.value)
                      );
                    } else {
                      setCategoryFilter([]);
                    }
                  }}
                />
                Tất cả
              </label>
              {/* Các checkbox loại hình */}
              {CATEGORY_OPTIONS.map((opt) => (
                <label key={opt.value} className={cx("item_collapse_checkbox")}>
                  <input
                    type="checkbox"
                    checked={categoryFilter.includes(opt.value)}
                    onChange={(e) => {
                      let newSelected;
                      if (e.target.checked) {
                        newSelected = [...categoryFilter, opt.value];
                        // Nếu chọn hết thì tự động check "Tất cả"
                        if (newSelected.length === CATEGORY_OPTIONS.length) {
                          newSelected = CATEGORY_OPTIONS.map((o) => o.value);
                        }
                      } else {
                        newSelected = categoryFilter.filter(
                          (v) => v !== opt.value
                        );
                      }
                      setCategoryFilter([...new Set(newSelected)]);
                    }}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
            <button
              className={cx("btn_apply_category")}
              onClick={() => {
                setCollapseCategory(false);
                updateFilter({
                  category: categoryFilter.join(","),
                  page: 1,
                });
              }}
            >
              Áp dụng
            </button>
            <button
              className={cx("btn_clear_category")}
              onClick={() => {
                setCategoryFilter([]);
                setCollapseCategory(false);
                updateFilter({ category: "", page: 1 });
              }}
            >
              Xóa chọn
            </button>
          </div>
        </div>
        {/* ----------------------------- Fiter price ----------------------------- */}
        <div className={cx("sub_filter_item")}>
          <div
            className={cx("sub_filter_title")}
            onClick={() => setCollapsePrice(true)}
          >
            {formatPriceText(applyParams.min_price, applyParams.max_price)}
            <Settings2 color="#575757ff" size={24} />
          </div>
          <div className={cx("sub_item_collapse", { show: collapsePrice })}>
            <div className={cx("item_collapse_title")}>Lọc khoảng giá</div>
            <div className={cx("break_line")}></div>
            <PriceFilter
              min_price_param={minPrice}
              max_price_param={maxPrice}
              needs={applyParams.needs}
              onSubmit={({ min_price, max_price }) => {
                updateFilter({ min_price, max_price, page: 1 });

                setLoading(true);
                setTimeout(() => {
                  setCollapsePrice(false); // tắt collapse sau submit
                  setLoading(false);
                }, 1000);
              }}
              onReset={() => {
                console.log("Đã reset filter");
                setLoading(true);
                setTimeout(() => {
                  setCollapsePrice(false); // tắt collapse sau submit
                  setLoading(false);
                }, 1000);
              }}
            />
          </div>
        </div>
        {/* ----------------------------- End fiter Price ----------------------------- */}
        {/* ----------------------------- Fiter Acreage ----------------------------- */}
              <div className={cx("sub_filter_item")}>
          <div
            className={cx("sub_filter_title")}
            onClick={() => setCollapseAcreage(!collapseAcreage)}
          >
            {formatAcreageText(applyParams.min_acreage, applyParams.max_acreage)}
            <Settings2 color="#575757ff" size={24} />
          </div>
          <div className={cx("sub_item_collapse", { show: collapseAcreage })}>
            <div className={cx("item_collapse_title")}>Lọc khoảng diện tích</div>
            <div className={cx("break_line")}></div>
            <AcreageFilter
              min_acreage_param={minAcreage}
              max_acreage_param={maxAcreage}
              needs={applyParams.needs}
              onSubmit={({ min_acreage, max_acreage }) => {
                updateFilter({ min_acreage, max_acreage, page: 1 });

                setLoading(true);
                setTimeout(() => {
                  setCollapseAcreage(false); // tắt collapse sau submit
                  setLoading(false);
                }, 500);
              }}
              onReset={() => {
                handleResetPriceFilter();
                console.log("Đã reset filter");
                setLoading(true);
                setTimeout(() => {
                  setCollapseAcreage(false); // tắt collapse sau submit
                  setLoading(false);
                }, 500);
              }}
            />
          </div>
        </div>
        {/* ----------------------------- End fiter Acreage ----------------------------- */}
      </div>
      <div className={cx("break_line")}></div>
      <div className={cx("category_subtitle")}>Danh mục</div>
      <div className={cx("category_title")}>{getDynamicTitle()}</div>
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
