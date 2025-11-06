import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://appfcc-b1d42-default-rtdb.firebaseio.com/"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const addButton = document.getElementById("add-button");
const inputField = document.getElementById("input-field");
const shoppingList = document.getElementById("shopping-list");

const inputFieldClear = () => {
  inputField.value = "";
};
const newItemsToShoppingList = (item) => {
  let newEl = document.createElement("li");
  let itemID = item[0];
  let itemValue = item[1]

  newEl.addEventListener("click", () => {
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);

    remove(exactLocationOfItemInDB);
  });

  newEl.textContent = itemValue;

  shoppingList.append(newEl);
};
const clearShoppingList = () => {
  shoppingList.innerHTML = "";
};

addButton.addEventListener("click", () => {
  let inputValue = inputField.value;

  push(shoppingListInDB, inputValue);

  inputFieldClear();
});

onValue(shoppingListInDB, (snapshot) => {
  if (snapshot.exists()) {

    let itemsArray = Object.entries(snapshot.val());

    clearShoppingList();

    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];
      let currentItemID = currentItem[0];
      let currentItemValue = currentItem[1];
      newItemsToShoppingList(currentItem);
    }
  } else {
    shoppingList.innerHTML = `<p>Sem itens aqui... ainda<p/>`
  };

});
