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
const noItensEl = document.getElementById("no-itens");

const inputFieldClear = () => {
  inputField.value = "";
};

const formatText = (text) => {
  if (!text) return text;

  return text
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const newItemsToShoppingList = (item) => {
  let newEl = document.createElement("li");
  let itemID = item[0];
  let itemValue = item[1];

  newEl.textContent = itemValue;
  
  newEl.addEventListener("click", () => {
    if (newEl.classList.contains('confirm-delete')) {
      let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
      remove(exactLocationOfItemInDB);
      return;
    }
    
    newEl.classList.add('confirm-delete');
    
    setTimeout(() => {
      if (newEl.parentElement) {
        newEl.classList.remove('confirm-delete');
        newEl.textContent = itemValue;
        newEl.style.backgroundColor = '';
        newEl.style.color = '';
      }
    }, 2000);
  });

  shoppingList.append(newEl);
};

const clearShoppingList = () => {
  shoppingList.innerHTML = "";
};

addButton.addEventListener("click", () => {
  let inputValue = inputField.value.trim();

  if(inputValue === "") {
    inputField.placeholder = "Insira um item primeiro!";
    inputField.style.backgroundColor = "#E7B3B5"
    
    setTimeout(() => {
      inputField.placeholder = "Pão";
      inputField.style.backgroundColor = ""
    }, 1500);

    return;
  }

  let formattedValue = formatText(inputValue);

  push(shoppingListInDB, formattedValue);

  inputFieldClear();
});

onValue(shoppingListInDB, (snapshot) => {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());
    clearShoppingList();
    noItensEl.style.display = "none";

    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];
      newItemsToShoppingList(currentItem);
    }
  } else {
    clearShoppingList();
    noItensEl.style.display = "block";
  };
});
