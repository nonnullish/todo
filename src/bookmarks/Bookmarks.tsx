import { useEffect, useState } from "react";
import { Trash, Lock, Unlock, Link } from "react-feather";
import dayjs from "dayjs";

import "./index.css";

import { demo } from "../demo";

interface IBookmark {
  id: EpochTimeStamp;
  title: string;
  url: string;
}

const Bookmark = (props: {
  bookmark: IBookmark;
  handleSave: (bookmark: IBookmark) => void;
  handleDelete: (bookmark: IBookmark) => void;
}) => {
  const [disabled, setDisabled] = useState(!!props.bookmark.url);
  const getTitle = (str: string) => (str.match(/(?<=\[)(.*?)(?=\])/g) || [""])[0];
  const getURL = (str: string) => (str.match(/(?<=\()(.*?)(?=\))/g) || [""])[0];

  const save = (input: string) => {
    props.handleSave({
      ...props.bookmark,
      title: getTitle(input),
      url: getURL(input),
    });
  };

  return (
    <div className="wrapper">
      <Link className="link-icon" size={16} color="#222222" />
      {disabled ? (
        <a className="bookmark" href={props.bookmark.url}>
          {props.bookmark.title}
        </a>
      ) : (
        <input
          defaultValue={props.bookmark.url ? `[${props.bookmark.title}](${props.bookmark.url})` : undefined}
          className="bookmark"
          type="text"
          placeholder="[Page title](URL)"
          onChange={(event: any) => save(event.target.value)}
          onBlur={(event: any) => save(event.target.value)}
        />
      )}

      <button className="delete" onClick={() => props.handleDelete(props.bookmark)}>
        <Trash size={16} />
      </button>
      <button className="lock" onClick={() => setDisabled((previous) => !previous)}>
        {disabled ? <Unlock size={16} color="#222222" /> : <Lock size={16} color="#222222" />}
      </button>
    </div>
  );
};

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState<IBookmark[]>(
    localStorage.getItem("bookmarks") ? JSON.parse(localStorage.getItem("bookmarks")) : demo.bookmarks
  );

  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  return (
    <div className="container">
      {bookmarks.map((bookmark) => (
        <Bookmark
          key={bookmark.id}
          bookmark={bookmark}
          handleSave={(bookmark) =>
            setBookmarks((previous: IBookmark[]) => previous.map((item) => (item.id === bookmark.id ? bookmark : item)))
          }
          handleDelete={(bookmark) =>
            setBookmarks((previous: IBookmark[]) => previous.filter((item) => item.id !== bookmark.id))
          }
        />
      ))}
      <div
        className="zone"
        onClick={() =>
          setBookmarks((previous: IBookmark[]) => [...previous, { id: dayjs().valueOf(), title: "", url: "" }])
        }
      />
    </div>
  );
};

export default Bookmarks;
