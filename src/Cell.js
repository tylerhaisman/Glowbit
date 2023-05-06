import React, { useState, useEffect } from "react";

const Cell = (props) => {
  const [bgColor, setBgColor] = useState("#ffffff2e");
  const [shadow, setShadow] = useState("0 0 0px #1aff00a1");
  const [animate, setAnimate] = useState("pulsing 2s ease-in-out infinite");

  useEffect(() => {
    if (props.isClicked) {
      setBgColor("#ffffff6d");
    } 
    else {
      setBgColor("#ffffff2e");
    }
  }, [props.isClicked]);
  useEffect(() => {
    if (props.canBeClicked) {
      setAnimate("pulsing 1.5s ease-in-out infinite");
    } 
    else {
      setAnimate("");
    }
  }, [props.canBeClicked]);

  const handleClick = () => {
    props.onClick();
  };
  return (
    <th style={{ backgroundColor: bgColor, boxShadow: shadow, animation: animate}} onClick={handleClick}>
      {props.value}
    </th>
  );
};

export default Cell;
