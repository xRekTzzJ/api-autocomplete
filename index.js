const searchContainer = document.querySelector(".form__request-container");
const cardContainer = document.querySelector(".card-container");
const inputError = document.querySelector(".form__label");
const input = document.querySelector(".form__input");

const debounce = (fn, ms) => {
  let timeout;
  return function () {
    const fnCall = () => {
      fn.apply(this, arguments);
    };
    clearTimeout(timeout);
    timeout = setTimeout(fnCall, ms);
  };
};
const clearSearches = () => {
  document.querySelectorAll(".form__request").forEach((i) => i.remove());
};
const deleteCard = (e) => {
  if (e.target.closest(".card__delete-icon")) {
    e.target.closest(".card").remove();
  }
};
const newCard = (i) => {
  clearSearches();
  input.value = "";
  const newCard = document
    .querySelector("#card-template")
    .content.querySelector(".card")
    .cloneNode(true);
  const [name, owner, stars] = newCard.querySelectorAll(".card__info");
  name.textContent = `Name: ${i.name}`;
  owner.textContent = `Owner: ${i.owner.login}`;
  stars.textContent = `Stars: ${i.stargazers_count}`;
  cardContainer.append(newCard);
};
async function search() {
  if (input.value === "") {
    clearSearches();
    inputError.classList.remove("form__label_visible");
    return;
  }
  const result = await fetch(
    `https://api.github.com/search/repositories?q=${input.value}`
  ).then((res) => res.json());
  inputError.classList.remove("form__label_visible");
  clearSearches();
  const [one, two, three, four, five, ...others] = result.items;
  let arr = [one, two, three, four, five];
  if (one === undefined) {
    inputError.classList.add("form__label-visible");
    return;
  }
  arr.forEach((i) => {
    const searchItem = document
      .querySelector("#request-template")
      .content.querySelector(".form__request")
      .cloneNode(true);
    searchItem.textContent = i.name;
    searchContainer.append(searchItem);
    searchItem.addEventListener(
      "click",
      () => {
        newCard(i);
      },
      {
        once: true,
      }
    );
  });
}
input.addEventListener("keyup", debounce(search, 700), {
  passive: true,
});
cardContainer.addEventListener("click", deleteCard);
