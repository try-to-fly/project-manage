import React, { useState } from "react";

interface SidebarProps {
  onChange: (type: string) => void;
}

interface MenuItem {
  name: string;
  type: string;
}

const menuItems: MenuItem[] = [
  { name: "目录扫描", type: "scan" },
  { name: "项目列表", type: "projects" },
  { name: "忽略列表", type: "ignore" },
  { name: "系统设置", type: "settings" },
];

export const Menu: React.FC<SidebarProps> = ({ onChange }) => {
  const [activeType, setActiveType] = useState("scan"); // 默认选中目录扫描

  const handleItemClick = (type: string) => {
    setActiveType(type);
    onChange(type);
  };

  return (
    <div className="flex flex-col w-48 bg-gray-100">
      <div className="p-4 bg-gray-200">
        <h2 className="text-xl font-bold">项目管理</h2>
      </div>
      <div className="flex flex-col">
        {menuItems.map((menuItem) => (
          <div
            key={menuItem.type}
            className={`p-4 cursor-pointer hover:bg-gray-300 ${
              activeType === menuItem.type ? "bg-gray-300" : ""
            }`}
            onClick={() => {
              handleItemClick(menuItem.type);
            }}
          >
            {menuItem.name}
          </div>
        ))}
      </div>
    </div>
  );
};
