import React from 'react';
import { NavLink } from 'react-router-dom';

export function SubHeader({ navigationItems }) {
  return (
    <div className="w-full text-white py-4 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-start gap-6">
        {navigationItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm font-medium ${
                isActive ? 'bg-gray-700 text-amber-400' : 'hover:bg-gray-700 hover:text-amber-400'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}