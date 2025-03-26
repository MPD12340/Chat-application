import React, { useEffect, useState } from "react";
import { BiSolidHide, BiShow } from "react-icons/bi";

// Custom password input component with visibility toggle
export default function CustomPasswordInput({
  label,
  value,
  onChange,
  name,
  placeholder,
  required,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="password-input-container">
      {/* Label for the input */}
      <label
        htmlFor={name}
        className="block mb-2 text-sm font-medium text-gray-900"
      >
        {label}
      </label>

      {/* Input wrapper with relative positioning for the toggle button */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          id={name}
          placeholder={placeholder}
          className="bg-gray-50 border border-gray-300 text-gray-900 
                    sm:text-sm rounded-lg focus:ring-primary-600 
                    focus:border-primary-600 block w-full p-2.5 pr-10"
          value={value}
          onChange={onChange}
          required={required}
        />

        {/* Toggle visibility button */}
        <button
          type="button"
          className="absolute inset-y-0 right-0 px-2.5 py-2.5 
                    text-gray-400 focus:outline-none"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? (
            <BiSolidHide className="w-5 h-5" />
          ) : (
            <BiShow className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}
