// ----------- GLOBAL ---------------
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPlus } from "@fortawesome/free-solid-svg-icons";
import L from "leaflet";

// ----------- LOCAL -----------------
import {
  Button,
  TransitionPage,
  Header,
  Spinner,
  MarkerAddress,
  Error,
  HintTooltip,
} from "@components/component";
import { fetchApi } from "@utils/utils";
import rent from "@images/rent.png";
import sell from "@images/sell.png";
import sell_white from "@images/sell_white.png";
import rent_white from "@images/rent_white.png";
import style from "./NewPost.module.scss";

const cx = classNames.bind(style);

const ContentNewPost = () => {
  const [step1, setStep1] = useState(true);
  const [step2, setStep2] = useState(false);
  const [step3, setStep3] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPopupErr, setShowPopupErr] = useState(false);

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

      console.log(">>> check response data: ", response_data);
      setLatLong([response_data.lat, response_data.lon]);
      setSubmitSuccess(true);
    } catch (err) {
      setError("Không tìm thấy địa chỉ trên bản đồ !!!");
      setShowPopupErr(true);
      console.log("Error from getLatLong: ", error);
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
  const [categoryName, setCategoryName] = useState("");
  const [acreage, setAcreage] = useState("");
  const [price, setPrice] = useState("");
  const [unitPrice, setUnitPrice] = useState("");

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
    setCategoryName(e.target.value);
  };

  // Options: Property Component
  const [properties, setProperties] = useState([]);
  const [chooseProp, setChooseProp] = useState([]);
  const [submitProp, setSubmitProp] = useState([]);
  const [firstFocus, setFirstFocus] = useState(false);
  const [openPopupProp, setOpenPopupProp] = useState(false);

  useEffect(() => {
    if (!firstFocus) return;
    const getPropertyComponent = async () => {
      const url = "/property/all";
      const response_data = await fetchApi(url, {
        method: "get",
        skipAuth: true,
      });
      console.log(
        ">>> get all property componet: ",
        response_data.all_properties
      );
      setProperties(response_data.all_properties);
    };
    getPropertyComponent();
  }, [firstFocus]);
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
  }, []);

  // Options: Info post
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmitStep1 = () => {
    setLoading(true);

    const body = {};
    body.needs = needs;
    body.address = address;

    if (!needs) {
      setError("Vui lòng chọn nhu cầu đăng tin !!!");
      setShowPopupErr(true);
    }
    console.log("needs: ", needs);
    console.log("address: ", address);
    console.log("category: ", categoryName);
    console.log("area: ", acreage);
    console.log("price: ", price);
    console.log("unit price: ", unitPrice);
    console.log("property: ", submitProp);
    console.log("facilities: ", submitFaci);
    console.log("fullname: ", nameContact);
    console.log("emai: ", emailContact);
    console.log("phone: ", phoneContact);
    console.log("id: ", id);
    console.log("title: ", title);
    console.log("descriptions: ", description);
    console.log("latitude: ", latlong[0]);
    console.log("longitude: ", latlong[1]);
  };
  return (
    <div className={cx("wrapper_new_post")}>
      {loading && <Spinner />}
      {showPopupErr && (
        <Error
          width={100}
          height={100}
          message={error}
          onClick={() => setShowPopupErr(false)}
        />
      )}
      <div className={cx("left_content")}>
        <div className={cx("new_post_title")}>Tạo tin đăng</div>
        <div className={cx("step_new_post")}>
          <div className={cx("step")}>
            <div className={cx("step_num", { isStep1: step1 })}>1</div>
            <div className={cx("line_step", { isStep1: step1 })}></div>
          </div>
          <div className={cx("step")}>
            <div className={cx("line_step", { isStep2: step2 })}></div>
            <div className={cx("step_num", { isStep2: step2 })}>2</div>
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
      </div>
      <div className={cx("right_content")}>
        <div className={cx("box_info")}>
          {/* ----------------- Nhu cầu: Mua/ Bán ------------------ */}
          <div className={cx("info_option")}>
            <div className={cx("option_title")}>Nhu cầu</div>
            <HintTooltip
              id="needs-tooltip"
              message="Chọn nhu cầu mà bạn muốn"
            />
            <div className={cx("type_estate")}>
              <div
                className={cx("type_sell", { active: isSell })}
                onClick={handleChooseSell}
              >
                <img src={isSell ? sell_white : sell} alt="" />
                <div className={cx("sell_title", { active: isSell })}>Bán</div>
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
          <div className={cx("info_option")}>
            <div className={cx("option_title")}>Địa chỉ</div>
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
                  {provinces.map((p) => (
                    <option key={p.code} value={p.code}>
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
                    handleInputChange("wardFullName", wardObj?.fullName || "");
                  }}
                  disabled={!address.provinceCode}
                >
                  <option value="">-- Chọn Xã/Phường --</option>
                  {wards.map((w) => (
                    <option key={w.code} value={w.code}>
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
              className={cx("select_option")}
              name="category"
              value={categoryName}
              onChange={(e) => handleChangeCategory(e)}
            >
              <option value="">-- Chọn loại hình bất động sản --</option>
              {categories.map((ele) => (
                <option key={ele._id} value={ele.category}>
                  {ele.category}
                </option>
              ))}
            </select>
            <div className={cx("wrapper_sub_option")}>
              <div className={cx("sub_info_option")}>
                <div className={cx("option_sub_title")}>Diện tích</div>
                <input
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
                <select name="unitPrice">
                  <option value="milion">Triệu đồng</option>
                  <option value="tens_milion">Chục triệu đồng</option>
                  <option value="hundreds_milion">Trăm Triệu đồng</option>
                  <option value="bilion">Tỷ đồng</option>
                  <option value="milion_per_m2">Triệu đồng/m&sup2;</option>
                  <option value="tens_milion_per_m2">
                    Chục triệu đồng/m&sup2;
                  </option>
                  <option value="hundreds_milion_per_m2">
                    Trăm triệu đồng/m&sup2;
                  </option>
                </select>
              </div>
            </div>
          </div>
          {/* ----------------- Thông tin cơ sở hạ tầng ------------------ */}
          <div className={cx("info_option")}>
            <div className={cx("option_title")}>Cơ sở hạ tầng</div>
            <div className={cx("propperty_add", "row")}>
              <div className={cx("wrapper_btn_property")}>
                <button
                  onClick={handleClickShowPopup}
                  className={cx("button_add_property")}
                >
                  <FontAwesomeIcon icon={faPlus} color="#333" fontSize="20px" />
                  Thêm mới
                </button>
              </div>
              {/* --------- Render hiển thị sau khi chọn xong ------ */}
              {submitProp.map((prop) => {
                return (
                  <div className={cx("item_property")}>
                    <span className={cx("item_num_ren")}>{prop.quantity}</span>
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
                      {properties.map((prop) => (
                        <div
                          key={prop._id}
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
                      <div className={cx("title_popup")}>Danh sách đã chọn</div>
                      <div className={cx("list_choosing", "row")}>
                        {/* List đã chọn */}
                        {chooseProp.map((prop) => {
                          return (
                            <div className={cx("item_choosing")}>
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
            <div className={cx("option_title")}>Cơ sở tiện ích</div>
            <div className={cx("propperty_add", "row")}>
              <div className={cx("wrapper_btn_property")}>
                <button
                  onClick={() => {
                    setOpenPopupFacility(true);
                  }}
                  className={cx("button_add_property")}
                >
                  <FontAwesomeIcon icon={faPlus} color="#333" fontSize="20px" />
                  Thêm mới
                </button>
              </div>
              {/* --------- Render hiển thị sau khi chọn xong ------ */}
              {submitFaci.map((faci) => {
                return (
                  <div className={cx("item_property")}>{`${faci.name}`}</div>
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
                      {facilities.map((faci) => (
                        <div
                          key={faci._id}
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
                      <div className={cx("title_popup")}>Danh sách đã chọn</div>
                      <div className={cx("list_choosing_faci", "row")}>
                        {/* List đã chọn */}
                        {chooseFaci.map((faci) => {
                          return (
                            <div className={cx("item_choosing_faci")}>
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
            <div className={cx("option_title")}>Tiêu đề & mô tả</div>
            <div className={cx("option_sub_title")}>Tiêu đề</div>
            <input
              className={cx("input_tit")}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className={cx("option_sub_title")}>Mô tả</div>
            <textarea
              className={cx("input_desc")}
              id="message"
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
            height="100px"
            borderRadius="7px"
            background="#B2935D"
            color="#fff"
            onClick={() => handleSubmitStep1()}
          >
            Tiếp theo
          </Button>
          /
        </div>
      </div>
    </div>
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
