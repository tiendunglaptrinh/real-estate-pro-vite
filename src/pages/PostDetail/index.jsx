import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { fetchApi } from "@utils/utils";
import { Header, Footer, PropertyGallery, IconRender } from "@components/component";
import classnames from "classnames/bind";
import styles from "./postDetail.module.scss";
import { Icon } from "lucide-react";
import { formatUnitPrice } from "@utils/utils";

const cx = classnames.bind(styles);

const ContentPostDetail = () => {
  const [postData, setPostData] = useState(null);
  const [images, setImages] = useState([]);
  const [videoURL, setVideoURL] = useState(null);

  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);

  const [price, setPrice] = useState(null);
  const [acreage, setAcreage] = useState(0);

  const [unitPrice, setUnitPrice] = useState(null);
  const [address, setAddress] = useState(null);
  const [province, setProvince] = useState(null);
  const [ward, setWard] = useState(null);

  const [properties, setProperties] = useState([]);
  const [propRender, setPropRender] = useState([]);

  const [facilities, setFacilities] = useState([]);
  const [faciRender, setFaciRender] = useState([]);

  const [userContent, setUserContent] = useState({});

  const navigate = useNavigate();
  const { id } = useParams();

  // Lấy data bài đăng
  useEffect(() => {
    const getDatapost = async () => {
      const url = `/post/get-post/${id}`;
      console.log("id :", id);
      const response_data = await fetchApi(url, {
        method: "get",
        skipAuth: false,
      });

      if (response_data.success) {
        console.log("data post from DB: ", response_data.data);
        setPostData(response_data.data);
        setImages(response_data.data.images);
        setTitle(response_data.data.title);
        setPrice(response_data.data.price);
        setUnitPrice(response_data.data.unit_price);
        setAddress(response_data.data.address);
        setProvince(response_data.data.province);
        setWard(response_data.data.ward);
        setAcreage(response_data.data.acreage);
        setDescription(response_data.data.description);
        setProperties(response_data.data.property_components);
        setFacilities(response_data.data.facilities);
        setUserContent(response_data.data.user_content);
        return;
      } else {
        navigate("/notfound");
      }
    };

    getDatapost();
  }, []);

  useEffect(() => {
    if (!properties) return;
    const listId = properties.map((item) => item.component_id);

    const getProperty = async () => {
      const url = "/property/get-list";
      const response_data = await fetchApi(url, {
        method: "post",
        skipAuth: true,
        body: {
          listId,
        },
      });

      if (response_data.success) {
        setPropRender(response_data.data);
        console.log("property render data: ", response_data);
        return;
      } else {
        console.log("get data property failed");
        return;
      }
    };
    getProperty();
  }, [properties]);

  useEffect(() => {
    if (!facilities) return;

    const listId = facilities.map((item) => item.toString());
    const getFacility = async () => {
      const url = "/facility/get-list";
      const response_data = await fetchApi(url, {
        method: "post",
        skipAuth: true,
        body: {
          listId,
        },
      });

      if (response_data.success) {
        setFaciRender(response_data.data);
        return;
      } else {
        console.log("get data facility failed");
        return;
      }
    };

    getFacility();
  }, [facilities]);
  return (
    <div className={cx("post_detail_container")}>
      <div className={cx("post_detail_content")}>
        <PropertyGallery classname={cx("slider_img")} images={images} />

        <div className={cx("post_detail_title")}>{title}</div>

        <div className={cx("post_detail_description")}>{description}</div>

        <div className={cx("post_detail_unitprice")}>
          {formatUnitPrice(unitPrice)}, {typeof unitPrice}
        </div>

        <div className={cx("post_detail_acreage")}>Diện tích: {acreage}</div>

        <div className={cx("post_detail_address")}>Địa chỉ: {address}</div>

        <div className={cx("post_detail_province")}>tỉnh: {province}</div>

        <div className={cx("post_detail_ward")}>phường/xã: {ward}</div>
        {propRender.map((p, index) => (
          <div key={index} className={cx("property_item_wrap")}>
            <p>name: {p.name}</p>
            <p>icon: {p.icon}</p>
          </div>
        ))}
        {faciRender.map((f, index) => (
          <div key={index} className={cx("property_item_wrap")}>
            <p>name: {f.name}</p>
            <p>{f.icon}</p>
            <IconRender name={f.icon} size={24} color="#333" />
            {/* <IconRender /> */}
          </div>
        ))}

        <div className={cx("post_detail_user_name")}>
          {userContent.fullname}
        </div>
        <div className={cx("post_detail_user_email")}>{userContent.email}</div>
        <div className={cx("post_detail_user_phone")}>{userContent.phone}</div>
      </div>
    </div>
  );
};

const PostDetail = () => {
  return (
    <>
      <Header />
      <ContentPostDetail />
      {/* <Footer /> */}
    </>
  );
};
export default PostDetail;
