import { useState, useEffect, useRef, useCallback } from "react";
import classnames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import LayoutStatus from "@layouts/LayoutStatus/LayoutStatus";
import styles from "./homehub.module.scss";
import { fetchApi } from "@utils/utils";
import avatar from "@assets/avatar_defaults/male.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faXmark,
  faImage,
  faLink,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { AlertTriangle, MessageSquareMore, Heart } from "lucide-react";
import { HintTooltip, Error, Spinner, Success } from "@components/component";

const cx = classnames.bind(styles);

const HomeHubContent = () => {
  const [listStatusPost, setListStatusPost] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [listProvince, setListProvince] = useState([]);
  const [dataUser, setDataUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const getDataUser = async () => {
      const url = "";
      const response_data = await fetchApi(url, {
        method: "get",
        skipAuth: false,
      });

      if (response_data.success) {
        setDataUser(response_data.data);
        return;
      } else {
        return;
      }
    };
  }, []);

  const fetchStatuses = async (page) => {
    if (loading || !hasMore) return; // ✅ chặn gọi thừa
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const res = await fetchApi(`/status/get-lists?page=${page}&limit=5`, {
      method: "get",
      skipAuth: false,
    });

    if (res.success) {
      setListStatusPost((prev) => [...prev, ...res.data]);
      setHasMore(res.hasMore);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchStatuses(1);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 100 &&
        !loading &&
        hasMore
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  useEffect(() => {
    if (page > 1) {
      fetchStatuses(page);
    }
  }, [page]);

  useEffect(() => {
    const getListProvince = async () => {
      const url = "/location/provinces";
      const response_data = await fetchApi(url, {
        method: "get",
        skipAuth: false,
      });

      if (response_data.success) {
        setListProvince(response_data.data);
        return;
      }
    };
    getListProvince();
  }, []);

  // Logic post new status
  const [showPostForm, setShowPostForm] = useState(false);
  const [content, setContent] = useState("");
  const [mean, setMean] = useState("");
  const [previewImg, setPreviewImg] = useState("");
  const [provinceChoose, setProvinceChoose] = useState("");
  const [inputLink, setInputLink] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Dùng FileReader để chuyển file → base64 preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImg(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Xóa ảnh
  const handleRemoveImage = () => {
    setPreviewImg("");
    // reset input file để chọn lại cùng ảnh được
    const input = document.getElementById("btn_upload");
    if (input) input.value = "";
  };

  const uploadImageToCloudinary = async (base64Image) => {
    try {
      const formData = new FormData();
      formData.append("file", base64Image);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_NAME
      );

      const cloudName = import.meta.env.VITE_CLOUDINARY_NAME;
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error("Upload thất bại!");
      }
    } catch (err) {
      console.error("❌ Lỗi upload Cloudinary:", err);
      return "";
    }
  };
  const handleSubmit = async () => {
    setLoading(true);
    if (!content.trim()) {
      alert("Vui lòng nhập nội dung hoặc chọn ảnh trước khi đăng!");
      return;
    }

    let imageUrl = "";
    if (previewImg) {
      imageUrl = await uploadImageToCloudinary(previewImg);
    }

    const body = {
      content,
      mean: mean || "shared",
      image: imageUrl,
      province: provinceChoose || "",
      linked_post: inputLink || "",
    };

    const response_data = await fetchApi("/status/create-status", {
      method: "post",
      body,
      skipAuth: false,
    });

    if (response_data.success) {
      setTimeout(() => {
        setLoading(false);
        setShowPostForm(false);
        setContent("");
        setInputLink("");
        setProvinceChoose("");
        setMean("");
        setPreviewImg("");
        setSuccess(true);
      }, 1000);
    } else {
      setLoading(false);
      return;
    }
    setTimeout(() => {
      setSuccess(false);
      location.reload();
    }, 3000);
  };

  return (
    <>
      {loading && <Spinner />}
      {success && <Success />}
      <div className={cx("wrapper_newpost", { show: showPostForm })}>
        <div className={cx("newpost_form")}>
          <div className={cx("title_newpost")}>
            Tạo bài viết
            <FontAwesomeIcon
              onClick={() => setShowPostForm(false)}
              className={cx("icon_close_form")}
              icon={faXmark}
            />
          </div>
          <div className={cx("break_line", "newpost")}></div>
          <div className={cx("info_newpost")}>
            <img className={cx("avatar_newpost")} src={avatar} alt="" />
            <div className={cx("name_post")}>Tạ Nguyễn Tiến Dũng</div>
            <select
              className={cx("select_position")}
              value={provinceChoose}
              onChange={(e) => setProvinceChoose(e.target.value)}
            >
              <option value="">-- Khu vực quan tâm --</option>
              {listProvince.map((province, index) => (
                <option key={index} value={province.name}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>
          <div className={cx("post_content")}>
            <textarea
              value={content} // thêm dòng này để binding 2 chiều
              onChange={(e) => setContent(e.target.value)}
              className={cx("input_content")}
              placeholder="Bạn đang muốn đăng gì hôm nay"
            />

            <select
              className={cx("select_need")}
              name=""
              id=""
              value={mean}
              onChange={(e) => setMean(e.target.value)}
            >
              <option value="">Nhu cầu của bạn</option>
              <option value="shared">Chia sẻ kết nối</option>
              <option value="find">Tìm kiếm thông tin</option>
              <option value="post">Quảng cáo</option>
            </select>
            <label className={cx("label_image")} htmlFor="btn_upload">
              Đính kèm ảnh vào bài đăng
              <FontAwesomeIcon className={cx("icon_image")} icon={faImage} />
            </label>
            <div className={cx("preview_img", { show: previewImg !== "" })}>
              {previewImg && (
                <>
                  <FontAwesomeIcon
                    icon={faXmark}
                    onClick={handleRemoveImage}
                    className={cx("btn_remove_img")}
                  />
                  <img
                    className={cx("img_review")}
                    src={previewImg}
                    alt="preview"
                  />
                </>
              )}
            </div>
            <div className={cx("attach_link")}>
              <HintTooltip
                id="tool-tip-link"
                message="Copy và dán đường dẫn một bài đăng trong HomePro nếu bạn muốn sử dụng tính năng này."
                heightIcon="50px"
                widthIcon="50px"
                className={cx("tooltip_link")}
              />
              <FontAwesomeIcon className={cx("icon_link")} icon={faLink} />
              <div className={cx("link_title")}>Đường dẫn</div>
              <input
                value={inputLink}
                onChange={(e) => setInputLink(e.target.value)}
                className={cx("input_link")}
                type="text"
              />
            </div>
            <input
              className={cx("btn_upload")}
              id="btn_upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <button onClick={handleSubmit} className={cx("btn_post")}>
              Đăng bài
            </button>
          </div>
        </div>
      </div>
      <div className={cx("homehub_container")}>
        <div
          className={cx("post_status_container")}
          onClick={() => setShowPostForm(true)}
        >
          <img className={cx("avatar_status")} src={avatar} alt="" />
          <button className={cx("btn_post_status")}>
            <FontAwesomeIcon className={cx("icon_plus_status")} icon={faPlus} />{" "}
            Hôm nay bạn muốn đăng gì?
          </button>
        </div>
        <div className={cx("break_line")}></div>
        <div className={cx("choose_topic")}>Chủ đề</div>
        <div className={cx("topic_wrap")}>
          <div className={cx("item_topic")}>Chia sẻ, kết nối</div>
          <div className={cx("item_topic")}>Tìm kiếm thông tin</div>
          <div className={cx("item_topic")}>Quảng cáo</div>
        </div>
        <div className={cx("wrapper_list_post")}>
          {listStatusPost.map((status, index) => (
            <div key={index} className={cx("status_item_wrap")}>
              <div className={cx("info_user_post")}>
                <img className={cx("avatar_user_post")} src={avatar} alt="" />
                <div className={cx("info_post")}>
                  <p className={cx("name_user_post")}>Tạ Nguyễn Tiến Dũng</p>
                  <p className={cx("timepost")}>Đăng hôm nay</p>
                </div>
              </div>
              <div className={cx("wrap_content")}>{status.content}</div>
              {status.image && (
                <div className={cx("img_post_wrap")}>
                  <img className={cx("img_post")} src={status.image} alt="" />
                </div>
              )}
              <div className={cx("wrapper_option")}>
                <div className={cx("like_option")}>
                  <Heart className={cx("icon_single_post")} />
                  <p className={cx("num_like")}>{status.num_like}</p>
                </div>

                <div className={cx("like_option")}>
                  <MessageSquareMore className={cx("icon_single_post")} />
                </div>
                <div className={cx("like_option")}>
                  <AlertTriangle className={cx("icon_single_post")} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const HomeHub = () => {
  return (
    <LayoutStatus>
      <HomeHubContent />
    </LayoutStatus>
  );
};

export default HomeHub;
