// ----------- GLOBAL ---------------
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faPlus,
  faCheck,
  faCoins,
  faK,
  faArrowRight,
  faHouse,
  faCreditCard,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";

import { faPaypal } from '@fortawesome/free-brands-svg-icons';
import L from "leaflet";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// ----------- LOCAL -----------------
import { Button, TransitionPage, Header, Spinner, MarkerAddress, Error, HintTooltip, Success, CustomDatePicker, PropertySlider, PaymentPaypal, SpinnerComponent} from "@components/component";
import { fetchApi, getEmbedUrl, scrollToField } from "@utils/utils";
import rent from "@images/rent.png";
import sell from "@images/sell.png";
import sell_white from "@images/sell_white.png";
import rent_white from "@images/rent_white.png";
import upload from "@images/upload.png";
import style from "./NewPost.module.scss";

const cx = classNames.bind(style);

const ContentNewPost = () => {
  // ------------------- General logic --------------------
  const [step1, setStep1] = useState(true);
  const [step2, setStep2] = useState(false);
  const [step3, setStep3] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [idScroll, setIdScroll] = useState("");
  const [showPopupErr, setShowPopupErr] = useState(false);

  // Message tooltip
  const messageTooltip = {
    needs: "Chọn nhu cầu mà bạn mong muốn cho bài đăng.",
    address: "Nhập thông tin địa chỉ của bất động sản của bạn.",
    main_info:
      "Lựa chọn loại hình bất động sản của bạn, điền đẩy đủ các thông số được yêu cầu.",
    property:
      "Thêm các cơ sở hạ tầng có trong bất động sản của bạn, tùy chỉnh số lượng sẵn có.",
    facility: "Thêm các tiện ích được tích hợp sẵn trong bất động sản của bạn.",
    description:
      "Thêm các mô tả cho bài đăng bất động sản của bạn một cách rõ ràng, chi tiết để bài đăng dễ tiếp cận với người dùng.",
    image:
      "Thêm các hình ảnh về các bất động sản của bạn, ít nhất 3 hình ảnh và nhiều nhất là 9 hình ảnh.",
    video:
      "Đường dẫn của bạn phải được đảm bảo an toàn và không bị chặn. Bạn nên check đường dẫn video trước khi hoàn thành bước 2.",
    package:
      "Tùy chọn các gói đăng bạn mong muốn. Click xem chi tiết để kiểm tra kỹ các quyền lợi của gói đăng.",
    schedule:
      "Chỉ khả dụng cho gói Premium và Standard. Tin đăng chỉ được đặt lịch dưới 2 tuần tại thời điểm đăng tin.",
  };

  const errrorMessage = {
    needs: "Vui lòng chọn nhu cầu của bạn về bài đăng bất động sản !!!",
    address:
      "Vui lòng nhập đầy đủ thông tin địa chỉ cho bài đăng bất động sản !!!",
    category: "Vui lòng chọn loại hình bất động sản !!!",
    area: "Vui lòng nhập diện tích của bất động sản !!!",
    price: "Vui lòng nhập mức giá của bất động sản mà bạn mong muốn !!!",
    unit_price: "Vui lòng nhập đơn vị giá cho mức giá của bất động sản !!!",
    title: "Vui lòng nhập tiêu đề cho bài đăng bất động sản của bạn !!!",
    description: "Vui lòng nhập thông tin mô tả về bất động sản !!!",
    image: "Số lượng hình ảnh vượt quá giới hạn cho phép (3-9) !!!",
    schedule: "Ngày đăng tin được đặt vượt quá 14 ngày !!!",
  };

  // ---------------------------- Logic Step 1 ----------------------------------
  // Options: needs
  const [isSell, setIsSell] = useState(false);
  const [isRent, setIsRent] = useState(false);
  const [needs, setNeeds] = useState(null);
  const handleChooseSell = () => {
    setIsSell(true);
    setIsRent(false);
    setNeeds("sell");
    setCategories([]);
  };
  const handleChooseRent = () => {
    setIsRent(true);
    setIsSell(false);
    setNeeds("rent");
    setCategories([]);
  };

  // Options: address
  const [provinces, setProvinces] = useState([]);
  const [codeProvince, setCodeProvince] = useState("");
  const [wards, setWards] = useState([]);
  const [latlong, setLatLong] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const mapRef = useRef(null);
  const [address, setAddress] = useState({
    provinceCode: "",
    provinceName: "",
    wardCode: "",
    wardName: "",
    wardFullName: "",
    rest: "",
  });
  useEffect(() => {
    const getWardFromProvince = async () => {
      if (!codeProvince) return;
      const url = `location/province/${codeProvince}/ward`;
      const response_data = await fetchApi(url, {
        method: "get",
        skipAuth: true,
      });

      if (response_data.success) {
        setWards(response_data.wards);
      }
    };
    getWardFromProvince();
  }, [codeProvince]);

  useEffect(() => {
    const getLocation = async () => {
      try {
        const url = "/location/province";
        const response_data = await fetchApi(url, {
          method: "get",
          skipAuth: true,
        });

        if (response_data.success) {
          setProvinces(response_data.provinces);
        }
      } catch (err) {
        console.error(err);
      }
    };
    getLocation();
  }, []);

  const getLatLonng = async () => {
    const url = `location/geocode/${address.rest}, ${address.wardFullName}`;
    try {
      const response_data = await fetchApi(url, {
        method: "get",
        skipAuth: false,
      });

      setLatLong([response_data.lat, response_data.lon]);
      setSubmitSuccess(true);
    } catch (err) {
      setError("Không tìm thấy địa chỉ trên bản đồ !!!");
      setShowPopupErr(true);
    }
  };

  const handleSubmitAddress = async () => {
    setLoading(true);
    setSubmitSuccess(false);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    await getLatLonng();
    setLoading(false);
  };

  const handleInputChange = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  // Options: main info
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [acreage, setAcreage] = useState("");
  const [price, setPrice] = useState("");
  const [unitPrice, setUnitPrice] = useState("milion");

  useEffect(() => {
    if (!needs) return;
    const getCategory = async () => {
      try {
        const url = `/category/${needs}`;
        const response_data = await fetchApi(url, {
          method: "get",
          skipAuth: true,
        });
        setCategories(response_data.categories);
      } catch (err) {
        setError(err.message);
      }
    };
    getCategory();
  }, [needs]);

  const handleChangeCategory = (e) => {
    setCategoryId(e.target.value);
  };

  // Options: Property Component
  const [properties, setProperties] = useState([]);
  const [chooseProp, setChooseProp] = useState([]);
  const [submitProp, setSubmitProp] = useState([]);
  const [firstFocus, setFirstFocus] = useState(false);
  const [openPopupProp, setOpenPopupProp] = useState(false);

  // get data property -> properties
  useEffect(() => {
    if (!firstFocus) return;
    const getPropertyComponent = async () => {
      const url = "/property/all";
      const response_data = await fetchApi(url, {
        method: "get",
        skipAuth: true,
      });
      setProperties(response_data.all_properties);
    };
    getPropertyComponent();
  }, [firstFocus]);

  // bật popup -> lấy cái submit
  const handleClickShowPopup = () => {
    setOpenPopupProp(true);
    setFirstFocus(true);
    setChooseProp(submitProp);
  };

  const handleClickItem = (prop) => {
    setChooseProp((prev) => {
      const exists = prev.find((item) => item.id === prop._id);

      if (exists) {
        return prev.filter((item) => item.id !== prop._id);
      } else {
        return [...prev, { id: prop._id, name: prop.name, quantity: 1 }];
      }
    });
  };
  const handleDeleteProp = (prop) => {
    setChooseProp((prev) => {
      return prev.filter((item) => item.id !== prop.id);
    });
  };

  const handleChaneNumProperty = (id, value) => {
    setChooseProp((prev) =>
      prev.map((item) =>
        item.id == id ? { ...item, quantity: Number(value) } : item
      )
    );
  };

  // Options: Facility
  const [facilities, setFacilities] = useState([]);
  const [chooseFaci, setChooseFaci] = useState([]);
  const [submitFaci, setSubmitFaci] = useState([]);
  const [openPopupFacility, setOpenPopupFacility] = useState(false);

  useEffect(() => {
    const getFactility = async () => {
      const url = "/facility/all";
      const response_data = await fetchApi(url, {
        method: "get",
        skipAuth: true,
      });
      setFacilities(response_data.all_facilities);
    };
    getFactility();
  }, [firstFocus]);

  const handleClickItemFacility = (faci) => {
    setChooseFaci((prev) => {
      const exist = prev.find((item) => item.id === faci._id);

      if (exist) {
        return prev.filter((item) => item.id !== faci._id);
      } else return [...prev, { id: faci._id, name: faci.name }];
    });
  };

  const handleSubmitFacilit = () => {
    setSubmitFaci(chooseFaci);
  };

  const handleDeleteFaci = (faci) => {
    setChooseFaci((prev) => {
      return prev.filter((item) => item.id !== faci.id);
    });
  };

  // Options: Contact information
  const [nameContact, setNameContact] = useState("");
  const [emailContact, setEmailContact] = useState("");
  const [phoneContact, setPhoneContact] = useState("");
  const [id, setId] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const getCurrentInfo = async () => {
      try {
        const url = "account/contact";
        const response_data = await fetchApi(url, {
          method: "get",
          skipAuth: false,
        });

        if (response_data?.user_contact) {
          setNameContact(response_data.user_contact.fullname || "");
          setEmailContact(response_data.user_contact.email || "");
          setPhoneContact(response_data.user_contact.phone || "");
          setId(response_data.user_contact.id || "");
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching contact:", error);
      }
    };

    getCurrentInfo();
  }, [id, navigate]);

  // Options: Info post
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // post to server step 1
  const handleSubmitStep1 = async () => {
    setLoading(true);

    if (!needs) {
      setError(errrorMessage.needs);
      setLoading(false);
      setIdScroll("id_needs");
      setShowPopupErr(true);
      return;
    }

    if (!address.wardName || !address.provinceName) {
      setError(errrorMessage.address);
      setLoading(false);
      setIdScroll("id_adress")
      setShowPopupErr(true);
      return;
    }

    if (!acreage) {
      setError(errrorMessage.area);
      setLoading(false);
      setIdScroll("id_area")
      setShowPopupErr(true);
      return;
    }

    if (!price) {
      setError(errrorMessage.price);
      setLoading(false);
      setIdScroll("id_price");
      setShowPopupErr(true);
      return;
    }
    if (!unitPrice) {
      setError(errrorMessage.unit_price);
      setLoading(false);
      setIdScroll("id_unit")
      setShowPopupErr(true);
      return;
    }

    if (!categoryId || categoryId == "") {
      setError(errrorMessage.category);
      setLoading(false);
      setIdScroll("id_category")
      setShowPopupErr(true);
      return;
    }

    if (!title) {
      setError(errrorMessage.title);
      setLoading(false);
      setIdScroll("id_title");
      setShowPopupErr(true);
      return;
    }

    if (!description) {
      setError(errrorMessage.description);
      setLoading(false);
      setIdScroll("id_description")
      setShowPopupErr(true);
      return;
    }

    // body send step 1
    const property_components = submitProp.map(item => ({
      component_id: item.id,
      quantity: item.quantity,
    }));


    const body = {
      needs: needs,
      address: address.wardFullName,
      province: address.provinceName,
      ward: address.wardName,
      category_id: categoryId,
      acreage,
      price,
      unit_price: unitPrice,
      property_components,
      facilities: submitFaci.map((item) => item.id),
      title,
      description,
      latitude: latlong[0],
      longitude: latlong[1],
    };

    const url = "/post/create/step1";
    const response_data = await fetchApi(url, {
      method: "post",
      body,
      skipAuth: false,
    });

    if (response_data.success) {
      setLoading(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setStep2(true);
      }, 2000);
    }
  };

  // ---------------------------- Logic Step 2 ----------------------------------

  // Options: Image & Video
  const [images, setImages] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [showUpload, setShowUpload] = useState(true);
  const [showIframe, setShowIframe] = useState(false);

  // Xử lý ảnh
  const handleUploadImages = (e) => {
    const files = Array.from(e.target.files);

    setImages((prev) => {
      // Lọc ảnh mới, loại bỏ ảnh đã tồn tại
      const newFiles = files.filter(
        (file) =>
          !prev.some(
            (prevFile) =>
              prevFile.name === file.name &&
              prevFile.size === file.size &&
              prevFile.lastModified === file.lastModified
          )
      );
      setShowUpload(false);
      return [...prev, ...newFiles];
    });
  };

  // Loại bỏ ảnh
  const handleIgnoreImage = (index) => {
    setImages((prev) => {
      const newImages = prev.filter((_, i) => i !== index);
      if (newImages.length === 0) {
        setTimeout(() => setShowUpload(true), 200);
      }
      return newImages;
    });
  };

  // Check video
  const handleClickCheckURL = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowIframe(true);
    }, 1000);
  };

  // body send step 2
  const handleSubmitStep2 = async () => {
    setLoading(true);

    if (images.length < 3 || images.length > 9) {
      setError(errrorMessage.image);
      setLoading(false);
      setIdScroll("id_images")
      setShowPopupErr(true);
      return;
    }

    // Hiện giờ images chính là mảng các file tạo bằng createObjectURL
    const url_upload_preset = `https://api.cloudinary.com/v1_1/${
      import.meta.env.VITE_CLOUDINARY_NAME
    }/image/upload`;

    try {
      const uploadedUrls = await Promise.all(
        images.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append(
            "upload_preset",
            import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_NAME
          );

          const response = await fetch(url_upload_preset, {
            method: "POST",
            body: formData,
          });

          const data = await response.json();
          return data.secure_url;
        })
      );
      const response_data = await fetchApi("/post/create/step2", {
        method: "post",
        skipAuth: false,
        body: JSON.stringify({ images: uploadedUrls, video: getEmbedUrl(videoUrl) }),
      });

      if (response_data.success) {
        setLoading(false);
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setStep3(true);
        }, 2000);
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------- Logic Step 3 ----------------------------------
  const [showSubOption, setShowSubOption] = useState(false);
  const [idChoosePackage, setIdChoosePackage] = useState("");
  const [packages, setPackages] = useState([]);
  const [isSchedule, setIsSchedule] = useState(false);

  const [idChooseSubPackage, setIdChooseSubPackage] = useState("");
  const [subPackages, setSubPackages] = useState([]);
  const [packagePricings, setPackagePricings] = useState([]);

  const [totalCost, setTotalCost] = useState(null);
  const [discount, setDiscount] = useState(null);
  const [showCost, setShowCost] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [postId, setPostId] = useState(null);

  const [showPaymentProcess, setShowPaymentProcess] = useState(false);

  // get data package
  useEffect(() => {
    const getPackage = async () => {
      const url = "/package/all";
      const response_data = await fetchApi(url, {
        method: "get",
        skipAuth: true,
      });
      if (response_data.success) {
        setPackages(response_data.package_list);
      }
    };
    getPackage();
  }, [step3]);

  // get data subpackage
  useEffect(() => {
    const getPackage = async () => {
      const url = "/package/get-package-pricing";
      const response_data = await fetchApi(url, {
        method: "get",
        skipAuth: true,
      });
      if (response_data.success) {
        setPackagePricings(response_data.package_list);
      }
    };
    getPackage();
  }, [step3]);

  // Click gói to
  const handleClickOptionPackage = (id, priority) => {
    // reset
    setShowSubOption(true);
    setIdChoosePackage(id);
    setIdChooseSubPackage("");
    setShowCost(false);

    if (priority > 1) {
      setIsSchedule(true);
    } else {
      setIsSchedule(false);
    }

    const filtered = packagePricings.filter(
      (item) => item.package_id.toString() === id.toString()
    );

    setSubPackages(filtered);
  };

  const formDuration = (duration) => {
    if (duration == 7) {
      return "7 ngày";
    }
    if (duration == 10) {
      return "10 ngày";
    }
    if (duration == 30) {
      return "30 ngày";
    }
    if (duration == 90) {
      return "90 ngày";
    }
  };
  const formatPrice = (price) => {
    let milion = 0;
    if (price >= 1000000) {
      milion = Math.floor(price / 1000000);
      price %= 1000000;
    }
    if (price >= 1000) {
      price /= 1000;
    }

    return milion ? `${milion},${price}` : `${price}`;
  };

  // Click subpack của mỗi gói to
  const handleClickSubPack = (id) => {
    if (idChooseSubPackage === id) return;
    setShowCost(false);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setShowCost(true);
      setIdChooseSubPackage(id);
      const subpack = packagePricings.filter((item) => item._id === id)[0];
      setTotalCost(subpack.price);
      setDiscount(subpack.discount);
      setAmountPayment(calculateTotalMoney(totalCost, discount));
    }, 300);
  };

  const calculateTotalMoney = (money, discount) => {
    return money - Math.floor((money * discount) / 100);
  };

  const handleShowPaymentProcess = async () => {
  setLoading(true);

  try {
    // Tính ngày kết thúc
    const datePicker = new Date();
    const selectedPackage = packagePricings.find(
      (item) => item._id === idChooseSubPackage
    );
    const duration = selectedPackage?.duration_days || 0;

    const endDay = new Date(datePicker);
    endDay.setDate(datePicker.getDate() + duration);

    // Chuẩn bị body gửi cho backend
    const body = {
      current_package: idChoosePackage,
      time_expire: endDay,
      status: "draft",
    };

    // Gọi API tạo post draft
    const response_data = await fetchApi("/post/create/step3", {
      body,
      method: "post",
      skipAuth: false,
    });

    if (response_data.success) {
      // Cho FE một chút hiệu ứng loading trước khi hiện popup
      setPostId(response_data.data);
      setTimeout(() => {
        setLoading(false);
        setShowPaymentProcess(true);
      }, 1000);
    } else {
      // Lấy message từ backend
      setLoading(false);
      setError(response_data.message || "Có lỗi xảy ra");
      setShowPopupErr(true);
    }
  } catch (err) {
    // Nếu xảy ra lỗi network hoặc unexpected
    setLoading(false);
    setError(err.message);
    setShowPopupErr(true);
  }
};


  // Date Picker
  const [datePicker, setDatePicker] = useState(null);
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 14);

  // -------------- Payment Process -------------
  const [methodPayment, setMethodPayment] = useState(null);
  const [validMoney, setValidMoney] = useState(false);
  const [walletMoney, setWalletMoney] = useState(0);
  const [amountPayment, setAmountPayment] = useState(0);

  // Lấy số dư ví
  useEffect(() => {
    const url = "/account/wallet";
    const getMoneyWallet = async () => {
      const response_data = await fetchApi(url,{
        method: "get",
        skipAuth: false,
      })

      if (response_data.success) {
        setWalletMoney(response_data.money);
      }
    }

    getMoneyWallet();
  }, [showPaymentProcess]);

  // tính tổng tiền
  useEffect(() => {
    setAmountPayment(calculateTotalMoney(totalCost, discount));
    if (walletMoney < calculateTotalMoney(totalCost, discount)){
      setValidMoney(false);
      return;
    }
    else {
      setValidMoney(true);
      return;
    }
  },[totalCost, discount, walletMoney]);

  // Click trả paypal
  const handleClickPaymentPaypal = async () =>{
    // query 1 lần, không load lại khi click lại
    setMethodPayment("paypal")
    if (amountPayment <= 0) return;
    setAmountPayment(calculateTotalMoney(totalCost, discount));
    const response_data = await fetchApi(`/payment/create-order/${amountPayment}`,{
      method: "post",
      skipAuth: false
    });
    if (response_data.success) {
      setOrderId(response_data.orderID);
      return;
    }
    else {
      setError("Hiện tại không hữu dụng");
      setShowPopupErr(true);
      return;
    }
  }

  // Click thanh toán tiền - cho phương thức tính tiền bằng số dư ví
  const handlClickFinishPayment = async () => {
    if (!postId) return;

    const body = {
      post_id: postId,
      package_pricing_id: idChooseSubPackage,
      start_date: datePicker || new Date().toISOString(),
      money: amountPayment
    };

    console.log("check body: ", body);

    const url = "/payment/payment-wallet/new";
    const response_data = await fetchApi(url, {
      method: "post",
      skipAuth: false,
      body
    })

    if (response_data.success) {
      setShowSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
    else {
      setError("Thanh toán thất bại");
      setShowPopupErr(true);
      return;
    }
  }

  return (
    <>
    {!showPaymentProcess && (<div className={cx("wrapper_new_post")}>
      {loading && <Spinner />}
      {showSuccess && <Success />}
      {showPopupErr && (
        <Error
          width={100}
          height={100}
          message={error}
          onClick={() => {setShowPopupErr(false); scrollToField(idScroll); }}
        />
      )}
      <div className={cx("left_content")}>
        <div className={cx("new_post_title")}>Tạo tin đăng</div>
        <div className={cx("step_new_post")}>
          <div className={cx("step")}>
            <div className={cx("step_num", { isStep1: step1 })}>
              {!step2 ? "1" : "✓"}
            </div>
            <div className={cx("line_step", { isStep1: step1 })}></div>
          </div>
          <div className={cx("step")}>
            <div className={cx("line_step", { isStep2: step2 })}></div>
            <div className={cx("step_num", { isStep2: step2 })}>
              {!step3 ? "2" : "✓"}
            </div>
            <div className={cx("line_step", { isStep2: step2 })}></div>
          </div>
          <div className={cx("step")}>
            <div className={cx("line_step", { isStep3: step3 })}></div>
            <div className={cx("step_num", { isStep3: step3 })}>3</div>
          </div>
        </div>
        <div className={cx("info_step")}>
          <div className={cx("info_step_item")}>Thông tin bất động sản</div>
          <div className={cx("info_step_item")}>Hình ảnh</div>
          <div className={cx("info_step_item")}>Thanh toán</div>
        </div>
        <div className={cx("return_homepage")} onClick={() => navigate("/")}>
          <FontAwesomeIcon icon={faHouse} fontSize="30px" color="#2ecc71" />
        </div>
      </div>
      <div className={cx("right_content", "userselectnone")}>
        {step1 && !step2 && (
          <div className={cx("box_info")}>
            {/* ----------------- Nhu cầu: Mua/ Bán ------------------ */}
            <div id="id_needs" className={cx("info_option")}>
              <div className={cx("option_title")}>Nhu cầu</div>
              <HintTooltip
                id="needs-tooltip"
                className={cx("needs_tooltip")}
                message={messageTooltip.needs}
              />
              <div className={cx("type_estate")}>
                <div
                  className={cx("type_sell", { active: isSell })}
                  onClick={handleChooseSell}
                >
                  <img src={isSell ? sell_white : sell} alt="" />
                  <div className={cx("sell_title", { active: isSell })}>
                    Bán
                  </div>
                </div>
                <div
                  className={cx("type_rent", { active: isRent })}
                  onClick={handleChooseRent}
                >
                  <img src={isRent ? rent_white : rent} alt="" />
                  <div className={cx("sell_title", { active: isRent })}>
                    Cho thuê
                  </div>
                </div>
              </div>
            </div>
            {/* ----------------- Địa chỉ ------------------ */}
            <div id="id_adress" className={cx("info_option", "address_option")}>
              <div className={cx("option_title")}>Địa chỉ</div>
              <HintTooltip
                id="address-tooltip"
                className={cx("address_tooltip")}
                message={messageTooltip.address}
              />
              <div className={cx("option_address")}>
                <div className={cx("address_part")}>
                  {/* Province */}
                  <select
                    name="province"
                    className={cx("part_address", "hover_item_light")}
                    value={address.provinceCode || ""}
                    onChange={(e) => {
                      const code = e.target.value;
                      const name =
                        provinces.find((p) => p.code === code)?.name || "";
                      setCodeProvince(code); // fetch wards
                      handleInputChange("provinceCode", code);
                      handleInputChange("provinceName", name);

                      // reset ward khi đổi tỉnh
                      handleInputChange("wardCode", "");
                      handleInputChange("wardName", "");
                      handleInputChange("wardFullName", name);
                    }}
                  >
                    <option value="">-- Chọn Tỉnh/Thành phố --</option>
                    {provinces.map((p, index) => (
                      <option key={index} value={p.code}>
                        {p.name}
                      </option>
                    ))}
                  </select>

                  {/* Ward */}
                  <select
                    name="ward"
                    className={cx("part_address", "hover_item_light")}
                    value={address.wardCode || ""}
                    onChange={(e) => {
                      const code = e.target.value;
                      const wardObj = wards.find((w) => w.code === code);
                      handleInputChange("wardCode", code);
                      handleInputChange("wardName", wardObj?.name || "");
                      handleInputChange(
                        "wardFullName",
                        wardObj?.fullName || ""
                      );
                    }}
                    disabled={!address.provinceCode}
                  >
                    <option value="">-- Chọn Xã/Phường --</option>
                    {wards.map((w, index) => (
                      <option key={index} value={w.code}>
                        {w.name}
                      </option>
                    ))}
                  </select>

                  {/* Rest of address */}
                  <input
                    type="text"
                    className={cx("part_address", "hover_item_light")}
                    value={address.rest || ""}
                    onChange={(e) => handleInputChange("rest", e.target.value)}
                    placeholder="Đường/Số nhà"
                  />
                </div>

                {/* Full Address */}
                <div className={cx("address_full")}>
                  {`Địa chỉ hiển thị: ${address.rest} ${address.wardFullName}`}
                  <button
                    className={cx("submit_address")}
                    onClick={() => handleSubmitAddress()}
                  >
                    {" "}
                    Xác nhận địa chỉ{" "}
                  </button>
                </div>
                {/* Hiển thị lat long trên map */}
                {submitSuccess && (
                  <MarkerAddress
                    latlong={latlong}
                    address={`${address.rest}, ${address.wardFullName}`}
                  />
                )}
              </div>
            </div>
            {/* ----------------- Thông tin chính bất động sản ------------------ */}
            <div className={cx("info_option")}>
              <div className={cx("option_title")}>Thông tin chính</div>
              <div className={cx("option_sub_title")}>Loại bất động sản</div>
              <select
                id="id_category"
                className={cx("select_option")}
                name="category"
                value={categoryId}
                onChange={(e) => handleChangeCategory(e)}
              >
                <option value="">-- Chọn loại hình bất động sản --</option>
                {categories.map((ele, index) => (
                  <option key={index} value={ele._id}>
                    {ele.category}
                  </option>
                ))}
              </select>
              <div className={cx("wrapper_sub_option")}>
                <div className={cx("sub_info_option")}>
                  <div className={cx("option_sub_title")}>Diện tích</div>
                  <input
                    id="id_area"
                    type="number"
                    name="acreage"
                    value={acreage}
                    placeholder="Ex: 95.5"
                    onChange={(e) => {
                      setAcreage(e.target.value);
                    }}
                  />
                  <span className={cx("m2")}>m&sup2;</span>
                </div>
                <div className={cx("sub_info_option")}>
                  <div className={cx("option_sub_title")}>Mức giá</div>
                  <input
                    id="id_price"
                    type="number"
                    name="price"
                    value={price}
                    placeholder="Ex: 2.5"
                    onChange={(e) => {
                      setPrice(e.target.value);
                    }}
                  />
                </div>
                <div className={cx("sub_info_option")}>
                  <div className={cx("option_sub_title")}>Đơn vị</div>
                  <select
                    id="id_unit"
                    name="unitPrice"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                  >
                    <option value="milion">Triệu đồng</option>
                    <option value="bilion">Tỷ đồng</option>
                    <option value="milion_per_month">Triệu đồng/tháng</option>
                    <option value="milion_per_m2">Triệu đồng/m&sup2;</option>
                  </select>
                </div>
              </div>
            </div>
            {/* ----------------- Thông tin cơ sở hạ tầng ------------------ */}
            <div className={cx("info_option")}>
              <HintTooltip
                id="main-info-tooltip"
                className={cx("address_tooltip")}
                message={messageTooltip.main_info}
              />
              <div className={cx("option_title")}>Cơ sở hạ tầng</div>
              <div className={cx("propperty_add", "row")}>
                <div className={cx("wrapper_btn_property")}>
                  <button
                    onClick={handleClickShowPopup}
                    className={cx("button_add_property")}
                  >
                    <FontAwesomeIcon
                      icon={faPlus}
                      color="#333"
                      fontSize="20px"
                    />
                    Thêm mới
                  </button>
                </div>
                {/* --------- Render hiển thị sau khi chọn xong ------ */}
                {submitProp.map((prop, index) => {
                  return (
                    <div key={index} className={cx("item_property")}>
                      <span className={cx("item_num_ren")}>
                        {prop.quantity}
                      </span>
                      {`${prop.name}`}
                    </div>
                  );
                })}

                {openPopupProp &&
                  ReactDOM.createPortal(
                    // ---------------- POPUP Content --------------------------------------
                    <div className={cx("wrapper_popup")}>
                      <div className={cx("popup_property", "row")}>
                        <div
                          className={cx("close_popup", "col")}
                          onClick={() => setOpenPopupProp(false)}
                        >
                          <FontAwesomeIcon
                            icon={faXmark}
                            color="#333"
                            fontSize="20px"
                          />
                        </div>
                        <div className={cx("title_popup")}>
                          Chọn cơ sở vật chất
                        </div>
                        {/* Toàn bộ property trong DB */}
                        {properties.map((prop, index) => (
                          <div
                            key={index}
                            className={cx(
                              "property_item",
                              chooseProp.find((item) => item.id === prop._id) &&
                                "chose"
                            )}
                            onClick={() => handleClickItem(prop)}
                          >
                            {prop.name}
                          </div>
                        ))}
                        <div className={cx("title_popup")}>
                          Danh sách đã chọn
                        </div>
                        <div className={cx("list_choosing", "row")}>
                          {/* List đã chọn */}
                          {chooseProp.map((prop, index) => {
                            return (
                              <div key={index} className={cx("item_choosing")}>
                                <div className={cx("item_name")}>
                                  {prop.name}
                                  <div className={cx("delete_item")}>
                                    <FontAwesomeIcon
                                      icon={faXmark}
                                      fontSize="10px"
                                      color="#333"
                                      onClick={() => handleDeleteProp(prop)}
                                    />
                                  </div>
                                </div>
                                <span className={cx("item_quantity")}>
                                  Số lượng:
                                </span>
                                <input
                                  className={cx("item_num")}
                                  type="number"
                                  min={1}
                                  value={prop.quantity}
                                  onChange={(e) =>
                                    handleChaneNumProperty(
                                      prop.id,
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            );
                          })}
                        </div>
                        {/* Xóa tất cả đã chọn */}
                        <button
                          className={cx("property_delete_all")}
                          onClick={() => {
                            setChooseProp([]);
                          }}
                        >
                          {" "}
                          Xóa tất cả{" "}
                        </button>
                        {/* Xác nhận chọn list */}
                        <button
                          className={cx("property_ok")}
                          onClick={() => {
                            setOpenPopupProp(false);
                            setSubmitProp(chooseProp);
                          }}
                        >
                          {" "}
                          OK{" "}
                        </button>
                      </div>
                    </div>,
                    document.body
                  )}
              </div>
            </div>
            {/* ----------------- Thông tin cơ sở tiện ích ------------------ */}
            <div className={cx("info_option")}>
              <HintTooltip
                id="property-info-tooltip"
                className={cx("address_tooltip")}
                message={messageTooltip.property}
              />
              <div className={cx("option_title")}>Cơ sở tiện ích</div>
              <div className={cx("propperty_add", "row")}>
                <div className={cx("wrapper_btn_property")}>
                  <button
                    onClick={() => {
                      setOpenPopupFacility(true);
                    }}
                    className={cx("button_add_property")}
                  >
                    <FontAwesomeIcon
                      icon={faPlus}
                      color="#333"
                      fontSize="20px"
                    />
                    Thêm mới
                  </button>
                </div>
                {/* --------- Render hiển thị sau khi chọn xong ------ */}
                {submitFaci.map((faci, index) => {
                  return (
                    <div key={index} className={cx("item_property")}>{`${faci.name}`}</div>
                  );
                })}

                {openPopupFacility &&
                  ReactDOM.createPortal(
                    // ---------------- POPUP Content --------------------------------------
                    <div className={cx("wrapper_popup")}>
                      <div className={cx("popup_property", "row")}>
                        <div
                          className={cx("close_popup", "col")}
                          onClick={() => setOpenPopupFacility(false)}
                        >
                          <FontAwesomeIcon
                            icon={faXmark}
                            color="#333"
                            fontSize="20px"
                          />
                        </div>
                        <div className={cx("title_popup")}>
                          Chọn cơ sở vật chất
                        </div>
                        {/* Toàn bộ facility trong DB */}
                        {facilities.map((faci, index) => (
                          <div
                            key={index}
                            className={cx(
                              "property_item",
                              chooseFaci.find(
                                (item) => item.name === faci.name
                              ) && "chose_faci"
                            )}
                            onClick={() => handleClickItemFacility(faci)}
                          >
                            {faci.name}
                          </div>
                        ))}
                        <div className={cx("title_popup")}>
                          Danh sách đã chọn
                        </div>
                        <div className={cx("list_choosing_faci", "row")}>
                          {/* List đã chọn */}
                          {chooseFaci.map((faci, index) => {
                            return (
                              <div key={index} className={cx("item_choosing_faci")}>
                                <div className={cx("item_name_faci")}>
                                  {faci.name}
                                  <div className={cx("delete_item")}>
                                    <FontAwesomeIcon
                                      icon={faXmark}
                                      fontSize="10px"
                                      color="#333"
                                      onClick={() => handleDeleteFaci(faci)}
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {/* Xóa tất cả đã chọn */}
                        <button
                          className={cx("property_delete_all")}
                          onClick={() => {
                            setChooseFaci([]);
                          }}
                        >
                          {" "}
                          Xóa tất cả{" "}
                        </button>
                        {/* Xác nhận chọn list */}
                        <button
                          className={cx("property_ok")}
                          onClick={() => {
                            setOpenPopupFacility(false);
                            handleSubmitFacilit(chooseProp);
                          }}
                        >
                          {" "}
                          OK{" "}
                        </button>
                      </div>
                    </div>,
                    document.body
                  )}
              </div>
            </div>
            {/* ----------------- Thông tin Liên hệ ------------------ */}
            <div className={cx("info_option")}>
              <div className={cx("option_title")}>Thông tin liên hệ</div>
              <div className={cx("option_sub_title")}>Tên liên hệ</div>
              <div className={cx("contact_info")}>{nameContact}</div>
              <div className={cx("option_sub_title")}>Email</div>
              <div className={cx("contact_info")}>{emailContact}</div>
              <div className={cx("option_sub_title")}>Số điện thoại</div>
              <div className={cx("contact_info")}>{phoneContact}</div>
            </div>
            {/* ----------------- Thông tin Mô tả ------------------ */}
            <div className={cx("info_option")}>
              <HintTooltip
                id="description-tooltip"
                className={cx("address_tooltip")}
                message={messageTooltip.description}
              />
              <div className={cx("option_title")}>Tiêu đề & mô tả</div>
              <div className={cx("option_sub_title")}>Tiêu đề</div>
              <input
                id="id_title"
                className={cx("input_tit")}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className={cx("option_sub_title")}>Mô tả</div>
              <textarea
                id="id_description"
                className={cx("input_desc")}
                name="message"
                rows="5"
                cols="30"
                placeholder="Nhập văn bản tại đây..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <Button
              className={cx("submit_step1")}
              width="100px"
              borderRadius="7px"
              background="#B2935D"
              color="#fff"
              onClick={() => handleSubmitStep1()}
            >
              Tiếp theo
            </Button>
          </div>
        )}
        {step1 && step2 && !step3 && (
          <div className={cx("box_info")}>
            {/* ----------------- Hình ảnh: Bất động sản ------------------ */}
            <div className={cx("info_option")}>
              <div className={cx("option_title")}>Hình ảnh</div>
              <HintTooltip
                id="image-tooltip"
                className={cx("image_tooltip")}
                message={messageTooltip.image}
              />

              {/* Input multi file */}
              <div className={cx("wrapper_list_image")}>
                <label
                  className={cx("addmore_image", { activate: !showUpload })}
                  htmlFor="images"
                >
                  Chọn thêm ảnh
                </label>
                <label className={cx("list_images")} htmlFor="images">
                  <img
                    className={cx("upload_icon", { activate: showUpload })}
                    src={upload}
                    alt="Upload"
                  />
                </label>
                <div className={cx("script_upload", { activate: showUpload })}>
                  <p className={cx("title_upload")}>
                    Upload các hình ảnh về bất động sản
                  </p>
                  <p className={cx("sub_title_upload")}>
                    Số lượng: 3-9 hình ảnh
                  </p>
                </div>
                <input
                  type="file"
                  id="images"
                  name="images"
                  accept="image/*"
                  onChange={(e) => handleUploadImages(e)}
                  style={{ display: "none" }}
                  multiple
                />
                <div className={cx("preview_images", "row")}>
                  {images.map((file, index) => (
                    <div key={index} className={cx("preview_item", "col-3")}>
                      <FontAwesomeIcon
                        icon={faXmark}
                        fontSize="12px"
                        className={cx("ignore_img")}
                        onClick={() => handleIgnoreImage(index)}
                      />
                      <img
                        className={cx("preview_img")}
                        src={URL.createObjectURL(file)}
                        alt={`Preview-${index}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* ---------------- VIDEO bất động sản ----------- */}
            <div className={cx("info_option")}>
              <div className={cx("option_title")}>Video</div>
              <input
                value={videoUrl}
                type="text"
                placeholder="url video"
                className={cx("video_url")}
                onChange={(e) => {
                  setVideoUrl(e.target.value);
                  setShowIframe(false);
                }}
              />
              <button
                className={cx("btn_preview_video")}
                onClick={handleClickCheckURL}
              >
                Bản xem trước
              </button>
              <div className={cx("iframe_video", { activate: showIframe })}>
                <iframe
                  width="100%"
                  height="300"
                  src={getEmbedUrl(videoUrl) || null}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            <Button
              className={cx("submit_step1")}
              width="100px"
              borderRadius="7px"
              background="#B2935D"
              color="#fff"
              onClick={() => handleSubmitStep2()}
            >
              Tiếp theo
            </Button>
          </div>
        )}
        {step1 && step2 && step3 && (
          <div className={cx("box_info")}>
            {/* ----------------- Gói tin đăng ------------------ */}
            <div className={cx("info_option")}>
              <HintTooltip
                id="pack-tooltip"
                className={cx("needs_tooltip")}
                message={messageTooltip.package}
              />
              <div className={cx("option_title")}>Chọn gói tin đăng</div>
              <div className={cx("all_package")}>
                {packages.map((pkg, index) => (
                  <div
                    key={index}
                    className={cx("package_item", {
                      active: pkg._id === idChoosePackage,
                    })}
                    onClick={() =>
                      handleClickOptionPackage(pkg._id, pkg.priority_level)
                    }
                  >
                    <div className={cx("package_header")}>
                      <p className={cx("package_title")}>{pkg.name}</p>
                      <p
                        className={cx("package_desc", {
                          active: pkg._id === idChoosePackage,
                        })}
                      >
                        {pkg.description}
                      </p>
                      <button className={cx("btn_package_detail")}>
                        Xem chi tiết
                      </button>
                    </div>
                    {pkg.subscripts.map((script, index) => (
                      <div key={index} className={cx("subscript_item")}>
                        <FontAwesomeIcon
                          icon={faCheck}
                          fontSize="16px"
                          color="#4caf50"
                        />
                        <p className={cx("subscript_content")} key={index}>
                          {" "}
                          {script}{" "}
                        </p>
                      </div>
                    ))}
                    <div
                      className={cx("decorate_package", {
                        active: pkg._id === idChoosePackage,
                      })}
                    ></div>
                  </div>
                ))}
              </div>
              <div
                className={cx("subpack_option", {
                  active: idChoosePackage != "",
                })}
              >
                Tùy chọn đăng tin
              </div>
              <div className={cx("all_sub_packages")}>
                {subPackages.map((subPkg, index) => (
                  <div
                    key={index}
                    className={cx("subpack_item", {
                      active: idChooseSubPackage === subPkg._id,
                    })}
                    onClick={() => handleClickSubPack(subPkg._id)}
                  >
                    <p className={cx("subpack_duration")}>
                      {formDuration(subPkg.duration_days)}
                    </p>
                    {/* <p className={cx("")}>chỉ</p> */}
                    <div className={cx("subpack_item_wrap")}>
                      <FontAwesomeIcon
                        icon={faCoins}
                        color="#EFBB35"
                        fontSize="18px"
                      />
                      <p className={cx("subpack_price")}>
                        {formatPrice(subPkg.price)}
                      </p>
                      <FontAwesomeIcon
                        icon={faK}
                        color="#115ca8"
                        fontWeight="700"
                        fontSize="10px"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* ----------------- Date picker ------------------ */}
            <div
              className={cx("info_option", "schedule_wrap", {
                active: isSchedule,
              })}
            >
              <HintTooltip
                id="schedule-tooltip"
                className={cx("needs_tooltip")}
                message={messageTooltip.schedule}
              />
              <div className={cx("option_title")}>Đặt lịch đăng tin</div>
              <div className={cx("schedule_post")}>
                <CustomDatePicker
                  selectedDate={datePicker}
                  minDate={today}
                  maxDate={maxDate}
                  onChange={(d) => setDatePicker(d)}
                  placeholder="Chọn ngày đăng"
                />
                {datePicker && (
                  <p>Ngày bạn chọn: {datePicker.toLocaleDateString()}</p>
                )}
              </div>
            </div>

            {showCost && (
              <>
                {/* <div className={cx("line_break")}></div> */}
                <div className={cx("total_cost_container")}>
                  <div className={cx("totalcost_wrap")}>
                    <div className={cx("totalcost_item", "loworder")}>
                      <div className={cx("precost_title")}>Tạm tính</div>
                      <div className={cx("precost_money")}>{totalCost}</div>
                    </div>
                    <div className={cx("totalcost_item", "loworder")}>
                      <div className={cx("precost_title")}>Giảm giá</div>
                      <div className={cx("precost_money")}>{discount} %</div>
                    </div>
                    <div className={cx("totalcost_item", "highorder")}>
                      <div className={cx("precost_title")}>Tổng tính</div>
                      <div className={cx("precost_money")}>
                        {calculateTotalMoney(totalCost, discount)}
                      </div>
                    </div>
                  </div>
                  <div className={cx("totalcost_payment")}>
                    <button className={cx("btn_payment")} onClick={handleShowPaymentProcess}>
                      Thanh toán ngay
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        fontSize="19px"
                        className={cx("arrow_icon")}
                      />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>)}
    {showPaymentProcess && (
      <div className={cx("payment_process_wrapper")}>
        <div className={cx("payment_process")}>
          <div className={cx("payment_left")}>
            <div className={cx("payment_item_wrap")}>
              <div className={cx("payment_title")}>Thông tin bài đăng</div>
              <PropertySlider
              className={cx("payment_slider_wrap")}
                images={[
                  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
                  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
                  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
                  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
                ]}
              />

              <label className={cx("label_payment")} htmlFor="">Chủ sở hữu</label>
              <input className={cx("input_payment")} type="text" value={nameContact} readOnly/>
              <label className={cx("label_payment")} htmlFor="">Email</label>
              <input className={cx("input_payment")} type="text" value={emailContact}  readOnly/>
              <label className={cx("label_payment")} htmlFor="">Số điện thoại</label>
              <input className={cx("input_payment")} type="text" value={phoneContact} readOnly/>
              <label className={cx("label_payment")} htmlFor="">Tên bài đăng</label>
              <input className={cx("input_payment")} type="text" value={title} readOnly/>
              {/* <label className={cx("label_payment")} htmlFor="">Thông tin cơ bản</label>
              <input className={cx("input_payment")} type="text" placeholder="Địa chỉ" readOnly/>
              <input className={cx("input_payment")} type="text" placeholder="Diện tích" readOnly/>
              <input className={cx("input_payment")} type="text" placeholder="Giá cả" readOnly/>
              <input className={cx("input_payment")} type="text" placeholder="Cơ sở vật chất" readOnly/>
              <input className={cx("input_payment")} type="text" placeholder="Cơ sở tiện ích" readOnly/> */}
            </div>
          </div>
          <div className={cx("payment_right")}>
            <div className={cx("payment_item_wrap")}>
              <div className={cx("payment_title")}>Hóa đơn thanh toán</div>
              <div className={cx("bill_payment")}>
                <div className={cx("bill_item")}>
                  <div className={cx("bill_title")}>Tạm tính</div>
                  <div className={cx("bill_money")}>{totalCost}</div>
                </div>
                <div className={cx("bill_item")}>
                  <div className={cx("bill_title")}>Giảm giá</div>
                  <div className={cx("bill_money")}>{discount} %</div>
                </div>
                <div className={cx("bill_item", "total")}>
                  <div className={cx("bill_title")}>Tổng cộng</div>
                  <div className={cx("bill_money")}>{calculateTotalMoney(totalCost, discount)}</div>
                </div>
              </div>
            </div>
            <div className={cx("payment_item_wrap", "userselectnone")}>
              <div className={cx("payment_title")}>Phương thức thanh toán</div>
              <div className={cx("payment_method_wrap", "userselectnone")}>
                <div className={cx("payment_method", {active : methodPayment == "wallet"})} onClick={() => setMethodPayment("wallet")}>
                  <FontAwesomeIcon icon={faWallet} fontSize="18px" color="#14B8A6" /> 
                  <div className={cx("payment_name")}>Ví cá nhân</div>
                </div>
                <div className={cx("payment_method", {active : methodPayment == "paypal"})} onClick={handleClickPaymentPaypal}>
                  <FontAwesomeIcon icon={faPaypal} fontSize="18px" color="#F59E0B" /> 
                  <div className={cx("payment_name")}>Chuyển khoản</div>
                </div>
                <div className={cx("payment_method", {active : methodPayment == "credit"})} onClick={() => setMethodPayment("credit")}>
                  <FontAwesomeIcon icon={faCreditCard} fontSize="18px" color="#EF5350" /> 
                  <div className={cx("payment_name")}>Thẻ tín dụng</div>
                </div>
              </div>
              <div className={cx("payment_content", {active: methodPayment=="wallet"})}>
                <div className={cx("content_title")}>Số dư khả dụng</div>
                <div className={cx("wallet_money")}>{walletMoney}<span style={{marginLeft: "10px"}}>VND</span></div>
                <div className={cx("analys_money")}>
                  <span className={cx("analys_title")}>Tình trạng</span>
                  <span className={cx("analys_status")}>{validMoney ? "Có thể thanh toán" : "Số dư không đủ"}</span>
                </div>
                <button className={cx("btn_deposit", {active: !validMoney})}>Nạp tiền ngay</button>
                <button className={cx("btn_submit_payment", {disabled: !validMoney})} disabled={!validMoney} onClick={handlClickFinishPayment}>Thanh toán ngay</button>
              </div>

              {/* Div cho cái handle paypal */}
              <div className={cx("payment_content", { active: methodPayment === "paypal" })}>
                {orderId && <PaymentPaypal orderId={orderId} />}
                {!orderId && <SpinnerComponent loading={true} />}
              </div>

              <div className={cx("payment_content", { active: methodPayment === "credit" })}>
                <p className={cx("credit_title")}>Hiện tại chưa hỗ trợ phương thức thanh toán này.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

const NewPost = () => {
  const [transition, setTransition] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setTransition(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [transition]);
  return (
    <>
      {/* <Header /> */}
      {transition && <TransitionPage show={transition} />}
      <ContentNewPost />
    </>
  );
};

export default NewPost;
