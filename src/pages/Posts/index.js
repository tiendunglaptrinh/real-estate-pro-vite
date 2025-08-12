import { React } from 'react';
import classNames from "classnames/bind";
import style from "./Post.page.scss";

const cx = classNames.bind(style);

const Post = () =>{
    return (
        <div className={cx('wrapper_post')}>
            Bất động sản
        </div>
    )
}

export default Post;