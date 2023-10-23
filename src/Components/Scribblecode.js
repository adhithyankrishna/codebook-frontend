import React from "react";
import Ide from "./Ide";

const Scribblecode = () => {
  return (
    <div className="Scribble">
      <div className="s-title">Scribble code</div>

      <div className="ide-box">
        <Ide />
      </div>
    </div>
  );
};

export default Scribblecode;
