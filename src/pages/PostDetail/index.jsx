import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import {
  Icon,
  Heart,
  ChevronsRight,
  Phone,
  MapPin,
  Link,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { faMap } from "@fortawesome/free-regular-svg-icons";
import { fetchApi, getCurrentUser, getEmbedUrl } from "@utils/utils";
import zalo from "@images/zalo.png";
import {
  Header,
  Footer,
  PropertyGallery,
  IconRender,
  RequireLogin,
  QuickNav,
  ScrollToTop,
} from "@components/component";
import classnames from "classnames/bind";
import styles from "./postDetail.module.scss";
import { formatUnitPrice, formatHiddenPhone } from "@utils/utils";
import avatar from "@assets/avatar_defaults/male.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
// import { faPhoneVolumn } from "@fortawesome/free-solid-svg-icons";

const cx = classnames.bind(styles);

const ContentPostDetail = () => {
  const [postData, setPostData] = useState(null);
  const [images, setImages] = useState([]);
  const [videoURL, setVideoURL] = useState(null);

  const [needs, setNeeds] = useState(null);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);

  const [price, setPrice] = useState(null);
  const [acreage, setAcreage] = useState(0);

  const [unitPrice, setUnitPrice] = useState(null);
  const [address, setAddress] = useState(null);
  const [province, setProvince] = useState(null);
  const [ward, setWard] = useState(null);

  const [properties, setProperties] = useState([]);
  const [propRender, setPropRender] = useState([]);

  const [facilities, setFacilities] = useState([]);
  const [faciRender, setFaciRender] = useState([]);

  const [userContent, setUserContent] = useState({});
  const [showRequireLogin, setShowRequireLogin] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  // Lấy data bài đăng
  useEffect(() => {
    const getDatapost = async () => {
      const url = `/post/get-post/${id}`;
      console.log("id :", id);
      const response_data = await fetchApi(url, {
        method: "get",
        skipAuth: false,
      });

      if (response_data.success) {
        console.log("data post from DB: ", response_data.data);
        setPostData(response_data.data);
        setNeeds(response_data.needs);
        setImages(response_data.data.images);
        setTitle(response_data.data.title);
        setPrice(response_data.data.price);
        setUnitPrice(response_data.data.unit_price);
        setAddress(response_data.data.address);
        setProvince(response_data.data.province);
        setWard(response_data.data.ward);
        setAcreage(response_data.data.acreage);
        setDescription(response_data.data.description);
        setProperties(response_data.data.property_components);
        setFacilities(response_data.data.facilities);
        setUserContent(response_data.data.user_content);

        setLatitude(response_data.data.latitude);
        setLongitude(response_data.data.longitude);
        return;
      } else {
        navigate("/notfound");
      }
    };

    getDatapost();
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!properties) return;

    const getProperty = async () => {
      const listId = properties.map((item) => ({
        id: item.component_id,
        quantity: item.quantity,
      }));

      console.log("listId", listId);
      const url = "/property/get-list";
      const response_data = await fetchApi(url, {
        method: "post",
        skipAuth: true,
        body: {
          listId,
        },
      });

      if (response_data.success) {
        setPropRender(response_data.data);
        console.log("property render data: ", response_data);
        return;
      } else {
        console.log("get data property failed");
        return;
      }
    };
    getProperty();
  }, [properties]);

  useEffect(() => {
    if (!facilities) return;

    const listId = facilities.map((item) => item.toString());
    const getFacility = async () => {
      const url = "/facility/get-list";
      const response_data = await fetchApi(url, {
        method: "post",
        skipAuth: true,
        body: {
          listId,
        },
      });

      if (response_data.success) {
        setFaciRender(response_data.data);
        return;
      } else {
        console.log("get data facility failed");
        return;
      }
    };

    getFacility();
  }, [facilities]);

  const handleChatZalo = () => {
    const phone = userContent.phone;
    if (!phone) {
      return;
    }

    if (!isLogin) {
      setShowRequireLogin(true);
      return;
    } else {
      setShowRequireLogin(false);
    }

    if (!showRequireLogin) setShowRequireLogin(false);

    const zaloUrl = `https://zalo.me/${phone}`;
    window.open(zaloUrl, "_blank");
  };

  const handleClickPhone = () => {
    const phone = userContent.phone;
    if (!phone) return;

    if (!isLogin) {
      setShowRequireLogin(true);
      return;
    }

    // Nếu đã login thì gọi số
    window.location.href = `tel:${phone}`;
  };

  // Logic view in map
  const [showViewMap, setShowViewMap] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const containerRef = useRef(null);

  // click ngoài map (trong view_map_container) thì setShow(false)
  const handleClickOutside = (e) => {
    // nếu click đúng vào vùng container (ngoài map) thì tắt
    if (e.target === containerRef.current) {
      setShowViewMap(false);
    }
  };

  return (
    <>
      {showViewMap && (
        <div
          className={cx("view_map_container")}
          onClick={(e) => {
            if (e.target.classList.contains(cx("view_map_container"))) {
              setShowViewMap(false);
            }
          }}
        >
          <div className={cx("map_view")}>
            <FontAwesomeIcon
            icon={faXmark}
            className={cx("close_view_map")}
            onClick={() => setShowViewMap(false)}
          />
            {latitude && longitude ? (
              <MapContainer
                center={[latitude, longitude]}
                zoom={16}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker  position={[latitude, longitude]}>
                  <Popup>{title}</Popup>
                </Marker>
              </MapContainer>
            ) : (
              <p>Không có tọa độ để hiển thị</p>
            )}
          </div>
        </div>
      )}
      <div className={cx("post_detail_container")}>
        <QuickNav
          titlePage="Tin đăng bất động sản"
          items={[
            { id: "section_info", name: "Thông tin mô tả" },
            { id: "section_property", name: "Cơ sở vật chất" },
            { id: "section_facility", name: "Cơ sở tiện ích" },
            { id: "section_video", name: "Video bất động sản" },
          ]}
        />
        <ScrollToTop />
        <div className={cx("post_detail_content")}>
          <div className={cx("post_detail_left")}>
            <PropertyGallery classname={cx("slider_img")} images={images} />
            <div className={cx("post_detailt_title_wrap")}>
              <div className={cx("post_detailt_title")}>{title}</div>
              <button className={cx("btn_view_in_map")} onClick={() => setShowViewMap(true)}>
                <FontAwesomeIcon
                  className={cx("icon_location_map")}
                  icon={faMap}
                  color="#ebb490ff"
                  fontSize="22px"
                />
                Xem trên bản đồ{" "}
              </button>
            </div>
            <div className={cx("post_detailt_address")}>{address}</div>
            <div className={cx("break_line")}></div>
            <div className={cx("post_detail_main_info")}>
              <div className={cx("post_detail_metric")}>
                <div className={cx("post_metric_item")}>
                  <div className={cx("post_metric_title")}>Mức giá</div>
                  <div className={cx("post_metric_number")}>
                    {price} {formatUnitPrice(unitPrice)}
                  </div>
                </div>
                <div className={cx("post_metric_item")}>
                  <div className={cx("post_metric_title")}>Diện tích</div>
                  <div className={cx("post_metric_number")}>
                    {acreage} m<sup>2</sup>
                  </div>
                </div>
                <div className={cx("post_metric_item")}>
                  <div className={cx("post_metric_title")}>Lượt yêu thích</div>
                  <div className={cx("post_metric_number")}>43</div>
                </div>
                <div className={cx("post_metric_item")}>
                  <div className={cx("post_metric_title")}>Lượt xem</div>
                  <div className={cx("post_metric_number")}>200</div>
                </div>
              </div>
              <div className={cx("post_detail_evaluate")}>
                <Link color="#333" size={24} />
                <AlertTriangle color="#333" size={24} />
                <Heart color="#333" size={24} />
              </div>
            </div>
            <div className={cx("break_line")}></div>
            <div id="section_info" className={cx("post_detail_section")}>
              <div className={cx("post_detail_title")}>
                <ChevronsRight color="#777777" size={24} />
                Thông tin bất động sản
              </div>
              <div className={cx("post_detail_desc")}>{description}</div>
            </div>
            <div className={cx("break_line")}></div>
            <div id="section_property" className={cx("post_detail_section")}>
              <div className={cx("post_detail_title")}>
                <ChevronsRight color="#777777" size={24} />
                Cơ sở vật chất
              </div>
              <div className={cx("post_component_wrap", "row")}>
                <div className={cx("post_component_item_wrap", "col-4")}>
                  <IconRender
                    className={cx("icon_component")}
                    name="DollarSign"
                    size={20}
                    color="#4d4d4dff"
                  />
                  <div className={cx("post_component_item_name")}>Mức giá</div>
                  <div className={cx("post_component_item_num")}>
                    {price} {formatUnitPrice(unitPrice)}
                  </div>
                </div>
                <div className={cx("post_component_item_wrap", "col-4")}>
                  <IconRender
                    className={cx("icon_component")}
                    name="Square"
                    size={20}
                    color="#4d4d4dff"
                  />
                  <div className={cx("post_component_item_name")}>
                    Diện tích
                  </div>
                  <div className={cx("post_component_item_num")}>
                    {acreage}m<sup>2</sup>
                  </div>
                </div>
                {propRender.map((item, index) => (
                  <div
                    key={index}
                    className={cx("post_component_item_wrap", "col-4")}
                  >
                    <IconRender
                      className={cx("icon_component")}
                      name={item.icon}
                      size={20}
                      color="#4d4d4dff"
                    />
                    <div className={cx("post_component_item_name")}>
                      {item.name}
                    </div>
                    <div className={cx("post_component_item_num")}>
                      {item.quantity} Phòng
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div id="section_facility" className={cx("post_detail_section")}>
              <div className={cx("post_detail_title")}>
                <ChevronsRight color="#777777" size={24} />
                Cơ sở tiện ích
              </div>
              <div className={cx("post_component_wrap", "facility", "row")}>
                {faciRender.map((item, index) => (
                  <div
                    key={index}
                    className={cx("post_component_item_wrap", "col-4")}
                  >
                    <IconRender
                      className={cx("icon_component")}
                      name={item.icon}
                      size={20}
                      color="#4d4d4dff"
                    />
                    <div className={cx("post_component_item_name")}>
                      {item.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div id="section_video" className={cx("post_detail_section")}>
              <div className={cx("post_detail_title")}>
                <ChevronsRight color="#777777" size={24} />
                Video bất động sản
                <div className={cx("iframe_wrap")}>
                  <iframe
                    className={cx("iframe_video")}
                    src="https://www.youtube.com/embed/PqGY5WBUhq4"
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={cx("post_detail_right")}>
            <div className={cx("post_detail_wrap_owner")}>
              <div className={cx("post_detail_member")}>Thành viên mới</div>
              <div className={cx("post_detail_onwner")}>
                <div className={cx("post_detail_owner_avatar")}>
                  <img className={cx("owner_avatar")} src={avatar} alt="" />
                </div>
                <div className={cx("onwer_name")}>{userContent.fullname}</div>
                <div className={cx("owner_email")}>{userContent.email}</div>
                <div className={cx("owner_subinfo")}>
                  <div className={cx("owner_subinfo_content")}>
                    <div className={cx("owner_subinfo_title")}>
                      Tham gia HomePro
                    </div>
                    <div className={cx("owner_subinfo_metric")}>1 tháng</div>
                  </div>
                  <div className={cx("subinfo_break")}></div>
                  <div className={cx("owner_subinfo_content")}>
                    <div className={cx("owner_subinfo_title")}>
                      Tin đăng hiện có
                    </div>
                    <div className={cx("owner_subinfo_metric")}>20</div>
                  </div>
                </div>
                <div className={cx("owner_concern")}>
                  <Heart className={cx("icon_heart")} size={24} color="red" />
                  <div className={cx("owner_concern_content")}>
                    Có 33 lượt yêu thích bài viết và 420 lượt xem bài đăng.
                  </div>
                </div>
                <div className={cx("owner_personal")}>
                  <div className={cx("owner_personal_redirect")}>
                    Xem trang cá nhân
                  </div>
                  <ChevronsRight
                    className={cx("icon_arror")}
                    size={24}
                    color="#555555ff"
                  />
                </div>
                <div className={cx("break_line")}></div>
                <button
                  className={cx("btn_chat_zalo")}
                  onClick={handleChatZalo}
                >
                  <img className={cx("logo_zalo")} src={zalo} alt="" />
                  Chat qua Zalo
                </button>
                <button
                  className={cx("post_detail_owner_phone")}
                  onClick={handleClickPhone}
                >
                  <Phone className={cx("icon_phone")} size={24} color="#fff" />
                  {isLogin
                    ? userContent.phone
                    : formatHiddenPhone(userContent.phone)}
                  . Hiện số
                </button>
              </div>
            </div>
          </div>

          <RequireLogin
            open={showRequireLogin}
            onClose={() => setShowRequireLogin(false)}
            onLogin={() => {
              setShowRequireLogin(false);
              navigate("/login");
            }}
          />
        </div>
      </div>
    </>
  );
};

const PostDetail = () => {
  return (
    <>
      <Header />
      <ContentPostDetail />
      {/* <Footer /> */}
    </>
  );
};
export default PostDetail;
