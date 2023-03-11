let openSettings = false;
let tmpHeight = 0;

window.onload = () => {
  checkSettings();
  makeToDos();
  makeDate();
  startTime();
  startBattery();
  makeSettings();
  makeRefresh();
};

window.onresize = () => {
  for (const textarea of document.querySelectorAll("textarea")) {
    autoresize(textarea);
  }
};

const checkSettings = () => {
  let backgroundSetting = localStorage.getItem("setting");
  const background = Object.keys({ ...localStorage }).filter((item) => item.includes("background"))[0];
  if (background) {
    checkIfStale(background);
  }
  if (!backgroundSetting) {
    localStorage.setItem("setting", "unsplash");
    backgroundSetting = "unsplash";
  }

  if (backgroundSetting && !background) {
    switch (backgroundSetting) {
      case "chicago":
        callChicago();
        break;
      case "met":
        callMET();
        break;
      case "nasa":
        callNASA();
        break;
      case "unsplash":
        callUnsplash();
        break;
      case "custom":
        callHome();
      default:
        break;
    }
  }
  if (backgroundSetting) {
    document.querySelector(`#${backgroundSetting}`).checked = true;
  }
  updatePage();
};

const setBackground = (background) => {
  document.querySelector("#refresh-icon svg").classList.add("spinning");
  localStorage.setItem("setting", background);
  clearBackground();
  checkSettings();
};

const setBackgroundURL = (url) => {
  localStorage.setItem("background-url", url);
};

const setBackgroundColor = (color) => {
  if (document.querySelector("#solid").checked) {
    localStorage.setItem("color", color);
    clearBackground();
    checkSettings();
  }
};

const setUnsplashSubject = (subject) => {
  if (document.querySelector("#unsplash").checked) {
    localStorage.setItem("subject", subject);
    clearBackground();
    checkSettings();
  }
};

const checkIfStale = (id) => {
  const backgroundDate = new Date(Number(id.split("-")[1])).getDate();
  if (backgroundDate < new Date().getDate()) {
    localStorage.removeItem(id);
  }
};

const callChicago = () => {
  callAPI("https://api.artic.edu/api/v1/search", chicagoQuery()).then((response) => {
    const { image_id, artist_title, date_display, title } = response.data[0];
    localStorage.setItem(
      `background-${Date.now()}`,
      JSON.stringify({
        url: `https://www.artic.edu/iiif/2/${image_id}/full/${843},/0/default.jpg`,
        artist: artist_title,
        date: date_display,
        title: title,
      })
    );
    updatePage();
  });
};

const callMET = () => {
  try {
    callAPI(
      `https://collectionapi.metmuseum.org/public/collection/v1/objects/${Math.floor(Math.random() * 10000)}`
    ).then((response) => {
      const { primaryImage, artistDisplayName, objectDate, title } = response;
      if (!primaryImage) {
        callMET();
      } else {
        localStorage.setItem(
          `background-${Date.now()}`,
          JSON.stringify({
            url: primaryImage,
            artist: artistDisplayName,
            date: objectDate,
            title: title,
          })
        );
        updatePage();
      }
    });
  } catch (error) {
    console.error(error); // todo
  }
};

const callNASA = () => {
  callAPI("https://go-apod.herokuapp.com/apod").then((response) => {
    const { url, date, title } = response;
    localStorage.setItem(
      `background-${Date.now()}`,
      JSON.stringify({
        url: url,
        artist: "NASA",
        date: date,
        title: title,
      })
    );
    updatePage();
  });
};

const callUnsplash = async () => {
  const subject = document.querySelector("#subject-select").value || "wallpaper";
  const response = await fetch(`https://source.unsplash.com/random/1600x900/?${subject}`);
  localStorage.setItem(
    `background-${Date.now()}`,
    JSON.stringify({
      url: response.url,
      artist: "",
      date: "",
      title: "",
    })
  );
  updatePage();
};

const isValidURL = (url) => {
  try {
    url = new URL(url);
  } catch (_) {
    return false;
  }
  return true;
};

const callHome = () => {
  if (document.querySelector("#custom").checked === true && isValidURL(document.querySelector("#bg-url").value)) {
    localStorage.setItem(
      `background-${Date.now() * 2}`,
      JSON.stringify({
        url: document.querySelector("#bg-url").value,
        artist: "",
        date: "",
        title: "",
      })
    );
    updatePage();
  }
};

document.onclick = (e) => {
  if (e.target === document.body && !openSettings) {
    newItem().focus();
  }
};

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    newItem().focus();
  } else if (e.key === "Escape") {
    if (document.activeElement.parentElement.className === "block" && !document.activeElement.value) {
      document.activeElement.parentElement.remove();
    }
  }
});

const deleteElement = async (id, item) => {
  await new Promise((r) => setTimeout(r, 2000));
  if (item.checked) {
    document.getElementById(id).style.opacity = 0;
    await new Promise((r) => setTimeout(r, 200));
    for (const child of document.getElementById(id).children) {
      child.style.height = 0;
      child.style.padding = 0;
      child.style.border = "none";
      child.style.margin = 0;
    }
    document.getElementById(id).style.minHeight = 0;
    document.getElementById(id).style.padding = 0;
    await new Promise((r) => setTimeout(r, 500));
    document.getElementById(id).remove();
    localStorage.removeItem(id);
  }
};

const updateElement = (id) => {
  const block = document.querySelector(`#${id}`);
  const message = block.querySelector(".label").value;
  localStorage.setItem(id, message);
};

const makeToDos = () => {
  const todos = Object.keys({ ...localStorage }).filter((item) => item.includes("item"));
  for (const todo of todos.sort()) {
    newItem(todo, localStorage.getItem(todo));
  }
};

const newItem = (id = "", message = "") => {
  if (id == "") {
    id = `item-${Date.now()}`;
  }
  const block = document.createElement("div");
  block.setAttribute("class", "block");
  block.setAttribute("id", id);

  const item = document.createElement("input");
  item.setAttribute("class", "item");
  item.setAttribute("type", "checkbox");
  item.onclick = () => deleteElement(id, item);

  const label = document.createElement("textarea");
  label.setAttribute("class", "label");
  label.textContent = message;
  label.oninput = () => {
    autoresize(label);
    updateElement(id);
  };

  block.append(item);
  block.append(label);

  const items = document.getElementById("items");
  items.append(block);

  autoresize(label);

  return label;
};

const autoresize = (textarea) => {
  textarea.style.height = 0;
  textarea.style.height = textarea.scrollHeight + "px";
};

const makeDate = () => {
  document.querySelector("#date").innerText = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const startTime = () => {
  const today = new Date();
  const h = leadingZero(today.getHours());
  const m = leadingZero(today.getMinutes());
  document.getElementById("clock").innerHTML = `${h}:${m}`;
  document.title = `${h}:${m}`;
  setTimeout(startTime, 1000);
};

const leadingZero = (n) => {
  if (n < 10) {
    n = "0" + n;
  }
  return n;
};

const startBattery = () => {
  navigator.getBattery().then((battery) => {
    const updateChargeInfo = () => {
      const batteryLevel = Math.ceil((battery.level * 10) / 2.5);
      Array.from(document.querySelectorAll(".icon")).map((icon) => (icon.style.display = "none"));

      if (battery.charging) {
        document.querySelector(".icon-battery-charging").style.display = "block";
        document.querySelector(".icon-battery-charging").classList.add(`charging-${batteryLevel}`);
      } else {
        document.querySelector(".icon-battery-charging").style.display = "none";
        document.querySelector(`.icon-battery-${batteryLevel}`).style.display = "block";
      }
    };

    const updateLevelInfo = () => {
      const batteryPercentage = Math.round(battery.level * 100);
      document.querySelector(".battery #status").innerHTML = `${batteryPercentage}%`;
    };

    updateChargeInfo();
    updateLevelInfo();

    battery.addEventListener("chargingchange", () => {
      updateChargeInfo();
    });

    battery.addEventListener("levelchange", () => {
      updateLevelInfo();
    });
  });
};

const makeSettings = () => {
  document.querySelector("#settings-icon").onclick = async () => {
    openSettings = !openSettings;
    if (openSettings) {
      tmpHeight = document.querySelector(".main").clientHeight;
      document.querySelector(".main").style.opacity = "0";
      await new Promise((r) => setTimeout(r, 250));
      document.querySelector(".main").style.height = "0px";
      document.querySelector("#settings-panel").style.height = `${tmpHeight}px`;
      document.querySelector("#settings-panel").style.visibility = "visible";
      document.querySelector("#settings-panel").style.display = "block";
      document.querySelector("#settings-panel").style.opacity = "1";
      document.querySelector(".main").style.visibility = "hidden";
    } else {
      document.querySelector("#settings-panel").style.opacity = "0";
      await new Promise((r) => setTimeout(r, 250));
      document.querySelector("#settings-panel").style.height = "0px";
      document.querySelector(".main").style.height = `${tmpHeight}px`;
      document.querySelector(".main").style.visibility = "visible";
      document.querySelector(".main").style.display = "block";
      document.querySelector(".main").style.opacity = "1";
      document.querySelector("#settings-panel").style.visibility = "hidden";
    }
  };

  document.querySelector("#solid-color").value = localStorage.getItem("color") || "#0000FF";
  document.querySelector("#subject-select").value = localStorage.getItem("subject") || "wallpaper";

  if (localStorage.getItem("setting") === "custom") {
    const backgroundID = Object.keys({ ...localStorage }).filter((item) => item.includes("background"))[0];
    const background = JSON.parse(localStorage.getItem(backgroundID));
    document.querySelector("#bg-url").value = background.url;
  }
};

const clearBackground = () => {
  const backgrounds = Object.keys({ ...localStorage }).filter((item) => item.includes("background"));
  for (const background of backgrounds) {
    localStorage.removeItem(background);
  }
};

const makeRefresh = () => {
  document.querySelector("#refresh-icon").onclick = () => {
    document.querySelector("#refresh-icon svg").classList.add("spinning");
    clearBackground();
    checkSettings();
  };
};

const callAPI = async (url, body) => {
  if (body) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : null,
    });
    return response.json();
  }
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
};

const setBackgroundImage = (url) => {
  document.documentElement.style.setProperty("--img-url", `url('${url}')`);
};

const updatePage = () => {
  const backgroundSetting = localStorage.getItem("setting");
  if (backgroundSetting === "solid") {
    const backgroundColor = localStorage.getItem("color");
    if (backgroundColor) {
      document.documentElement.style.setProperty("--img-url", backgroundColor);
      document.querySelector("#refresh-icon svg").classList.remove("spinning");
      return;
    }
  }

  const backgroundID = Object.keys({ ...localStorage }).filter((item) => item.includes("background"))[0];
  const background = JSON.parse(localStorage.getItem(backgroundID));
  if (background) {
    const bgImage = new Image();
    bgImage.onload = () => {
      setBackgroundImage(bgImage.src);
      document.documentElement.style.setProperty("--backdrop-opacity", "1");
    };
    bgImage.src = background.url;
    document.querySelector("#title").innerText =
      background.title && background.title !== "n.d." ? `“${background.title}”` : "";
    document.querySelector("#artist").innerText =
      background.artist && background.artist !== "n.d." ? background.artist : "";
    document.querySelector("#bg-date").innerText =
      background.date && background.date !== "n.d." ? `(${background.date})` : "";
    document.querySelector("#refresh-icon svg").classList.remove("spinning");
    return;
  }
};

const chicagoQuery = () => ({
  resources: "artworks",
  fields: ["id", "title", "artist_title", "image_id", "date_display"],
  boost: false,
  limit: 1,
  query: {
    function_score: {
      query: {
        bool: {
          filter: [
            {
              term: {
                is_public_domain: true,
              },
            },
            {
              exists: {
                field: "image_id",
              },
            },
          ],
        },
      },
      boost_mode: "replace",
      random_score: {
        field: "id",
        seed: Date.now(),
      },
    },
  },
});
