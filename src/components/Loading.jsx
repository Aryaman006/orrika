// components/Loading.js
import React from 'react';
import './Loading.css'; // Import the CSS file

const Loading = () => {
  return (
    <div className="loading-wrapper">
      <div className="loading-circle"></div>
      <div className="loading-circle"></div>
      <div className="loading-circle"></div>
      <div className="loading-shadow"></div>
      <div className="loading-shadow"></div>
      <div className="loading-shadow"></div>
      <span>Loading</span>
    </div>
  );
};

export default Loading;
