import React from "react";
import * as LucideIcons from "lucide-react";

const IconRender = ({
  name,
  size = 20,
  color = "currentColor",
  ...props
}) => {
  // fallback sang Square nếu icon không tồn tại
  const IconComponent = LucideIcons[name] || LucideIcons.Building2;

  return <IconComponent size={size} color={color} {...props} />;
};

export default IconRender;
