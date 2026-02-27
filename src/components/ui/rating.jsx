import React from "react";

export const Rating = ({ value = 0, onChange }) => {
  // Simple star rating UI
  const stars = [1,2,3,4,5];
  return (
    <div className="flex gap-1">
      {stars.map((star) => (
        <span
          key={star}
          className={`cursor-pointer text-amber-400 ${value >= star ? "text-amber-500" : "text-gray-300"}`}
          onClick={() => onChange && onChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};
