import { useEffect, useState } from "react";
import { Trash, Lock, Unlock } from "react-feather";
import { highlight, languages } from "prismjs";
import Editor from "react-simple-code-editor";
import dayjs from "dayjs";

import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "./prism-nord.css";
import "./index.css";
import { demo } from "../demo";

interface ISnippet {
  id: EpochTimeStamp;
  code: string;
}

const Snippet = (props: {
  snippet: ISnippet;
  handleSave: (snippet: ISnippet) => void;
  handleDelete: (snippet: ISnippet) => void;
}) => {
  const [disabled, setDisabled] = useState(!!props.snippet.code);

  return (
    <div className="wrapper">
      <Editor
        className="snippet"
        disabled={disabled}
        value={props.snippet.code}
        onValueChange={(code) => props.handleSave({ ...props.snippet, code })}
        highlight={(code) => highlight(code, languages.js, "clike")}
        padding={16}
        style={{ fontFamily: "Martian Mono", fontSize: "0.65rem", lineHeight: 1.5 }}
      />
      <button className="delete" onClick={() => props.handleDelete(props.snippet)}>
        <Trash size={16} />
      </button>
      <button className="lock" onClick={() => setDisabled((previous) => !previous)}>
        {disabled ? <Unlock size={16} color="#222222" /> : <Lock size={16} color="#222222" />}
      </button>
    </div>
  );
};

const Snippets = () => {
  const [snippets, setSnippets] = useState<ISnippet[]>(
    localStorage.getItem("snippets") ? JSON.parse(localStorage.getItem("snippets")) : demo.snippets
  );

  useEffect(() => {
    localStorage.setItem("snippets", JSON.stringify(snippets));
  }, [snippets]);

  return (
    <div className="container">
      {snippets.map((snippet) => (
        <Snippet
          key={snippet.id}
          snippet={snippet}
          handleSave={(snippet) =>
            setSnippets((previous: ISnippet[]) => previous.map((item) => (item.id === snippet.id ? snippet : item)))
          }
          handleDelete={(snippet) =>
            setSnippets((previous: ISnippet[]) => previous.filter((item) => item.id !== snippet.id))
          }
        />
      ))}
      <div
        className="zone"
        onClick={() => setSnippets((previous: ISnippet[]) => [...previous, { id: dayjs().valueOf(), code: "" }])}
      />
    </div>
  );
};

export default Snippets;
