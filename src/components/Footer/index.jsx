import React from "react";
import classNames from "classnames/bind";
import style from "./Footer.module.scss";
import nameLogo from "@images/nameLogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhoneVolume } from "@fortawesome/free-solid-svg-icons";
import facebook from "@images/facebook.png";
import zalo from "@images/zalo.png";
import youtube from "@images/youtube.png";
import ggplay from "@images/ggplay.png";
import appstore from "@images/appstore.png";

const cx = classNames.bind(style);

function Footer() {
  return (
    <div className={cx("wrapper_footer")}>
      <img className={cx("name_logo")} src={nameLogo} alt="name logo" />
      <div className={cx("row", "content_footer")}>
        <div className={cx("general_info", "col")}>
          <div className={cx("title_info")}>THÔNG TIN CHUNG</div>
          <div className={cx("phone_info")}>
            <FontAwesomeIcon
              style={{ color: "#fff", fontSize: "18px" }}
              icon={faPhoneVolume}
            />
            <div className={cx("phone", "info_text")}>0378515369</div>
          </div>
          <div className={cx("email_info")}>
            <FontAwesomeIcon
              style={{ color: "#fff", fontSize: "18px" }}
              icon={faEnvelope}
            />
            <div className={cx("email", "info_text")}>
              tanguyentiendung@gmail.com
            </div>
          </div>
          <div className={cx("adress_info")}>
            <FontAwesomeIcon
              style={{ color: "#fff", fontSize: "18px" }}
              icon={faEnvelope}
            />
            <div className={cx("address", "info_text")}>
              Trường Đại học Bách khoa Hồ Chí Minh, cơ sở Dĩ An
            </div>
          </div>
          <div className={cx("app_info")}>
            <div className={cx("ggplay")}>
              <img className={cx("icon_footer")} src={ggplay} alt="" />
              <div className={cx("app_name")}>Google Play</div>
            </div>
            <div className={cx("appstore")}>
              <img className={cx("icon_footer")} src={appstore} alt="" />
              <div className={cx("app_name")}>Appstore</div>
            </div>
          </div>
        </div>
        <div className={cx("explore", "col")}>
          <div className={cx("title_info")}>KHÁM PHÁ BẤT ĐỘNG SẢN</div>
          <div className={cx("info_text")}>Bán đất nền bất động sản</div>
          <div className={cx("info_text")}>Bán chung cư bất động sản</div>
          <div className={cx("info_text")}>Bán nhà riêng bất động sản</div>
          <div className={cx("info_text")}>Cho thuê đất nền bất động sản</div>
          <div className={cx("info_text")}>Cho thuê chung cư bất động sản</div>
          <div className={cx("info_text")}>Cho thuê đất nền bất động sản</div>
        </div>
        <div className={cx("connect_link", "col")}>
          <div className={cx("title_info")}>LIÊN KẾT KHÁC</div>
          <div className={cx("link_img")}>
            <img src={facebook} alt="" />
            <img src={zalo} alt="" />
            <img src={youtube} alt="" />
          </div>
        </div>
      </div>
      <div className={cx('copyright')}>Copyright © 2024 Bản quyền thuộc về đội ngũ phát triển trang website Homepro.</div>
    </div>
  );
}

export default Footer;
