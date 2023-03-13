import React from "react";

interface CodeBoxData {
    room: string;
    link: string;
    isLeft: boolean;
    isFull: boolean;
}

const RoomCodeBox: React.FC<CodeBoxData> = ({ room, link, isLeft, isFull}) => {

  const formatLink: string = (window.location.origin + window.location.pathname + "?" + link);

  return (
    <div className="roomCodeBox" style={{textAlign: isLeft ? "left" : "right"}}>
        {isLeft ? (
            <h3 style={{justifyContent: "flex-start"}}>Room code{isFull ? "" : <button className="shareBtnLeft" onClick={() => {navigator.clipboard.writeText(formatLink)}}>Share</button>}</h3>
        ) : (
            <h3 style={{justifyContent: "flex-end"}}>{isFull ? "" : <button className="shareBtnRight" onClick={() => {navigator.clipboard.writeText(formatLink)}}>Share</button>}Room code</h3>
        )}
        <h2 className="roomCode" style={{color: isLeft ? "#FF8383" : "#83B4FF"}}>{room}</h2>
    </div>
  );
};

export default RoomCodeBox;