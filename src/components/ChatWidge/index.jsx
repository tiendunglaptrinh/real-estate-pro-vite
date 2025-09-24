import { useState, useEffect, useRef } from "react";
import classnames from "classnames/bind";
import styles from "./chatbot.module.scss";
import chatbot from "@images/chatbot.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCommentDots,
  faPaperPlane,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { fetchApi, getCurrentUser } from "@utils/utils";
import { useNavigate } from "react-router-dom";

const cx = classnames.bind(styles);

// Component typing effect

function ChatWidget() {
  const [showBoxChat, setShowBoxChat] = useState(false);
  const [finishResponse, setFinishReponse] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const chatContainerRef = useRef(null);
  const [isLogin, setIsLogin] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
    };
    getUser();
  }, []);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Chào bạn! Tôi là Homepro Chatbot. Hãy gửi câu hỏi của bạn.",
    },
  ]);

  // Auto scroll xuống cuối mỗi khi messages thay đổi
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleClickChatBot = () => {
    setShowBoxChat(!showBoxChat);
  };

  // Xử lý keyboard: Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessageToChatBot();
  };

  const handleSendMessageToChatBot = async () => {
    if (!inputValue.trim()) return;

    const user_message = {
      role: "user",
      content: inputValue,
    };

    // Thêm tin nhắn user ngay lập tức
    setMessages((prev) => [...prev, user_message]);
    setInputValue(""); // Reset input

    try {
      const url = "/message/send-message";
      const response_data = await fetchApi(url, {
        method: "post",
        body: { user_message: inputValue },
        skipAuth: false,
      });

      // Xác định nội dung bot trả lời
      const bot_response = {
        role: "assistant",
        content: response_data.success
          ? response_data.bot_response
          : response_data.message,
      };

      // Thêm tin nhắn bot
      setMessages((prev) => [...prev, bot_response]);
    } catch (err) {
      console.error(err);

      // Trong trường hợp lỗi server/network
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại!",
        },
      ]);
    }
  };

  return (
    <div className={cx("chatwidge_container")}>
      {/* Nút mở chat */}
      <div className={cx("btn_chatwidge")} onClick={handleClickChatBot}>
        <img
          className={cx("chatwidge_icon")}
          src={chatbot}
          alt="chatbot icon"
        />
      </div>

      {/* Box chat */}
      <div
        className={cx(
          "chatwidge_boxchat",
          { active: showBoxChat },
          { not_login: !isLogin }
        )}
      >
        {/* Header */}
        <div className={cx("chatwidge_header")}>
          <FontAwesomeIcon
            className={cx("close_boxchat")}
            icon={faXmark}
            fontSize="20px"
            color="#fff"
            onClick={() => {
              setShowBoxChat(false);
            }}
          />
          <img className={cx("chatwidth_header_icon")} src={chatbot} alt="" />
          <p className={cx("chatwidth_header_title")}>Homepro Chatbot</p>
        </div>

        {/* Body chat */}
        <div ref={chatContainerRef} className={cx("chatwidge_messages")}>
          {isLogin ? (
            messages.map((msg, index) => (
              <div
                key={index}
                className={cx("chatwidge_bubble", {
                  user: msg.role === "user",
                  assistant: msg.role === "assistant",
                })}
                dangerouslySetInnerHTML={{ __html: msg.content }} // ✅ chỉ dùng cái này
              />
            ))
          ) : (
            <div className={cx("require_login")}>
              <div className={cx("title_require_login")}>
                Chức năng này cần đăng nhập để sử dụng
              </div>
              <div className={cx("wrap_button")}>
                <button
                  className={cx("btn_require_login")}
                  onClick={() => setShowBoxChat(false)}
                >
                  Để sau
                </button>
                <button
                  className={cx("btn_require_login", "navigate")}
                  onClick={() => navigate("/login")}
                >
                  Đăng nhập
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className={cx("chatwidge_bottom")}>
          <FontAwesomeIcon
            className={cx("icon_message")}
            icon={faCommentDots}
            fontSize="30px"
            color="#fff"
          />
          <input
            className={cx("chatwidge_input")}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn..."
          />
          <FontAwesomeIcon
            className={cx("icon_message")}
            icon={faPaperPlane}
            fontSize="30px"
            color="#fff"
            onClick={handleSendMessageToChatBot}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>
    </div>
  );
}

export default ChatWidget;
