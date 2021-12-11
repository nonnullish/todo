window.onload = () => {
    let storage = Object.keys(window.localStorage);
    let storageSize = storage.length;
    let regex = /item-\d+/g;
    for (let i = storageSize - 1; i >= 0; i--) {
        if (storage[i].match(regex)) {
            let id = storage[i].match(regex)[0];
            newItem(id, window.localStorage.getItem(id));
        }
    }
    startTime();
}

document.onclick = (e) => {
    if (!["block", "item", "label", "clock"].includes(e.target.className)) {
        e.preventDefault();
        newItem().focus();
    }
};

document.addEventListener("keydown", (e) => {
    if (e.key === 'Enter') {
        newItem().focus();
    }
    if (e.key === 'Esc') {
        document.body.focus();
    }
})

let deleteElement = async (id, item) => {
    await new Promise(r => setTimeout(r, 2000));
    if (item.checked) {
        document.getElementById(id).remove();
        window.localStorage.removeItem(id);
    }
}

let updateElement = (id) => {
    let block = document.querySelector(`#${id}`);
    let message = block.querySelector('.label').value;
    window.localStorage.setItem(id, message);
}

let newItem = (id = "", message = "") => {
    if (id == "") {
        id = `item-${Date.now()}`;
    }
    let block = document.createElement("div");
    block.setAttribute("class", "block");
    block.setAttribute("id", id);

    let item = document.createElement("input");
    item.setAttribute("class", "item");
    item.setAttribute("type", "checkbox");
    item.onclick = () => deleteElement(id, item);

    let label = document.createElement("input");
    label.setAttribute("class", "label");
    label.onchange = () => updateElement(id);
    label.setAttribute("value", message)

    block.append(item);
    block.append(label);

    let items = document.getElementById("items");
    items.append(block);

    return (label);
};

let startTime = () => {
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    m = checkTime(m);
    document.getElementById("clock").innerHTML = `${h}:${m}`;
    document.title = `${h}:${m}`;
    setTimeout(startTime, 1000);
}

let checkTime = (i) => {
    if (i < 10) {
        i = "0" + i
    };
    return i;
}