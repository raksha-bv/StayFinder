import React from "react";
import { Eye, EyeOff } from "lucide-react";

const InputField = ({
  icon,
  type,
  placeholder,
  value,
  onChange,
  className,
  required,
  showPasswordToggle,
  showPassword,
  onTogglePassword,
  iconSize,
}) => {
  return (
    <div className="relative">
      {icon}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={className}
        required={required}
      />
      {showPasswordToggle && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {showPassword ? (
            <EyeOff className={iconSize} />
          ) : (
            <Eye className={iconSize} />
          )}
        </button>
      )}
    </div>
  );
};

export default InputField;
