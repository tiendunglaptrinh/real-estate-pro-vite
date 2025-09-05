import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import classnames from "classnames/bind";
import styles from "./propertyGallery.module.scss";

const cx = classnames.bind(styles);

const PropertyGallery = ({ images }) => {
  const [current, setCurrent] = useState(0);
  const [thumbSwiper, setThumbSwiper] = useState(null);

  // Auto slide mỗi 3 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Khi current thay đổi → scroll thumbnail đến đúng vị trí
  useEffect(() => {
    if (thumbSwiper) {
      thumbSwiper.slideTo(current);
    }
  }, [current, thumbSwiper]);

  return (
    <div className={cx("property_gallery_container")}>
      <div className={cx("property_gallery_subitem")}>
        <Swiper
          direction="vertical"
          slidesPerView={4}
          spaceBetween={10}
          className={cx("property_gallery_wrap_Swipper")}
          onSwiper={setThumbSwiper}
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx} className={cx("property_gallery_wrap_SwipperSlide")}>
              <img
                src={img}
                alt={`thumb-${idx}`}
                onClick={() => setCurrent(idx)}
                className={cx("property_gallery_img", {
                  active: current === idx,
                })}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Ảnh chính */}
      <div className={cx("property_gallery_mainitem")}>
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={images[current]}
            alt="main"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className={cx("property_gallery_main_img")}
          />
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PropertyGallery;
