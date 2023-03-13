import React from "react";

interface GridValues {
    index: number;
    turn: any;
    value: any;
    wc: number[];
    player: string;
}

const Box: React.FC<GridValues> = ({ index, turn, value, wc, player }) => {
  return (
    <>
      {wc.length === 0 ? (
        <div className="box" onClick={() => turn(index)}>
          {value}
        </div>
      ) : (
        <>
          {wc[0] === index || wc[1] === index || wc[2] === index ? (
            <div className="box" style={{backgroundColor: player === value ? "#FFCF55" : "#83B4FF"}} onClick={() => turn(index)}>
              {value}
            </div>
          ) : (
            <div className="box" onClick={() => turn(index)}>
              {value}
            </div>
          )}
        </>
      )}
    </>
    
  );
};

export default Box;