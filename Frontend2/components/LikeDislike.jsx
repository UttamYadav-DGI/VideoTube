// LikeButton.jsx
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";

const LikeButton = ({ onLike, disabled }) => {
  const [liked, setLiked] = useState(false);

  const handleLikeClick = () => {
    const newLikedState = !liked; // toggle
    setLiked(newLikedState);
    if (onLike) onLike(newLikedState); // pass new state to parent
  };

  return (
    <button
      onClick={handleLikeClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-3 py-1 rounded transition ${
        liked
          ? "bg-green-200 text-green-700"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      <FontAwesomeIcon icon={faThumbsUp} />
      {liked ? "Liked" : "Like"}
    </button>
  );
};

export default LikeButton;
