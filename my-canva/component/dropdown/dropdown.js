const template = `
    <style>
    :host {
        width: 100%;
        position: relative;
      }
      
      .heading {
        padding: 0.7em;
        border-radius: 0.5em;
        border: var(--base-border);
        box-shadow: 2px 2px 0px black;
        outline: none;
        font-size: 16px;
        background-color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      

      .label{
        margin: 0;
        user-select: none;
      }

      .placeholder{
        color: rgb(100,100,100);
      }
      
      .arrow-icon {
        height: 15px;
        width: 15px;
        transform: rotate(180deg);
        transition: transform 0.15s;
        pointer-events: none;
      }

      .toggled .arrow-icon {
        transform: rotate(90deg);
      }

      .options {
        background-color: white;
        position: absolute;
        top: 55px;
        width: 80%;
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        border-radius: 5px;
        border: var(--base-border);
        box-shadow: 2px 2px 0px black;
        overflow: hidden;
        cursor: pointer;
        z-index: 10;
        /*max-height: 0px;*/
        transition: max-height 0.15s, opacity 0.1s ease-in;
        opacity: 0;
        pointer-events: none;
      }
      
      .toggled ~ .options {
        /*max-height: 600px;*/
        opacity: 1;
        pointer-events: auto;
      }
      
      .option {
        position: relative;
        padding: 0.5em 0.75em;
        border-bottom: 2px solid black;
        box-sizing: content-box;
        overflow: hidden;
      }
      
      .option:hover {
        background-color: #d6002738;
      }
      
      .option:last-of-type {
        border-bottom: none;
      }
      
    </style>
    <div class="heading">
        <p class="label">
          Default option
        </p>
        <svg
          class="arrow-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            d="m6.5825 23.792c-0.59182-0.29294-1.805-1.5928-1.9399-2.0784-0.1392-0.50128-0.13604-0.96887 0.01002-1.4827 0.10002-0.35188 0.71096-1.0112 4.0077-4.325l3.8897-3.9098-3.8018-3.8065c-4-4.0049-4.2073-4.2569-4.2108-5.1178-0.0031-0.75811 0.17939-1.1388 0.91951-1.9179 0.38908-0.4096 0.89975-0.83783 1.1348-0.95163 0.54503-0.26384 1.3794-0.26988 1.9271-0.01394 0.27247 0.12732 2.079 1.8706 5.5638 5.3689 5.5646 5.5862 5.3791 5.3641 5.3791 6.4412 0 1.0777 0.18641 0.85474-5.3791 6.4331-3.4124 3.4203-5.2993 5.2396-5.5705 5.3712-0.55141 0.26742-1.377 0.26278-1.9298-0.01084z"
          />
        </svg>
    </div>
    <div class="options"></div>
`;

// Prilagođeni padajući element
class Dropdown extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.ignoreFirst = true;
    this.shadowRoot.innerHTML = template.trim();
    this.heading = this.shadowRoot.querySelector(".heading");
    this.optionPanel = this.shadowRoot.querySelector(".options");
    this.label = this.shadowRoot.querySelector(".label");
    this.options = [];
    this.toggle = this.toggle.bind(this);
    this.closeOnClickOutside = this.closeOnClickOutside.bind(this);

    this.render();
    this.heading.addEventListener("click", this.toggle);
  }

  render() {
    if (this.selected) {
      this.label.textContent = this.selected.title;
      this.label.classList.remove("placeholder");
    } else {
      this.label.classList.add("placeholder");
      this.label.textContent = this.getAttribute("placeholder");
    }
    this.optionPanel.innerHTML = "";
    this.options.forEach((option) => {
      const item = document.createElement("div");
      item.classList.add("option");
      item.textContent = option.title;
      if (this.selected && this.selected === option)
        item.classList.add("selected");
      item.addEventListener("click", () => {
        if (this.selected !== option) {
          this.selectItem(option);
          const event = new CustomEvent("change-item", { detail: option });
          this.dispatchEvent(event);
        }
      });
      this.optionPanel.append(item);
    });
    const btnAdd = document.createElement("div");
    btnAdd.classList.add("option");
    btnAdd.textContent = "+ New Board";
    btnAdd.style.fontStyle = "italic";
    btnAdd.addEventListener("click", () => {
      const event = new Event("new-item");
      this.dispatchEvent(event);
    });
    this.optionPanel.append(btnAdd);
  }

  selectItem(item) {
    this.selected = item;
    this.render();
  }

  toggle(e) {
    if (!this.heading.classList.contains("toggled")) {
      this.heading.classList.add("toggled");
      document.addEventListener("click", this.closeOnClickOutside);
    } else {
      this.heading.classList.remove("toggled");
      document.removeEventListener("click", this.closeOnClickOutside);
      this.ignoreFirst = true;
    }
  }

  closeOnClickOutside(e) {
    if (
      !this.ignoreFirst &&
      !e.target.isEqualNode(this.heading) &&
      !this.optionPanel.contains(e.target)
    ) {
      this.heading.classList.remove("toggled");
      document.removeEventListener("click", this.closeOnClickOutside);
      this.ignoreFirst = true;
    } else {
      this.ignoreFirst = false;
    }
  }

  setOptions(options) {
    this.selected = null;
    this.options = options;
    this.render();
  }
}

customElements.define("app-dropdown", Dropdown);
