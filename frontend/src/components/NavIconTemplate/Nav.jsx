import React from "react";

const Nav = ({ Icon, title, onClick, collapsed }) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-5 py-4 rounded-lg cursor-pointer overflow-hidden transition-all duration-200 hover:bg-white/20"
    >
      {/* Icon */}
      {Icon && <Icon className="text-[20px]" />}

      {/* Title (hide when collapsed) */}
      {!collapsed && (
        <h2 className="text-[15px] font-medium font-sans">
          {title}
        </h2>
      )}
    </div>
  );
};

export default Nav;