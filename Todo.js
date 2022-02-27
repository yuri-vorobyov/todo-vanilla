const template = `
<style>  
  :host {
    border: 1px solid grey;
    border-radius: 0.2rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: #f2f2b6;
    transition: filter 0.4s;
  }

  :host(:not(.completed):hover) {
    box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.35);
  }

  :host(.completed) {
    filter: grayscale(100%) opacity(50%);
  }

  #checkbox {
    flex: 0 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    background-color: white;
    width: 1.5rem;
    height: 1.5rem;
    font-size: 1.5rem;
    padding-bottom: 2px;
    margin: 0 0.5rem;
    color: #45450c;
    user-select: none;
    transition: 0.1s;
    border: 2px solid #45450c;
    border-radius: 2px;
  }

  #checkbox:hover {
    box-shadow: 0 0 10px inset rgba(206, 206, 235, 0.85);
  }

  #checkbox:active {
    position: relative;
    top: 0.1rem;
  }

  #text {
    flex: 1 1 auto;
    margin: 0.6rem 0.5rem;
    color: rgb(15, 15, 15);
    padding: 2px;
  }

  #text.urgent {
    font-weight: bold;
  }

  :host(:focus) {
    outline: none;
  }

  :host(:focus) #text {
    background-color: rgba(255, 255, 255, 0.5);
    border: 1px solid grey;
  }

  #toolbox-placeholder {
    display: flex;
    flex-direction: column;  /* to be able to use align-self for horizontal alignment */
    flex: 0 0 auto;
    box-sizing: border-box;
    width: 1.6rem;
    height: 2rem;
  }

  #toolbox {
    align-self: end;  /* anchor to the rhs inside the placeholder*/
    display: flex;            /* to                  */
    justify-content: center;  /*    align            */
    align-items: center;      /*          the ⋮ icon */
    box-sizing: border-box;
    height: 100%;  /* inherit the                  */
    width: 100%;   /*             placeholder size */
    font-size: 1.5rem;
    user-select: none;
    transition: 0.4s;
    cursor: pointer;
    border-radius: 0.5rem;
    overflow: hidden;
  }

  #toolbox:hover {
    background-color: rgba(250, 250, 250, 0.9);
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.25);
  }

  #toolbox.active {
    width: 6rem;
    background-color: rgba(250, 250, 250, 0.9);
    border: 1px solid lightgrey;
    justify-content: space-around;
  }

  #toolbox span svg { fill: #45450c; }

  #toolbox span:first-child {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  #toolbox.active span:not(:first-child) {
    height: 1.5rem;
    width: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #toolbox.active span:last-child {
    cursor: ns-resize;
  }

  #toolbox span:not(:first-child):hover {
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.35);
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 3px;
  }

  #toolbox span:not(:first-child) { display: none; }
  #toolbox.active span:first-child { display: none; }
</style>

<div id="checkbox"></div>
<p id="text">
  <slot></slot>
</p>
<div id="toolbox-placeholder">
  <div id="toolbox">
    <span>
      <svg width="16px" height="16px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path d="M8,12 C9.10457,12 10,12.8954 10,14 C10,15.1046 9.10457,16 8,16 C6.89543,16 6,15.1046 6,14 C6,12.8954 6.89543,12 8,12 Z M8,6 C9.10457,6 10,6.89543 10,8 C10,9.10457 9.10457,10 8,10 C6.89543,10 6,9.10457 6,8 C6,6.89543 6.89543,6 8,6 Z M8,-8.74228041e-08 C9.10457,-8.74228041e-08 10,0.89543 10,1.99999991 C10,3.10457 9.10457,3.99999991 8,3.99999991 C6.89543,3.99999991 6,3.10457 6,1.99999991 C6,0.895431 6.89543,-8.74228041e-08 8,-8.74228041e-08 Z"/>
      </svg>
    </span>
    <span id="delete">
      <svg width="16px" height="16px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path d="M14,3 C14.5522847,3 15,3.44771525 15,4 C15,4.55228475 14.5522847,5 14,5 L13.846,5 L13.1420511,14.1534404 C13.0618518,15.1954311 12.1930072,16 11.1479,16 L4.85206,16 C3.80698826,16 2.93809469,15.1953857 2.8579545,14.1533833 L2.154,5 L2,5 C1.44771525,5 1,4.55228475 1,4 C1,3.44771525 1.44771525,3 2,3 L5,3 L5,2 C5,0.945642739 5.81588212,0.0818352903 6.85073825,0.00548576453 L7,0 L9,0 C10.0543573,0 10.9181647,0.815882118 10.9945142,1.85073825 L11,2 L11,3 L14,3 Z M11.84,5 L4.159,5 L4.85206449,14.0000111 L11.1479,14.0000111 L11.84,5 Z M9,2 L7,2 L7,3 L9,3 L9,2 Z"/>
      </svg>
    </span>
    <span id="edit">
      <svg width="16px" height="16px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M5,15 L1,15 L1,11 L10.4139,1.58609 C11.195,0.805042 12.4613,0.805044 13.2423,1.58609 L14.4139,2.75767 C15.195,3.53871 15.195,4.80504 14.4139,5.58609 L5,15 Z M3.33999,11.4884 L4.51157,12.66 L10.4157,6.75586 L9.24414,5.58429 L3.33999,11.4884 Z M12.9997,4.17188 L11.8299,5.34165 L10.6584,4.17008 L11.8281,3.0003 L12.9997,4.17188 Z"/>
      </svg>
    </span>
    <span id="dragHandle">
      <svg width="16px" height="16px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M7.01909811,12.2017379 L7.11331,12.2849 L8.00017,13.1715 L8.88679,12.285 C9.27732,11.8945 9.91046,11.8946 10.301,12.2851 C10.6614615,12.6455615 10.6891893,13.2128207 10.3841834,13.6050973 L10.301,13.6993 L8.00017,16 L5.6992,13.6993 C5.30862,13.3088 5.3086,12.6756 5.69915,12.285 C6.05961154,11.9245385 6.62679402,11.8968107 7.01909811,12.2017379 Z M9,7 C9.55228,7 10,7.44772 10,8 C10,8.51283143 9.61395571,8.93550653 9.11662025,8.9932722 L9,9 L7,9 C6.44772,9 6,8.55228 6,8 C6,7.48716857 6.38604429,7.06449347 6.88337975,7.0067278 L7,7 L9,7 Z M14,7 C14.5523,7 15,7.44772 15,8 C15,8.55228 14.5523,9 14,9 L12,9 C11.4477,9 11,8.55228 11,8 C11,7.44772 11.4477,7 12,7 L14,7 Z M2,7 L4,7 C4.55228,7 5,7.44772 5,8 C5,8.51283143 4.61395571,8.93550653 4.11662025,8.9932722 L4,9 L2,9 C1.44772,9 1,8.55228 1,8 C1,7.48716857 1.38604429,7.06449347 1.88337975,7.0067278 L2,7 L4,7 L2,7 Z M8.00017,-1.02140518e-14 L10.301,2.30064 C10.6915,2.69116 10.6915,3.32436 10.301,3.71489 C9.91046,4.1054 9.27732,4.10542 8.88679,3.71494 L8.00017,2.82842 L7.11331,3.71503 C6.72276,4.10548 6.08965,4.10543 5.69915,3.71494 C5.3086,3.32438 5.30862,2.69115 5.6992,2.30062 L8.00017,-1.02140518e-14 Z"/>
      </svg>
    </span>
  </div>
</div>
`;

export default class Todo extends HTMLElement {
  #completed = false;
  #toolboxActive = false;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(Todo.template.content.cloneNode(true));

    this.text = this.shadowRoot.getElementById("text");
    this.checkbox = this.shadowRoot.getElementById("checkbox");
    this.toolbox = this.shadowRoot.getElementById("toolbox");
    this.deleteButton = this.shadowRoot.getElementById("delete");
    this.editButton = this.shadowRoot.getElementById("edit");
    this.dragHandle = this.shadowRoot.getElementById("dragHandle");

    this.checkbox.addEventListener("click", this.checkboxClick.bind(this));
    this.toolbox.addEventListener("click", this.toolboxClick.bind(this));
    this.deleteButton.addEventListener("click", this.deleteClick.bind(this));
    this.editButton.addEventListener("click", this.editClick.bind(this));
    this.dragHandle.addEventListener("mousedown", this.grab.bind(this));

    this.addEventListener("keydown", this.keyDown.bind(this));
    this.addEventListener("blur", this.onBlur.bind(this));

    this.addEventListener("click", this.containerClick.bind(this));
  }

  get completed() {
    return this.#completed;
  }

  /**
   * Once `completed` property gets changed, `completed` event
   * gets dispatched with `event.detail.completed` equal to the
   * new value.
   */
  set completed(value) {
    if (value !== this.#completed) {
      this.#completed = value;
      // toggle check mark
      this.checkbox.textContent = this.#completed ? "✔" : "";
      // and styling (only change of value is processed here so `toggle` will suffice)
      this.classList.toggle("completed");
      // dispatching custom event
      this.dispatchEvent(
        new CustomEvent("completed", {
          detail: {
            completed: this.completed,
          },
        })
      );
    }
  }

  get toolboxActive() {
    return this.#toolboxActive;
  }

  set toolboxActive(value) {
    if (value !== this.toolboxActive) {
      this.#toolboxActive = value;
      this.toolbox.classList.toggle("active");
    }
  }

  /**
   * User clicks somewhere inside the container.
   * @param {PointerEvent} event
   */
  containerClick(event) {
    // console.log("container clicked");
    if (event.composedPath().includes(this.toolbox)) {
      this.toolboxActive = !this.toolboxActive;
    } else {
      if (this.toolboxActive) {
        this.toolboxActive = false;
      }
    }
  }

  /**
   * User clicks the "completed" checkbox.
   * @param {PointerEvent} event
   */
  checkboxClick(event) {
    this.completed = !this.completed;
    event.stopImmediatePropagation();
  }

  /**
   * User clicks the toolbox.
   * @param {PointerEvent} event
   */
  toolboxClick(event) {
    // console.log("toolbox clicked");
    this.toolboxActive = !this.toolboxActive;
    event.stopImmediatePropagation();
  }

  deleteClick(event) {
    // console.log("delete clicked");
    event.stopImmediatePropagation();
    this.dispatchEvent(new CustomEvent("delete"));
  }

  editClick(event) {
    this.editStart();
    event.stopImmediatePropagation();
  }

  keyDown(event) {
    /* Enter key */
    if (event.keyCode === 13) {
      event.preventDefault();
      this.blur();
    }
  }

  onBlur(event) {
    if (this.getAttribute("contenteditable")) this.editEnd();
  }

  editStart() {
    /* enabling editing */
    this.setAttribute("contenteditable", "true");
    /* moving caret to the end of text */
    const range = document.createRange();
    range.selectNodeContents(this);
    range.collapse(false);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    /* closing toolbox */
    this.toolboxActive = false;
  }

  editEnd() {
    this.removeAttribute("contenteditable");
    this.dispatchEvent(new CustomEvent("editend"));
  }

  /**
   * User grabs the grab handle to move a todo item.
   * @param {PointerEvent} event
   */
  grab(event) {
    if (event.buttons === 1) {
      const grabEvent = new MouseEvent("grab", event);
      this.dispatchEvent(grabEvent);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`${name} : ${oldValue} -> ${newValue}`);
    if (name === "urgent") {
      if (newValue !== null) {
        this.text.classList.add("urgent");
      } else {
        this.text.classList.remove("urgent");
      }
    }
  }
}

Todo.template = document.createElement("template");
Todo.template.innerHTML = template;

Todo.observedAttributes = ["urgent"];

customElements.define("to-do", Todo);
