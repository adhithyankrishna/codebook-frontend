import React, { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { io } from "socket.io-client";
import ConsoleEmulator from "react-console-emulator";

const Ide = () => {
  const defaultCodeSnippet = {
    python: "# Start your Python scripting ",
    java: "class Main {\n\tpublic static void main(String[] args) {\n\n\t}\n}",
    c: "#include<stdio.h>\n\nint main()\n{\n\treturn 0\n}",
  };

  const commands = {
    echo: {
      description: "Echo a passed string.",
      usage: "echo <string>",
      fn: (...args) => args.join(" "),
    },

    about: {
      description: "To know about us ...",
      fn: () =>
        "<<<<<<<<<<<<<<<<<<this is online code editor for developer and creater >>>>>>>>>>>>>>>>>>>>>>\n<<<<<<<<<<<<<<<<.............................................................>>>>>>>>>>>>>>>>",
    },
  };

  const editorRef = useRef();
  const [language, setLanguage] = useState("java");
  const [defaultCode, setDefaultCode] = useState(defaultCodeSnippet[language]);
  const [currentCode, setCurrentCode] = useState(defaultCode);
  const [output, setOutput] = useState("$serve");
  const [clientId, setClientId] = useState(null);

  const socket = io("http://localhost:3001");

  const generateUniqueId = () => {
    const timestamp = Date.now().toString(36); // Convert current timestamp to base36
    const randomString = Math.random().toString(36).substr(2, 5); // Generate a random string

    return timestamp + randomString;
  };

  useEffect(() => {
    setClientId(generateUniqueId());
  }, []);

  useEffect(() => {
    console.log("HAI");

    console.log(clientId);

    socket.emit("join", clientId);
    const handleserverresponse = (data) => {
      console.log("handle server response", data);
      if (data.Error) console.log(data.Error);
      else console.log(data.output);
    };

    socket.on("javacode", handleserverresponse);
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const runCode = async () => {
    setCurrentCode(editorRef.current.getValue());
    const emitcode = {
      is: 1,
      arg: "1",
      code: currentCode,
    };
    socket.emit("javacode", emitcode);
    console.log("running ");
  };

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
    setDefaultCode(defaultCodeSnippet[selectedLanguage]);
  };

  const handleChange = (newCode) => {
    setCurrentCode(newCode);
  };
  

  return (
    <div className="Ide-boxM">
      <div className="function">
        <button onClick={runCode}>Run</button>
        <button>Clear</button>
        <select onChange={handleLanguageChange} value={language}>
          <option value="java">Java</option>
          <option value="python">Python</option>
          <option value="c">C</option>
        </select>
      </div>
      <Editor
        height="70vh"
        language={language}
        value={defaultCode}
        theme="vs-dark"
        onMount={(editor, monaco) => {
          editorRef.current = editor;
        }}
        onChange={handleChange}
      />
      <ConsoleEmulator
        commands={commands}

        promptLabel={"Codebook$"}
      />
    </div>
  );
};

export default Ide;
