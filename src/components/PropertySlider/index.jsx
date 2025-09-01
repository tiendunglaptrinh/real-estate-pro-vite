// src/components/PropertySlider/index.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules"; // 👈 Thêm Autoplay
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import classnames from "classnames/bind";
import styles from "./slider.module.scss";

const cx = classnames.bind(styles);

const PropertySlider = ({ images = [], className, loop = true }) => {
  return (
    <div className={className}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]} // 👈 Thêm vào đây
        navigation
        pagination={{ clickable: true }}
        spaceBetween={10}
        slidesPerView={1}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        loop={loop}
        className={cx("swipper_container")}
      >
        {images.map((img, index) => (
          <SwiperSlide key={index} className={cx("swiper_item")}>
            <img
              src={img}
              alt={`Property ${index + 1}`}
              className={cx("image_slider")}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PropertySlider;
