import classnames from "classnames/bind";
import styles from "./pagination.module.scss";
import { ChevronLeft, ChevronRight } from "lucide-react";

const cx = classnames.bind(styles);

const PaginationComponent = ({ totalPage, functionClick, currentPage, totalItems }) => {
  // Ẩn pagination nếu không có dữ liệu
  if (totalItems === 0) return null;

  const pages = Array.from({ length: totalPage }, (_, i) => i + 1);

  return (
    <div className={cx("pagination_container")}>
      {/* Previous */}
      {currentPage > 1 && (
        <button
          className={cx("previous")}
          onClick={() => functionClick(currentPage - 1)}
        >
          <ChevronLeft className={cx("icon_route")} />
        </button>
      )}

      {/* Danh sách số trang */}
      {pages.map((page) => (
        <button
          key={page}
          className={cx("page_item", { active: page === currentPage })}
          onClick={() => functionClick(page)}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      {currentPage < totalPage && (
        <button
          className={cx("next")}
          onClick={() => functionClick(currentPage + 1)}
        >
          <ChevronRight className={cx("icon_route")} />
        </button>
      )}
    </div>
  );
};


export default PaginationComponent;
