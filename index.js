const requestContainer = document.querySelector(".form__request-container");
const inputError = document.querySelector(".form__label");
const input = document.querySelector(".form__input");
const cardContainer = document.querySelector(".card-container");

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
function clearSearches() {
  document.querySelectorAll(".form__request").forEach((i) => i.remove());
}
async function search() {
  if (input.value === "") {
    clearSearches();
    inputError.classList.remove("form__label-visible");
    return;
  }
  const result = await fetch(
    `https://api.github.com/search/repositories?q=${input.value}`
  ).then((res) => res.json());
  inputError.classList.remove("form__label-visible");
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

    requestContainer.append(searchItem);
    searchItem.addEventListener(
      "click",
      function () {
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
      },
      {
        once: true,
      }
    );
  });
}
input.addEventListener("keyup", debounce(search, 1000), {
  passive: true,
});
cardContainer.addEventListener("click", (e) => {
  if (e.target.closest(".card__delete-icon")) {
    e.target.closest(".card").remove();
  }
});
