const searchContainer = document.querySelector(".form__request-container");
const cardContainer = document.querySelector(".card-container");
const inputError = document.querySelector(".form__label");
const input = document.querySelector(".form__input");
//Задержка
const debounce = (fn, ms) => {
  let timeout;
  return function () {
    const fnCall = () => {
      fn.apply(this);
    };
    clearTimeout(timeout);
    timeout = setTimeout(fnCall, ms);
  };
};
//Убрать поисковые запросы
const clearSearches = () => {
  searchContainer.querySelectorAll(".form__request").forEach((i) => i.remove());
};
//Удалить карточку
const deleteCard = (e) => {
  if (e.target.closest(".card__delete-icon")) {
    e.target.closest(".card").remove();
  }
};
//Спрятать ошибку поиска
const hideError = () => {
  inputError.classList.remove("form__label_visible");
};
//Показать ошибку поиска
const showError = () => {
  inputError.classList.add("form__label_visible");
};
//Создать новую карточку
const newCard = (i) => {
  clearSearches();
  input.value = "";
  const cardElement = cardContainer
    .querySelector("#card-template")
    .content.querySelector(".card")
    .cloneNode(true);
  const [name, owner, stars] = cardElement.querySelectorAll(".card__info");
  name.textContent = `Name: ${i.name}`;
  owner.textContent = `Owner: ${i.owner.login}`;
  stars.textContent = `Stars: ${i.stargazers_count}`;
  cardContainer.append(cardElement);
};
//Логика поиска
async function search() {
  if (input.value === "") {
    clearSearches();
    hideError();
    return;
  }
  const result = await fetch(
    `https://api.github.com/search/repositories?q=${input.value}`
  ).then((res) => res.json());
  hideError();
  clearSearches();
  const [one, two, three, four, five, ...others] = result.items;
  let arr = [one, two, three, four, five];
  if (one === undefined) {
    showError();
    return;
  }
  arr.forEach((i) => {
    const searchItem = searchContainer
      .querySelector("#request-template")
      .content.querySelector(".form__request")
      .cloneNode(true);
    searchItem.textContent = i.name;
    searchContainer.append(searchItem);
    searchItem.addEventListener("click", () => newCard(i), {
      once: true,
    });
  });
}
//Слушатели
input.addEventListener("keyup", debounce(search, 700), {
  passive: true,
});
cardContainer.addEventListener("click", deleteCard);
