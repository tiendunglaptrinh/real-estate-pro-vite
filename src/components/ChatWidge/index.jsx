import { useState, useEffect, useRef } from "react";
import classnames from "classnames/bind";
import styles from "./chatbot.module.scss";
import chatbot from "@images/chatbot.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const cx = classnames.bind(styles);

// Component typing effect
function TypingMessage({ text }) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    setDisplayText(""); // reset khi text mới
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText((prev) => prev + text[i]);
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, [text]);

  return <div>{displayText}</div>;
}

function ChatWidget() {
  const [showBoxChat, setShowBoxChat] = useState(false);
  const [botStarted, setBotStarted] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "bot",
      content: "Chào bạn! Tôi là Homepro Chatbot. Hãy gửi câu hỏi của bạn.",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const chatContainerRef = useRef(null);

  // Auto scroll xuống cuối mỗi khi messages thay đổi
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleClickChatBot = () => {
    setShowBoxChat(!showBoxChat);

    // trigger typing lần đầu khi mở chat
    if (!botStarted) setBotStarted(true);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      role: "user",
      content: inputValue,
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    // Mock bot response sau 1s
    setTimeout(() => {
      const botReply = {
        id: messages.length + 2,
        role: "bot",
        content: `Bot trả lời: Bạn vừa gửi "${newMessage.content}". Đây là phản hồi thử nghiệm dài để test scroll và typing effect. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
      };
      setMessages((prev) => [...prev, botReply]);
    }, 1000);
  };

  // Xử lý keyboard: Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
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
      <div className={cx("chatwidge_boxchat", { active: showBoxChat })}>
        {/* Header */}
        <div className={cx("chatwidge_header")}>
          <img className={cx("chatwidth_header_icon")} src={chatbot} alt="" />
          <p className={cx("chatwidth_header_title")}>Homepro Chatbot</p>
        </div>

        {/* Body chat */}
        <div
          ref={chatContainerRef}
          className={cx("chatwidge_messages")}
          style={{
            maxHeight: "450px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            padding: "8px",
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              className={cx("chatwidge_bubble", {
                user: msg.role === "user",
                bot: msg.role === "bot",
              })}
            >
              {msg.role === "bot" && index === 0 && botStarted ? (
                <TypingMessage text={msg.content} />
              ) : (
                msg.content
              )}
            </div>
          ))}
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
            onClick={handleSendMessage}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>
    </div>
  );
}

export default ChatWidget;
