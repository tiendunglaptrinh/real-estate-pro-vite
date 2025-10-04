import { useState } from 'react';
import classnames from 'classnames/bind';
import styles from './copyClipBoard.module.scss';

const cx = classnames.bind(styles);
 
const CopyClipBoard = ({children, url}) => {

    const [copied, setCopied] = useState(false);

    const handleClickCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => {setCopied(false)}, 1500);
        }
        catch(err){
            console.log("copy failed")
            return;
        }
    }

    return (
        <span className={cx("copy_clipboard")} onClick={handleClickCopy}>
        {children}
        {copied && <span className={cx("copied_popup")}>Đã copy đường dẫn</span>}
        </span>
    )
}

export default CopyClipBoard;