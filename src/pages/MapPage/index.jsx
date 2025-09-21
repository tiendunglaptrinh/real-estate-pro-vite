import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import classnames from "classnames/bind";
import styles from "./map.module.scss";
import L from "leaflet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faXmark, faSliders, faArrowRotateRight } from "@fortawesome/free-solid-svg-icons";
import { faBuilding, faMap,  } from "@fortawesome/free-regular-svg-icons";
import { ChevronLeft } from "lucide-react";

import { Header } from "@components/component";
import { fetchApi } from "@utils/utils";
import streetmap from "@images/streetmap.jpg";
import satellitemap from "@images/satellitemap.jpg";

// Tooltip
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const cx = classnames.bind(styles);

const MapPage = () => {
  const [listPost, setListPost] = useState([]);
  const [activeMap, setActiveMap] = useState("street");
  const [showMapFilter, setShowMapFilter] = useState(false);
  const [showListPostFilter, setShowListPostFilter] = useState(true);

  // filter
  const [needsFilter, setNeedsFilter] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("");
  const [wardFilter, setWardFilter] = useState("");
  const [minPriceFilter, setMinPriceFilter] = useState(null);
  const [maxPriceFilter, setMaxPriceFilter] = useState(null);
  const [minAcreage, setMinAcreage] = useState(null);
  const [maxAcreage, setMaxAcreage] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState([]);

  useEffect(() => {
    const getListPost = async () => {
      const url = "/post/get-posts";
      const response_data = await fetchApi(url, { method: "get" });
      if (response_data.success) {
        setListPost(response_data.data_posts);
      }
    };
    getListPost();
  }, []);

  return (
    <>
      <Header />
      <div className={cx("page_container")}>
        {/* Left Sidebar */}
        <div className={cx("left_sidebar")}>
          <div className={cx("quick_nav")}>
            <div
              className={cx("wrap_icon")}
              data-tooltip-id="mapTooltip"
              data-tooltip-content="Chuyển đổi bản đồ"
              onClick={() => setShowMapFilter(!showMapFilter)}
            >
              <FontAwesomeIcon className={cx("icon_tooltip")} icon={faMap} />
            </div>
            <div
              className={cx("wrap_icon")}
              data-tooltip-id="listTooltip"
              data-tooltip-content="Danh sách bài đăng"
              onClick={() => setShowListPostFilter(!showListPostFilter)}
            >
              <FontAwesomeIcon
                className={cx("icon_tooltip")}
                icon={faBuilding}
              />
            </div>

            {/* Tooltips */}
            <Tooltip id="mapTooltip" place="top" effect="solid" />
            <Tooltip id="listTooltip" place="top" effect="solid" />
          </div>

          <div
            className={cx("list_post_container", { show: showListPostFilter })}
          >
            <div className={cx("list_post_title")}>
              Danh mục tin đăng
              <ChevronLeft
                className={cx("icon_close")}
                onClick={() => setShowListPostFilter(false)}
              />
            </div>
            <div className={cx("list_post_filter")}>
              <div className={cx("show_filter")}>
                <FontAwesomeIcon icon={faSliders} />
                Bộ lọc
                <FontAwesomeIcon className={cx("icon_reload")} icon={faArrowRotateRight} />
                <div className={cx("popup_filter_container")}>
                  <h2 className={cx("popup_filter_title")}>Bộ lọc</h2>
                  <div className={cx("filter_item_title")}>Lựa chọn nhu cầu</div>
                  <div className={cx("filter_type_wrap")}>
                    <button className={cx("filter_type_item", {choosing: needsFilter == "sell"})} onClick={() => setNeedsFilter("sell")}>Tìm mua</button>
                    <button className={cx("filter_type_item", {choosing: needsFilter == "rent"})} onClick={() => setNeedsFilter("rent")}>Tìm thuê</button>
                  </div>
                  <div className={cx("")}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className={cx("right_sidebar", { show: showMapFilter })}>
          <div className={cx("map_title")}>
            Chuyển đổi bản đồ
            <FontAwesomeIcon
              className={cx("close_map_filter")}
              icon={faXmark}
              onClick={() => setShowMapFilter(false)}
            />
          </div>
          <div
            className={cx("item_map", { active: activeMap === "street" })}
            onClick={() => setActiveMap("street")}
          >
            <div className={cx("overlay_map_item")}></div>
            <img className={cx("img_map")} src={streetmap} alt="" />
            <div className={cx("tag_map")}>Bản đồ đường</div>
          </div>
          <div
            className={cx("item_map", { active: activeMap === "satellite" })}
            onClick={() => setActiveMap("satellite")}
          >
            <div className={cx("overlay_map_item")}></div>
            <img className={cx("img_map")} src={satellitemap} alt="" />
            <div className={cx("tag_map")}>Bản đồ vệ tinh</div>
          </div>
        </div>

        {/* Map */}
        <MapContainer
          className={cx("map_container")}
          center={[16.047079, 108.20623]}
          zoom={10}
        >
          {activeMap === "street" && (
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          )}

          {activeMap === "satellite" && (
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles © Esri"
            />
          )}

          {listPost.map((post) => (
            <Marker
              key={post._id}
              position={[post.latitude, post.longitude]}
              icon={L.divIcon({
                className: "custom-pin",
                html: `
                  <div class="pin">
                    <i class="fa-solid fa-house icon_marker"></i>
                  </div>
                `,
                iconSize: [40, 50],
                iconAnchor: [20, 50], // đáy nhọn chạm tọa độ
                popupAnchor: [0, -45],
              })}
            >
              <Popup>{post.title}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </>
  );
};

export default MapPage;
