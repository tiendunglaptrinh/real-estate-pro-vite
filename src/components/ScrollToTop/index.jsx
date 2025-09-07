import classnames from "classnames/bind";
import styles from "./scrollToTop.module.scss";
import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

const cx = classnames.bind(styles);

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  // Theo dõi vị trí scroll
  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cuộn lên đầu trang
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={cx("scroll_top_container", {
        show: visible,
      })}
    >
      <button className={cx("btn_scroll_top")} onClick={handleScrollTop}>
        <ChevronUp className={cx("icon_scroll")} size={24} color="#fff" />
      </button>
    </div>
  );
}

export default ScrollToTop;
