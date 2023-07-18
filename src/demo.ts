export const demo = {
  bookmarks: [
    { id: 0, title: "Component Gallery", url: "https://component.gallery/" },
    { id: 1, title: "Font Gallery", url: "https://www.freefaces.gallery/" },
    { id: 2, title: "draGGradients", url: "https://elrumordelaluz.github.io/draGGradients/" },
    {
      id: 3,
      title: "Decline in insect populations",
      url: "https://en.wikipedia.org/wiki/Decline_in_insect_populations",
    },
    { id: 4, title: "wtfjs", url: "https://github.com/denysdovhan/wtfjs" },
  ],
  layout: [
    { w: 4, h: 4, x: 2, y: 2, i: "time", moved: false, static: false },
    { w: 4, h: 1, x: 2, y: 6, i: "battery", moved: false, static: false },
    { w: 4, h: 4, x: 2, y: 7, i: "todos", moved: false, static: false },
    { w: 4, h: 3, x: 6, y: 4, i: "bookmarks", moved: false, static: false },
    { w: 4, h: 4, x: 6, y: 7, i: "snippets", moved: false, static: false },
  ],
  snippets: [
    { id: 0, code: "[] == ![]; // -> true" },
    { id: 1, code: '"b" + "a" + +"a" + "a"; // -> \'baNaNa\'' },
    { id: 2, code: "NaN === NaN; // -> false" },
    { id: 3, code: "let a = [, , ,];\na.length; // -> 3\na.toString(); // -> ',,'" },
  ],
  todos: [
    { id: 0, task: "Water the plants" },
    { id: 1, task: "Read about the decline in insect populations" },
    { id: 2, task: "Contemplate JavaScript" },
  ],
};
