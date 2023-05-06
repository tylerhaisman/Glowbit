import React, { useState, useEffect } from "react";

const Cell = (props) => {
  const [bgColor, setBgColor] = useState("#ffffff2e");
  const [shadow, setShadow] = useState("0 0 0px #1aff00a1");

  useEffect(() => {
    // if(props.isGameOver && props.winStatus){
    //   setShadow("0 0 40px #1aff00a1");
    // }
    // if(props.isGameOver && !props.winStatus){
    //   setShadow("0 0 40px #ff0000a1");
    // }
    if (props.isClicked) {
      setBgColor("#ffffff6d");
    } 
    else {
      setBgColor("#ffffff2e");
    }
  }, [props.isClicked]);

  const handleClick = () => {
    props.onClick();
  };

  return (
    <th style={{ backgroundColor: bgColor, boxShadow: shadow}} onClick={handleClick}>
      {props.value}
    </th>
  );
};

export default Cell;
