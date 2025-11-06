import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
  databaseURL: "https://appfcc-b1d42-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const addButton = document.getElementById("add-button");
const inputField = document.getElementById("input-field");
const shoppingList = document.getElementById("shopping-list");

const inputFieldClear = () => {
  inputField.value = "";
};
const newItemsToShoppingList = (itemValue) => {
  shoppingList.innerHTML += `<li>${itemValue}</li>`;
};
const clearShoppingList = () => {
  shoppingList.innerHTML = "";
};

addButton.addEventListener("click", () => {
  let inputValue = inputField.value;

  push(shoppingListInDB, inputValue);

  console.log(`${inputValue} added to database`);

  inputFieldClear();
});

onValue(shoppingListInDB, (snapshot) => {
  let itemsArray = Object.values(snapshot.val());

  clearShoppingList();

  for (let i = 0; i < itemsArray.length; i++) {
    newItemsToShoppingList(itemsArray[i]);
  }

});
