import React, { useRef, useState } from "react";
import "../CSS/Terminal.css";

const Terminal = ({}) => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState([]);
  const [inputlist, setInputlist] = useState([]);
  const [index, setIndex] = useState(-1);
  const inputRef = useRef(null);

  const commands = {
    echo: {
      description: "Echo a passed string.",
      usage: "echo <string>",
      fn: (...args) => args.join(" "),
    },
    help: {
      description: "about list of commands available to call ",
      usage: "list command ",
      fn: () => (
        <div>
          {Object.keys(commands).map((command) => (
            <div key={command}>
              <p>Command: {command}</p>
              <p>Description: {commands[command].description}</p>
              <p>Usage: {commands[command].usage}</p>
              <br />
            </div>
          ))}
        </div>
      ),
    },

    clear: {
      description: "Clear the terminal screen",
      usage: "clear",
      fn: () => setOutput([]),
    },
  };

  const scroll = () => {
    console.log("hai");
    inputRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const execute = () => {
    try {
      const [command, ...args] = input.split(" ");
      if (command in commands) {
        const output = commands[command].fn(...args);
        setOutput((prev) => [...prev, output]);
      } else {
        setOutput((prev) => [
          ...prev,
          `${command} not found in type help for list of command available to call`,
        ]);
      }
    } catch (Error) {
      throw Error;
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleEnter();
    } else if (event.key === "ArrowUp") {
      handleArrowUp(event);
    } else if (event.key === "ArrowDown") {
      handleArrowDown(event);
    }
  };

  const handleArrowUp = (event) => {
    event.preventDefault();
    arrowup();
  };

  const handleArrowDown = (event) => {
    event.preventDefault();
    arrowdown();
  };

  const handleEnter = () => {
    setInputlist((prev) => [...prev, input]);
    execute();
    scroll();
    setIndex(inputlist.length);
    setInput("");
  };

  const arrowup = () => {
    setIndex((prev) => (prev - 1 < 0 ? index : prev - 1));
    const temp = inputlist[index];
    setInput(temp);
  };

  const arrowdown = () => {
    setIndex(
      index + 1 > inputlist.length - 1 ? inputlist.length - 1 : index + 1
    );
    const temp = inputlist[index];
    setInput(temp);
  };

  return (
    <div className="body">
      <div className="output">
        {output.map((item, index) => (
          <p key={index}>${item}</p>
        ))}
      </div>
      <div className="input-area">
        <div className="prompt">$</div>
        <input
          type="text"
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="input"
        />
      </div>
    </div>
  );
};

export default Terminal;
