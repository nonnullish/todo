document.onclick = (e) => {
    if (!["block", "item", "label"].includes(e.target.className)) {
        newItem();
    }
};

let deleteElement = async (id, item) => {
    await new Promise(r => setTimeout(r, 2000));
    if (item.checked) {
        document.getElementById(id).remove();
    }
}

let newItem = () => {
    let id = `item-${Date.now()}`;
    let block = document.createElement("div");
    block.setAttribute("class", "block");
    block.setAttribute("id", id);

    let item = document.createElement("input");
    item.setAttribute("class", "item");
    item.setAttribute("id", id);
    item.setAttribute("type", "checkbox");
    item.onclick = () => deleteElement(id, item);

    let label = document.createElement("input");
    label.setAttribute("class", "label");

    block.append(item);
    block.append(label);

    let items = document.getElementById("items");
    items.append(block);
};