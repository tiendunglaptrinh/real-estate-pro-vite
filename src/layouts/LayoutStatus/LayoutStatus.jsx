import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classnames from 'classnames/bind';
import styles from "./layoutStatus.module.scss";
import logo from "@images/homehub.png";
import avatar from "@assets/avatar_defaults/male.png";

const cx = classnames.bind(styles);

const HeaderLayout = () => {

    const navigate = useNavigate();
    return (
        <div className={cx("header_layout_status")}>
            <img className={cx("logo")} src={logo} alt="" />
            <div className={cx("other_option")}>
                <div className={cx("homepro")} onClick={() => navigate("/")}>HomePro</div>
                <div className={cx("profile")}>
                    <img className={cx("avatar")} src={avatar} alt="" />
                </div>
            </div>
        </div>
    )
}

const LayoutStatus = ({children}) => {
    return (
        <>
            <div className={cx("layout_status_container")}>
                <HeaderLayout />
                {children}  
            </div>
        </>
    )
} 

export default LayoutStatus;