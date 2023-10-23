import React from "react";
import "../App.css";
import Scribblecode from "./Scribblecode";

const LandingPage = () => {


  return (
    <div className="LandingPage">
      <div className="NavBar">
        <button>Home</button>
        <button>Scribble code</button>
        <button>Learn</button>
        <div className="LoginButton">
          <button>Login in</button>
          <button>Sign up</button>
        </div>
      </div>
      <div>
        <h1 className="title">{"{\n  CodeBook();\n}"}</h1>
      </div>
      <div className="Scribble-l">
        <Scribblecode/>
      </div>
    </div>
  );
};

export default LandingPage;
