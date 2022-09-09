function Roll(type, price, glazing, packSize) {
  this.type = type;
  this.price = price;
  this.glazing = glazing;
  this.packSize = packSize;
}

const GLAZING_PRICE_MAP = {
  "Keep original": 0,
  "Sugar milk": 0,
  "Vanilla milk": 0.5,
  "Double chocolate": 1.5,
};

const GLAZING_OPTIONS_ORDER = [
  "Keep original",
  "Sugar milk",
  "Vanilla milk",
  "Double chocolate",
];

const PACK_SIZE_PRICE_MAP = {
  1: 1,
  3: 3,
  6: 5,
  12: 10,
};

const PACK_SIZE_OPTIONS_ORDER = ["1", "3", "6", "12"];

const ID_TO_BASE_PRICE = {
  "#original": 2.49,
  "#apple": 3.49,
  "#raisin": 2.99,
  "#walnut": 3.49,
  "#double": 3.99,
  "#strawberry": 3.99,
};

const DROPDOWN_ID_TO_CARD_ID = {
  originalDropdown: "#original",
  appleDropdown: "#apple",
  raisinDropdown: "#raisin",
  walnutDropdown: "#walnut",
  doubleDropdown: "#double",
  strawberryDropdown: "#strawberry",
};

const PACK_PRICE_ID_TO_CARD_ID = {
  originalPack: "#original",
  applePack: "#apple",
  raisinPack: "#raisin",
  walnutPack: "#walnut",
  doublePack: "#double",
  strawberryPack: "#strawberry",
};

const cartItems = [];

let glazingDropdowns = document.querySelectorAll(".glazingDropdown");
for (let i = 0; i < glazingDropdowns.length; i++) {
  glazingDropdowns[i].addEventListener("click", () =>
    glazingChange(glazingDropdowns[i])
  );
  GLAZING_OPTIONS_ORDER.forEach((glaze) => {
    let option = document.createElement("option");
    option.innerHTML = glaze;
    option.setAttribute("value", GLAZING_PRICE_MAP[glaze]);
    glazingDropdowns[i].appendChild(option);
  });
}

let packSizeOptions = document.querySelectorAll(".packSizeOptions");
for (let i = 0; i < packSizeOptions.length; i++) {
  PACK_SIZE_OPTIONS_ORDER.forEach((packSize) => {
    let button = document.createElement("button");
    button.innerHTML = packSize;
    button.setAttribute("value", PACK_SIZE_PRICE_MAP[packSize]);
    button.addEventListener("click", () => packSizeChange(button));
    if (packSize == "1") {
      button.classList.add("selected");
    }
    packSizeOptions[i].appendChild(button);
  });
}

updateCart();

function glazingChange(element) {
  const cardId = DROPDOWN_ID_TO_CARD_ID[element.id];
  updatePrice(cardId);
}

function packSizeChange(element) {
  const parent = element.parentElement;
  const cardId = PACK_PRICE_ID_TO_CARD_ID[parent.id];
  parent.querySelector(".selected").classList.remove("selected");
  element.classList.add("selected");
  updatePrice(cardId);
}

function updatePrice(elementId) {
  const roll = document.querySelector(elementId);
  const glazing = roll.querySelector(".glazingDropdown").value;
  const packSize = roll
    .querySelector(".packSizeOptions")
    .querySelector(".selected").value;
  const basePrice = ID_TO_BASE_PRICE[elementId];
  console.log(glazing, packSize, elementId, basePrice);
  roll.querySelector(".priceValue").innerHTML = `$${(
    (basePrice + parseFloat(glazing)) *
    parseInt(packSize)
  ).toFixed(2)}`;
}

function addToCart(element) {
  const rollElement = element.parentElement.parentElement;
  const name = rollElement.querySelector("h3").innerHTML;
  const glazingDropdown = rollElement.querySelector(".glazingDropdown");
  const glazing =
    glazingDropdown.options[glazingDropdown.selectedIndex].innerHTML;
  const packSize = rollElement
    .querySelector(".packSizeOptions")
    .querySelector(".selected").value;
  const price = parseFloat(
    rollElement.querySelector(".priceValue").innerHTML.substr(1)
  );

  const roll = new Roll(name, price, glazing, packSize);
  cartItems.push(roll);

  const cartItem = document.querySelector("#cartItem");
  let popupDiv = document.createElement("div");
  popupDiv.setAttribute("id", "cartPopup");
  popupDiv.innerHTML = `<div>Added to cart:</div><br/>

    <div><b>${name}</b></div>
    <div>${glazing} glazing</div>
    <div>Pack of ${packSize}</div>
    <div>Price: $${price.toFixed(2)}</div>`;
  cartItem.appendChild(popupDiv);

  updateCart();

  // Removes popup after 3 seconds
  setTimeout(() => {
    document.querySelector("#cartPopup").remove();
  }, 3000);
}

function updateCart() {
  const cartList = document.querySelector("#cartList");
  let itemsDiv = document.createElement("div");
  itemsDiv.innerHTML = `${cartItems.length} items`;

  cartTotal = 0;
  for (let i = 0; i < cartItems.length; i++) {
    cartTotal += cartItems[i].price;
  }
  let totalDiv = document.createElement("div");
  totalDiv.innerHTML = `Total: $ ${cartTotal.toFixed(2)}`;
  cartList.replaceChildren(...[itemsDiv, totalDiv]);
}
