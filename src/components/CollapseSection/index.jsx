import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import classnames from "classnames/bind";
import styles from "./collapSection.module.scss";

const cx = classnames.bind(styles);

export default function CollapseSection({ title, children, className }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cx("collapse_section")}>
      {/* Header */}
      <button className={cx("collapse_header")} onClick={() => setOpen(!open)}>
        <span>{title}</span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {/* Content */}
      <div
        className={cx("collapse_content")}
        style={{
          maxHeight: open ? "500px" : "0",
          overflow: "hidden",
          transition: "max-height 0.3s ease",
        }}
      >
        <div className={className}>{children}</div>
      </div>
    </div>
  );
}
