import React from "react";
import * as LucideIcons from "lucide-react";

const IconRender = ({ name, size = 20, color = "currentColor", ...props }) => {
  const IconComponent = LucideIcons[name]; // lấy đúng component theo string

  if (!IconComponent) {
    console.warn(`⚠️ Icon '${name}' không tồn tại trong lucide-react`);
    return null; // hoặc fallback 1 icon mặc định
  }

  return <IconComponent size={size} color={color} {...props} />;
};

export default IconRender;