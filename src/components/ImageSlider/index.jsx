import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay, Pagination } from "swiper/modules";

// Import style mặc định của Swiper
import "swiper/css";
import "swiper/css/effect-coverflow";

const ImageSlider = ({
  arrayImages = [],
  className,
  classImage,
  widthIm = "300px",
  heightIm = "200px",
  numSlider = 1,
}) => {
  return (
    <Swiper
      effect="coverflow"
      grabCursor
      centeredSlides
      slidesPerView={numSlider}
      spaceBetween={20}
      slideToClickedSlide={true}
      loop={true}
      breakpoints={{
        320: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 2 },
      }}
      coverflowEffect={{
        rotate: 0, // Không xoay (có thể chỉnh nếu muốn nghiêng nhẹ)
        stretch: 0,
        depth: 200, // Tạo chiều sâu
        modifier: 1.5, // Tăng hiệu ứng
        slideShadows: false,
        scale: 0.8, // Cho 2 bên nhỏ hơn
      }}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      speed={800}
      pagination={{ clickable: true }}
      modules={[EffectCoverflow, Autoplay, Pagination]}
      className={className}
    >
      {arrayImages.map((src, index) => (
        <SwiperSlide
          key={index}
          style={{
            width: widthIm,
            height: heightIm,
            overflow: "hidden",
            borderRadius: "16px",
          }}
          className={classImage}
        >
          <img
            src={src}
            alt={`slide-${index}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ImageSlider;
