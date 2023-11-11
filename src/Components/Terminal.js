import React, { useEffect, useRef, useState } from "react";
import "../CSS/Terminal.css";

/*

terminal emulater were  developer can able add custome command and custimize the look 
*****
*****

There is Two mode were in Command mode this terminal work jsut like input area

****
****


*/ 

const Terminal = ({
  setUserInput,
  userOutput,
  mode,
  userCommand,
  background = "#292929",
  welcomeMessage = "Welcome to the Terminal! 🚀\nFeel free to explore and type 'help' for a list of available commands.",
  textColor = "#dbd8d5",
  promtColor = "#d6994a",
  promtText = "$",
}) => {
  // State Hooks
  const [input, setInput] = useState("");
  const [output, setOutput] = useState([welcomeMessage]);
  const [inputlist, setInputlist] = useState([]);
  const [index, setIndex] = useState(-1);  //Index for the list input type the user  -  used to track up and down arrow function
  const inputRef = useRef(null);   

  // Commands State Hook
  const [commands, setCommands] = useState({


    //basic command for the terminal 

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

    //clear terminal area but not history of command 
    clear: {
      description: "Clear the terminal screen",
      usage: "clear",
      fn: () => setOutput([]),
    },
  });

  // Effect for handling user output in command mode
  useEffect(() => {
    if (mode === "command") {
      setOutput((prev) => [...prev, userOutput]);
    }
  }, [userOutput, mode]);

  // Effect for adding user-defined commands
  useEffect(() => {
    Object.keys(userCommand).forEach((commandName) => {
      setCommands((prevCommands) => ({
        ...prevCommands,
        [commandName]: userCommand[commandName],
      }));
    });
  }, [userCommand]);

  // Function to scroll to the bottom
  const scroll = () => {
    inputRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Function to execute commands
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

  // Event handlers for key press
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

  // Event handlers for arrow up key
  const handleArrowUp = (event) => {
    event.preventDefault();
    arrowup();
  };

  // Event handlers for arrow down key
  const handleArrowDown = (event) => {
    event.preventDefault();
    arrowdown();
  };

  // Event handler for enter key
  const handleEnter = () => {
    setInputlist((prev) => [...prev, input]);
    if (mode !== "command") {
      execute();
    }
    scroll();
    setIndex(inputlist.length);
    setInput("");
  };

  // Function to handle arrow up action
  const arrowup = () => {
    setIndex((prev) => (prev - 1 < 0 ? index : prev - 1));
    const temp = inputlist[index];
    setInput(temp);
  };

  // Function to handle arrow down action
  const arrowdown = () => {
    setIndex(
      index + 1 > inputlist.length - 1 ? inputlist.length - 1 : index + 1
    );
    const temp = inputlist[index];
    setInput(temp);
  };

  // Event handler for input change
  const handleInput = (event) => {
    if (mode === "command") {
      setUserInput(event.target.value);
      setInput(event.target.value);
    } else {
      setInput(event.target.value);
    }
  };

  // Render
  return (
    <div className="body" style={{ backgroundColor: background }}>
      <div className="output" style={{ color: textColor }}>
        {output.map((item, index) => (
          <p key={index}>${item}</p>
        ))}
      </div>
      <div className="input-area">
        <div
          className="prompt"
          style={{ backgroundColor: background, color: promtColor }}
        >
          {promtText}&nbsp;
        </div>
        <input
          style={{ backgroundColor: background, color: promtColor }}
          type="text"
          ref={inputRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyPress}
          className="input"
        />
      </div>
    </div>
  );
};

export default Terminal;
