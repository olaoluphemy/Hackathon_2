"use strict";

const state = {
  setupGuideOpen: false,
  checked: [],
  progressBar: [],
  progressBarPercent: 0,
  curMenuList: 0,
};

const init = function () {
  const checkMarks = document.querySelectorAll(".radio-check");
  checkMarks.forEach((_) => state.checked.push(false));

  const guideListTexts = document.querySelectorAll(".content-text");
  guideListTexts.forEach((el, i) => {
    if (i !== 0) {
      el.classList.add("hidden");
    }
  });

  checkMarks.forEach((el, i) => {
    el.setAttribute("data-index", `${i}`);
  });
};
init();

class View {
  #mainContainer = document.querySelector(".main");
  #initials = document.querySelector(".show-menu");
  #bell = document.querySelector(".bell");
  #search = document.querySelector(".search");

  constructor() {}

  addHandlerSearchIcon(handler) {
    this.#search.addEventListener("input", handler);
  }

  addHandlerShowMenu(handler) {
    this.#initials.addEventListener("click", handler);
  }

  addHandlerShowAlerts(handler) {
    this.#bell.addEventListener("click", handler);
  }

  addHandlerHideTrialMessage(handler) {
    const btnCloseTrialMessage = document.querySelector(".btn-close");

    btnCloseTrialMessage.addEventListener("click", handler);
  }

  addHandlerToggleGuideIcon(handler) {
    this.#mainContainer
      .querySelector(".arrow-down")
      .addEventListener("click", handler);
  }

  addHandlerDisplayGuideList(handler) {
    this.#mainContainer.addEventListener("click", handler);
  }

  addHandlerUpdateCheckedList(handler) {
    this.#mainContainer.addEventListener("click", handler);
  }

  addHandlerClosePopupOnKeydown(handler) {
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") handler();
    });
  }

  addHandlerNavigateDownMenu(handler) {
    const menu = document.querySelector(".menu");
    document.addEventListener("keydown", function (e) {
      if (
        !menu.classList.contains("hidden") &&
        (e.key === "ArrowDown" || e.key === "ArrowRight")
      ) {
        e.preventDefault();

        // state.curMenuList++;
        handler();
      }
    });
  }

  addHandlerNavigateUpMenu(handler) {
    const menu = document.querySelector(".menu");
    document.addEventListener("keydown", function (e) {
      if (
        !menu.classList.contains("hidden") &&
        (e.key === "ArrowUp" || e.key === "ArrowLeft")
      ) {
        e.preventDefault();

        handler();
      }
    });
  }

  generateMarkup() {
    return `
    <div class="subscription">
        <p>Extend your trial for $1/month for 3 months on select plans</p>
            <div class="btns">
                <a href="https://www.shopify.com/pricing">
                    <button class="plan">Select a plan</button>
                </a>
                <img
                    class = "btn-close"
                    src="https://crushingit.tech/hackathon-assets/icon-cross.svg"
                    alt=""
                />
            </div>  
    </div>
    `;
  }

  renderTrialMessage() {
    const markup = this.generateMarkup();
    this.#mainContainer.insertAdjacentHTML("afterbegin", markup);
  }
}
const view = new View();

class App {
  menu = document.querySelector(".menu");
  alert = document.querySelector(".alerts");
  constructor() {
    view.renderTrialMessage();
    view.addHandlerHideTrialMessage(this.closeTrialMessage);
    view.addHandlerSearchIcon(this.showSearchIconOnFocus);
    view.addHandlerShowMenu(this.showMenu.bind(this));
    view.addHandlerShowAlerts(this.showAlerts.bind(this));
    view.addHandlerToggleGuideIcon(this.toggleGuideIcon);
    view.addHandlerDisplayGuideList(this.displayGuideListTexts);
    view.addHandlerUpdateCheckedList(this.updateCheckedList.bind(this));
    view.addHandlerClosePopupOnKeydown(this.closePopupsOnkeyDown.bind(this));
    view.addHandlerNavigateDownMenu(this.navigateDownMenuLists);
    view.addHandlerNavigateUpMenu(this.navigateUpMenuLists);
  }

  // hide-search icon on input
  showSearchIconOnFocus() {
    const search = document.querySelector(".search");
    const searchIcon = document.querySelector(".search-icon");

    searchIcon.style.opacity = search.value ? 0 : 1;
  }

  // clears the alert or menu popup when one is open and the other is clicked
  clearPopups(classname) {
    document.querySelector(`${classname}`).classList.add("hidden");
    document.querySelector(`${classname}`).classList.add("hide-menu");
  }

  showMenu() {
    if (!this.alert.classList.contains("hidden")) this.clearPopups(".alerts");

    document.querySelector(".menu").classList.toggle("hidden");
    setTimeout(() => {
      document.querySelector(".menu").classList.toggle("hide-menu");
    }, 300);
  }

  showAlerts() {
    if (!this.menu.classList.contains("hidden")) this.clearPopups(".menu");

    document.querySelector(".alerts").classList.toggle("hidden");
    setTimeout(() => {
      document.querySelector(".alerts").classList.toggle("hide-menu");
    }, 300);
  }

  closePopupsOnkeyDown() {
    if (!this.menu.classList.contains("hidden")) this.clearPopups(".menu");

    if (!this.alert.classList.contains("hidden")) this.clearPopups(".alerts");
  }

  navigateDownMenuLists() {
    const menuList = document.querySelectorAll(".menu-btn");

    state.curMenuList++;
    if (state.curMenuList < menuList.length) {
      menuList[state.curMenuList].focus();
    } else {
      state.curMenuList = 0;
      menuList[state.curMenuList].focus();
    }
  }

  navigateUpMenuLists() {
    const menuList = document.querySelectorAll(".menu-btn");

    state.curMenuList--;
    if (state.curMenuList >= 0) {
      menuList[state.curMenuList].focus();
    } else {
      state.curMenuList = menuList.length - 1;
      menuList[state.curMenuList].focus();
    }
    console.log(state.curMenuList);
  }

  closeTrialMessage() {
    const subscriptionMessage = document.querySelector(".subscription");
    const setup = document.querySelector(".setup");

    subscriptionMessage.style.opacity = 0;
    setup.classList.add("animate");

    // setTimeout(() => {
    //   // subscriptionMessage.remove();
    //   // subscriptionMessage.style.visibility = "hidden";
    //   // subscriptionMessage.style.transform = "translateX(-100%)";
    // }, 1000);
  }

  toggleGuideIcon() {
    state.setupGuideOpen = !state.setupGuideOpen;

    const arrowDown = document.querySelector(".arrow-down");
    arrowDown.src = state.setupGuideOpen
      ? "https://crushingit.tech/hackathon-assets/icon-arrow-up.svg"
      : "https://crushingit.tech/hackathon-assets/icon-arrow-down.svg";

    document.querySelector(".guide-list").classList.toggle("hide-guide-lists");
  }

  displayGuideListTexts(e) {
    const list = e.target.closest(".custom-lists");
    if (!list) return;
    const id = list.dataset.listId;

    const title = document.querySelectorAll(".special");
    const guideListTexts = document.querySelectorAll(".content-text");
    const listContents = document.querySelectorAll(".custom-lists");

    // displays all list titles, hides all list texts and removes active class from previous list element
    guideListTexts.forEach((el, i) => {
      title[i].classList.remove("hidden");
      el.classList.add("hidden");
      listContents[i].classList.remove("active");
    });

    // hides current title, displays current list text and adds active background.
    title[id].classList.add("hidden");
    guideListTexts[id].classList.remove("hidden");
    list.classList.add("active");
  }

  updateCheckedList(e) {
    if (!e.target.classList.contains("radio-check")) return;

    const currentCheckMark = e.target;
    currentCheckMark.style.animationPlayState = "running";
    const id = +currentCheckMark.dataset.index;
    state.checked[id] = !state.checked[id];

    if (state.checked[id]) {
      currentCheckMark.src =
        "https://crushingit.tech/hackathon-assets/icon-spinner.svg";

      currentCheckMark.addEventListener("load", function () {
        currentCheckMark.src = state.checked[id]
          ? "https://crushingit.tech/hackathon-assets/icon-checkmark-circle.svg"
          : "https://crushingit.tech/hackathon-assets/icon-dashed-circle.svg";
      });
    }

    this.updateProgressBar(id);
  }

  updateProgressBar(id) {
    const level = document.querySelector(".completion-level");
    const progressLevel = document.querySelector(".percentage");

    state.checked[id]
      ? state.progressBar.push(id)
      : state.progressBar.splice(-1);

    state.progressBarPercent = `${(state.progressBar.length / 5) * 100}%`;
    progressLevel.style.width = state.progressBarPercent;
    level.textContent = state.progressBar.length;
  }
}

const app = new App();
// app.navigateMenuLists();
// app.checkedListUpdate();
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
// SOON 🙏
// const renderSpinner = function (markup) {
//   // const markup = ;

//   // const markup =
//   document.querySelector(".testing").innerHTML = "";
//   document.querySelector(".testing").insertAdjacentHTML("afterbegin", markup);
// };

// let checked = false;
// document.querySelector(".testing").addEventListener("click", function () {
//   checked = !checked;
//   const image = document.querySelector(".image");
//   image.src =
//     "https://crushingit.tech/hackathon-assets/icon-checkmark-circle.svg";

//   //  "https://crushingit.tech/hackathon-assets/icon-dashed-circle.svg"

//   renderSpinner(`
//   <div class="load"></div>

//   `);

//   image.addEventListener("load", function () {
//     checked
//       ? renderSpinner(`
//     <img
//       class="radio-check image"
//       src="https://crushingit.tech/hackathon-assets/icon-checkmark-circle.svg"
//       alt=""
//     /> `)
//       : renderSpinner(`
//     <img
//       class="radio-check image"
//       src="https://crushingit.tech/hackathon-assets/icon-dashed-circle.svg"
//       alt=""
//     />
// `);
//     // image.src =
//     // "https://crushingit.tech/hackathon-assets/icon-checkmark-circle.svg";
//   });
// });

////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

// checkedListUpdate() {
//   // document.querySelector(".testing").addEventListener("click", function () {
//   document
//     .querySelector(".check-container")
//     .addEventListener("click", function (e) {
//       const renderCheckmark = function (markup) {
//         document.querySelector(".check-container").innerHTML = "";
//         document
//           .querySelector(".check-container")
//           .insertAdjacentHTML("afterbegin", markup);
//       };

//       if (!e.target.closest(".check-container")) return;

//       const currentCheckMark = e.target.closest(".check-container");
//       console.log(currentCheckMark);
//       const id = +currentCheckMark.dataset.index;
//       state.checked[id] = !state.checked[id];
//       const image = currentCheckMark.querySelector(".radio-check");
//       image.src =
//         "https://crushingit.tech/hackathon-assets/icon-checkmark-circle.svg";

//       //  "https://crushingit.tech/hackathon-assets/icon-dashed-circle.svg"

//       renderCheckmark(`
//     <img
//         class="radio-check load"
//         src="https://crushingit.tech/hackathon-assets/icon-spinner.svg"
//         alt=""
//       /> `);

//       image.addEventListener("load", function () {
//         state.checked[id]
//           ? renderCheckmark(`
//       <img
//         class="radio-check image"
//         src="https://crushingit.tech/hackathon-assets/icon-checkmark-circle.svg"
//         alt=""
//       /> `)
//           : renderCheckmark(`
//       <img
//         class="radio-check image"
//         src="https://crushingit.tech/hackathon-assets/icon-dashed-circle.svg"
//         alt=""
//       />
//   `);
//         // image.src =
//         // "https://crushingit.tech/hackathon-assets/icon-checkmark-circle.svg";
//       });
//     });

//   this.updateProgressBar(id);
// }

// app.navigateMenuLists();
// document.querySelector(".search").addEventListener("input", function () {
//   const search = document.querySelector(".search");
//   const searchIcon = document.querySelector(".search-icon-2");

//   searchIcon.style.opacity = search.value ? 0 : 1;
//   console.log("name");
// });

// console.log(document.querySelector(".search"));

// search.addEventListener("input", function () {
//   document.querySelector(".search-icon").style.opacity = 1;
//   if (!search.value) return;

//   if (search.value) document.querySelector(".search-icon").style.opacity = 0;
// });

// const dsiplayTrialMessage = function () {
//   const html = `
//     <div class="subscription">
//         <p>Extend your trial for $1/month for 3 months on select plans</p>
//             <div class="btns">
//                 <a href="https://www.shopify.com/pricing">
//                     <button class="plan">Select a plan</button>
//                 </a>
//                 <img
//                     class = "btn-close"
//                     src="https://crushingit.tech/hackathon-assets/icon-cross.svg"
//                     alt=""
//                 />
//             </div>
//   </div>
//     `;

//   mainContainer.insertAdjacentHTML("afterbegin", html);
// };
// dsiplayTrialMessage();

// const showMenu = function () {
//   document.querySelector(".menu").classList.toggle("hide-menu");
// };

// const initials = document.querySelector(".initials");
// initials.addEventListener("click", showMenu);

// const btnClose = document.querySelector(".btn-close");

// btnClose.addEventListener("click", function (e) {
//   const subscriptionMessage = document.querySelector(".subscription");
//   subscriptionMessage.style.visibility = "hidden";
// });

// let setupGuideOpen = false;

// arrowDown.addEventListener("click", function () {
//   setupGuideOpen = !setupGuideOpen;

//   arrowDown.src = setupGuideOpen
//     ? "https://crushingit.tech/hackathon-assets/icon-arrow-up.svg"
//     : "https://crushingit.tech/hackathon-assets/icon-arrow-down.svg";

//   guideList.classList.toggle("hide-guide-lists");
// });

// mainContainer.addEventListener("click", function (e) {
//   const list = e.target.closest(".custom-lists");
//   if (!list) return;
//   const id = list.dataset.listId;

//   guideListTexts.forEach((el, i) => {
//     title[i].classList.remove("hidden");
//     el.classList.add("hidden");
//     listContents[i].classList.remove("active");
//   });

//   title[id].classList.add("hidden");
//   guideListTexts[id].classList.remove("hidden");
//   list.classList.add("active");
// });

// let checked = false;

// mainContainer.addEventListener("click", function (e) {
//   if (!e.target.classList.contains("radio-check")) return;
//   const currentCheckMark = e.target;
//   const id = +currentCheckMark.dataset.index;
//   state.checked[id] = !state.checked[id];
//   const level = document.querySelector(".completion-level");

//   // const radioCheck = e.target;

//   if (state.checked[id]) {
//     currentCheckMark.src =
//       "https://crushingit.tech/hackathon-assets/icon-spinner.svg";

//     currentCheckMark.addEventListener("load", function () {
//       currentCheckMark.src = state.checked[id]
//         ? "https://crushingit.tech/hackathon-assets/icon-checkmark-circle.svg"
//         : "https://crushingit.tech/hackathon-assets/icon-dashed-circle.svg";
//     });

//     state.progressBar.push(e.target.dataset.index);
//     state.progressBarPercent = `${(state.progressBar.length / 5) * 100}%`;
//     progressLevel.style.width = state.progressBarPercent;
//     level.textContent = state.progressBar.length;
//   }

//   if (!state.checked[id]) state.progressBar.splice(-1);
//   state.progressBarPercent = `${(state.progressBar.length / 5) * 100}%`;
//   progressLevel.style.width = state.progressBarPercent;
//   level.textContent = state.progressBar.length;
// });
