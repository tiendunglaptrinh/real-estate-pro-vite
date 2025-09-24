import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import classnames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Header, Footer } from "@components/component";
import { fetchApi } from "@utils/utils";
import styles from "./profile.module.scss";

const cx = classnames.bind(styles);

const ContentProfile = () => {
  const { id } = useParams();
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    const getDataProfile = async () => {
        const url = "/profile/get-info";
        const response_data = fetchApi(url, {
            method: "get",
            skipAuth: true
        });

        if (response_data.success){
            setProfileData(response_data.data);
        }
        else{
            console.log("can't not get data profile");
            return;
        }
    }
  }, [id]);

  return (
    <>
      <div className={cx("profile_container")}>
          PROFILE
      </div>
    </>
  );
};

const Profile = () => {
  return (
    <>
      <Header />
      <ContentProfile />
      <Footer />
    </>
  );
};

export default Profile;
