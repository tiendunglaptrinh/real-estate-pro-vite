import React, { useState } from "react";
import { ChevronsRight, Dot } from "lucide-react";
import classNames from "classnames/bind";
import styles from "./quickNav.module.scss";

const cx = classNames.bind(styles);

const QuickNav = ({ titlePage, items = [], offset = 120 }) => {
  const [open, setOpen] = useState(false);

  const handleScroll = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setOpen(false);
    }
  };

  return (
    <div className={cx("quick_nav_wrap", { open })}>
      <div
        className={cx("quick_nav_toggle")}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <span className={cx("arrow_run")}>
          <span>&gt;</span>
        </span>
      </div>

      <div
        className={cx("quick_nav_list", { open })}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {titlePage && <div className={cx("quick_nav_title")}>{titlePage}</div>}
        {items.map((item, index) => (
          <button
            key={index}
            className={cx("quick_nav_item")}
            onClick={() => handleScroll(item.id)}
          >
            <Dot color="#333" size={20} />
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickNav;
