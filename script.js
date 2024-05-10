const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");

const apiKey = "20b41a6abe0c51f40e2b0364f591ae1e";

const favorites = [];

function deleteItem(e) {
  e.parentElement.remove();
}

class Favorites {
  constructor(name) {
    this.name = name;
  }

  addFavorite() {
    const newFavorite = {
      inputValue: input,
    };

    return newFavorite;
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  let inputVal = input.value;
  //check if there's already a city
  const listItems = list.querySelectorAll(".ajax-section .city");
  const listItemsArray = Array.from(listItems);

  if (listItemsArray.length > 0) {
    const filteredArray = listItemsArray.filter((el) => {
      let content = "";
      //athens,gr
      if (inputVal.includes(",")) {
        //athens,grrrrrr->invalid country code, so we keep only the first part of inputVal
        if (inputVal.split(",")[1].length > 2) {
          inputVal = inputVal.split(",")[0];
          content = el
            .querySelector(".city-name span")
            .textContent.toLowerCase();
        } else {
          content = el.querySelector(".city-name").dataset.name.toLowerCase();
        }
      } else {
        //athens
        content = el.querySelector(".city-name span").textContent.toLowerCase();
      }

      return content == inputVal.toLowerCase();
    });

    if (filteredArray.length > 0) {
      msg.textContent = `You already know the weather for ${
        filteredArray[0].querySelector(".city-name span").textContent
      } ...otherwise be more specific by providing the country code as well 😉`;
      form.reset();
      input.focus();
      return;
    }
  }

  //ajax here
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=imperial`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // this section will pull out the main, name, sys(country), weather
      const { main, name, sys, weather } = data;
      // this will pull the icon from the response
      const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0]["icon"]}.svg`;

      const li = document.createElement("li");
      li.classList.add("city");
      const d = new Date();
      let actualTime = d.toString();
      const markup = `
        <button onclick="deleteItem(this)">X</button>
         <input onclick="addFavorite()" type="checkbox" name="fav" id="fav">
         <label for="fav" class="fav">Save
         </label>
        <h2 class="city-name" data-name="${name},${sys.country}">
          <span>${name}</span>
          <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°F</sup></div>
        <figure>
          <img class="city-icon" src="${icon}" alt="${
        weather[0]["description"]
      }">
          <figcaption>${weather[0]["description"]}</figcaption>
          <div>${actualTime}</div>
        </figure>
      `;
      li.innerHTML = markup;
      list.appendChild(li);
    })

    .catch(() => {
      msg.textContent = "Please search for a valid city 😩";
    });

  msg.textContent = "";
  form.reset();
  input.focus();
});
