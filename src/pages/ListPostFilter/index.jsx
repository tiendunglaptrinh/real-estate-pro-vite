import { useState, useEffect } from "react";
import classnames from "classnames/bind";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./ListPostFilter.module.scss";
import { Header, Footer } from "@components/components";
import { fetchApi } from "@utils/utils";

const cx = classnames.bind(styles);

const ContentListPostFilter = () => {
  const [searchParams] = useSearchParams();
  const [totalPage, setTotalPage] = useState(0);
  const [currentIndexPage, setCurrentIndexPage] = useState(0);
  const [countPost, setCountPost] = useState(0);
  const [listPost, setListPost] = useState([]);

  const needs_param = searchParams.get("needs");
  const type_param = searchParams.get("type");
  const province_param = searchParams.get("province");
  const ward_param = searchParams.get("ward");
  const min_price_param = searchParams.get("min_price");
  const max_price_param = searchParams.get("max_price");
  const min_acreage_param = searchParams.get("min_acreage");
  const max_acreage_param = searchParams.get("max_acreage");

  const handleLoadListPostByParam = async () => {
    const url = "/post/get-posts";

    const response_data = await fetchApi(url, {
      method: "get",
      skipAuth: true,
      params: {
        needs: needs_param,
        type: type_param,
        province: province_param,
        ward: ward_param,
        min_price: min_price_param,
        max_price: max_price_param,
        min_acreage: min_acreage_param,
        max_acreage: max_acreage_param,
      },
    });

    if (response_data.success) {
      setListPost(response_data.data_posts);
      setTotalPage(response_data.total_pages);
      setCurrentIndexPage(response_data.current_index_page);
      setCountPost(response_data.count_post_in_page);

      console.log("list get from DB: ", response_data.data_posts);
    } else {
      console.log("get post error");
    }
  };

  return <div className={cx("listpost_container")}></div>;
};

const ListPostFilter = () => {
  return (
    <>
      <Header />
      <ContentListPostFilter />
      <Footer />
    </>
  );
};

export default ListPostFilter;
