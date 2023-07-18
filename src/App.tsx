import { useEffect, useState } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import { Eye, Move } from "react-feather";

import Battery from "./battery/Battery";
import Date from "./date/Date";
import Todos from "./todos/Todos";
import Snippets from "./snippets/Snippets";
import Bookmarks from "./bookmarks/Bookmarks";

import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import "./styles.css";
import { demo } from "./demo";

const App = () => {
  const [layout, setLayout] = useState(
    localStorage.getItem("layout") ? JSON.parse(localStorage.getItem("layout")) : demo.layout
  );
  const [editMode, setEditMode] = useState(false);
  const ReactGridLayout = WidthProvider(RGL);

  useEffect(() => {
    localStorage.setItem("layout", JSON.stringify(layout));
  }, [layout]);

  const grid = 12;
  const margin = 16;

  return (
    <main>
      <ReactGridLayout
        cols={grid}
        rowHeight={Math.round(window.innerHeight / grid - 2 * margin)}
        compactType={null}
        isDraggable={editMode}
        isResizable={editMode}
        layout={layout}
        margin={[margin, margin]}
        onLayoutChange={(newLayout) => setLayout(newLayout)}
        preventCollision={true}
        useCSSTransforms={false}
      >
        <div className={`card center ${editMode ? "editable" : ""}`} key="time" data-grid={{ w: 5, h: 2, x: 2, y: 0 }}>
          <Date />
        </div>
        <div
          className={`card center ${editMode ? "editable" : ""}`}
          key="battery"
          data-grid={{ w: 5, h: 1, x: 2, y: 2 }}
        >
          <Battery />
        </div>
        <div className={`card ${editMode ? "editable" : ""}`} key="todos" data-grid={{ w: 5, h: 3, x: 2, y: 3 }}>
          <Todos />
        </div>
        <div className={`card ${editMode ? "editable" : ""}`} key="bookmarks" data-grid={{ w: 3, h: 3, x: 7, y: 0 }}>
          <Bookmarks />
        </div>
        <div className={`card ${editMode ? "editable" : ""}`} key="snippets" data-grid={{ w: 3, h: 3, x: 7, y: 3 }}>
          <Snippets />
        </div>
      </ReactGridLayout>
      <button className="settings" onClick={() => setEditMode((previous) => !previous)}>
        {editMode ? <Eye size={16} color="#222222" /> : <Move size={16} color="#222222" />}
      </button>
    </main>
  );
};

export default App;
