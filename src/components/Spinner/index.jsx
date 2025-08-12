import Lottie from 'lottie-react';
import animationData from '@animations/Loading.json';
import style from './Spinner.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(style);

const Spinner = ({ width = 200, height = 200, loop = true, className }) => {
  return (
    <div className={cx('spinner-overlay', className)}>
      <div className={cx('spinner')}>
        <Lottie animationData={animationData} loop={loop} style={{ width, height }} />
      </div>
    </div>
  );
};

export default Spinner;
