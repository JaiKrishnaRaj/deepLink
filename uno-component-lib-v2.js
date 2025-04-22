class FileUpload extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });

    // Create root container
    const container = document.createElement("div");
    container.className = "upload-container";

    // Dropzone area
    const dropzone = document.createElement("label");
    dropzone.className = "upload-dropzone";
    dropzone.innerHTML = `
      <img src="https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/file-upload-icon.png" class="upload-icon" />
      <p class="upload-text">Tap to upload</p>
      <p class="upload-subtext">PDF, PNG, JPG or GIF (max. 6MB)</p>
      <input type="file" id="file-input" multiple />
    `;

    // File list area
    const fileList = document.createElement("div");
    fileList.className = "file-list";

    container.appendChild(dropzone);
    container.appendChild(fileList);

    const style = document.createElement("style");
    style.textContent = `
      .upload-container {
        font-family: Inter, sans-serif;
        width: 100%;
        background-color: #11131a;
        padding: 20px;
        box-sizing: border-box;
        color: white;
      }
      .upload-dropzone {
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 12px;
        background-color: #18181b;
        padding: 24px;
        cursor: pointer;
        text-align: center;
        margin-bottom: 20px;
      }
      .upload-dropzone input {
        display: none;
      }
      .upload-icon {
        width: 32px;
        height: 32px;
        margin-bottom: 8px;
      }
      .upload-text {
        font-size: 14px;
        font-weight: 600;
        margin: 0;
      }
      .upload-subtext {
        font-size: 12px;
        color: #a1a1aa;
        margin: 4px 0 0;
      }

      .file-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .file-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 12px;
        padding: 12px;
        background-color: #18181b;
      }
      .file-icon {
        width: 28px;
        height: 28px;
        margin-right: 12px;
      }
      .file-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .file-name {
        font-size: 14px;
        font-weight: 500;
        color: white;
      }
      .file-size {
        font-size: 12px;
        color: #a1a1aa;
      }
      .progress-bar {
        height: 6px;
        background-color: #3f3f46;
        border-radius: 6px;
        overflow: hidden;
      }
      .progress {
        height: 100%;
        background-color: #a855f7;
        width: 80%;
        transition: width 0.3s ease;
      }
      .file-delete {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
      }
      .file-delete img {
        width: 18px;
        height: 18px;
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(container);

    this.fileInput = dropzone.querySelector("#file-input");
    this.fileList = fileList;
    this.files = [];

    this.fileInput.addEventListener("change", this.handleFileUpload.bind(this));
  }

  handleFileUpload(event) {
    const newFiles = Array.from(event.target.files);
    const maxSize = 6 * 1024 * 1024;

    for (const file of newFiles) {
      if (file.size > maxSize) {
        alert(`File "${file.name}" exceeds 6MB limit.`);
        continue;
      }

      if (this.files.find(f => f.name === file.name)) {
        alert(`File "${file.name}" is already added.`);
        continue;
      }

      this.files.push(file);
      this.renderFileItem(file);
    }

    this.fileInput.value = "";
  }

  renderFileItem(file) {
    const fileItem = document.createElement("div");
    fileItem.className = "file-item";

    const icon = document.createElement("img");
    icon.className = "file-icon";
    icon.src =
      file.type === "application/pdf"
        ? "https://icons.iconarchive.com/icons/graphicloads/filetype/512/pdf-icon.png"
        : "https://icons.iconarchive.com/icons/papirus-team/papirus-mimetypes/512/image-x-generic-icon.png";

    const info = document.createElement("div");
    info.className = "file-info";
    info.innerHTML = `
      <div class="file-name">${file.name}</div>
      <div class="file-size">${(file.size / 1024).toFixed(0)} KB</div>
      <div class="progress-bar">
        <div class="progress"></div>
      </div>
    `;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "file-delete";
    deleteBtn.innerHTML = `<img src="https://icons.iconarchive.com/icons/google/noto-emoji-objects/256/62827-wastebasket-icon.png" alt="delete" />`;
    deleteBtn.addEventListener("click", () => {
      this.files = this.files.filter(f => f.name !== file.name);
      fileItem.remove();
    });

    fileItem.appendChild(icon);
    fileItem.appendChild(info);
    fileItem.appendChild(deleteBtn);
    this.fileList.appendChild(fileItem);
  }
}

customElements.define("file-upload", FileUpload);


class CustomLabel extends HTMLElement {
  static get observedAttributes() {
    return [
      "text",
      "font-size",
      "color",
      "font-family",
      "line-height",
      "text-align",
      "font-weight",
    ];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Create elements
    this.container = document.createElement("div");
    this.container.classList.add("label-container");

    this.labelElement = document.createElement("div");
    this.labelElement.classList.add("label-text");

    // Append elements to the container
    this.container.appendChild(this.labelElement);
    this.shadowRoot.appendChild(this.container);

    // Create and append style
    const style = document.createElement("style");
    style.textContent = `
              .label-container {
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  padding: 10px 0px 10px 0px;
                  // background-color: #000000;
                  width: 100%;
                  height: 100%; /* Ensure the container takes full height */
                  margin-bottom: 8px;
              }
              .label-text {
                  font-size: var(--font-size, 24px);
                  color: var(--color, #ffffff);
                  font-family: var(--font-family, Denton, playfair, sans-serif);
                  line-height: var(--line-height, 1.2em);
                  text-align: var(--text-align, left);
                  font-weight: var(--font-weight, normal);
                  width: 100%; /* Ensure the text element takes full width */
              }
          `;
    this.shadowRoot.appendChild(style);
  }

  connectedCallback() {
    this.updateContent();
    this.updateStyle();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.updateContent();
    this.updateStyle();
  }

  get text() {
    return this.getAttribute("text");
  }

  set text(value) {
    this.setAttribute("text", value);
  }

  updateContent() {
    const text = this.getAttribute("text") || "Label";
    this.labelElement.textContent = text;
  }

  updateStyle() {
    const fontSize = this.getAttribute("font-size") || "1.8em";
    const color = this.getAttribute("color") || "#ffffff";
    const fontFamily = this.getAttribute("font-family") || "Inter";
    const lineHeight = this.getAttribute("line-height") || "1.2em";
    const textAlign = this.getAttribute("text-align") || "left";
    const fontWeight = this.getAttribute("font-weight") || "normal";

    this.labelElement.style.fontSize = fontSize;
    this.labelElement.style.color = color;
    this.labelElement.style.fontFamily = fontFamily;
    this.labelElement.style.lineHeight = lineHeight;
    this.labelElement.style.textAlign = textAlign;
    this.labelElement.style.fontWeight = fontWeight;
  }
}

class SubtitleText extends HTMLElement {
  static get observedAttributes() {
    return ["text", "font-size", "font-color", "font-family", "text-align"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Create elements
    this.container = document.createElement("div");
    this.container.classList.add("text-container");

    this.textElement = document.createElement("p");
    this.textElement.classList.add("text-content");

    // Append elements to the container
    this.container.appendChild(this.textElement);
    this.shadowRoot.appendChild(this.container);

    // Create and append style
    const style = document.createElement("style");
    style.textContent = `
              .text-container {
                  width: 100%;
                  height: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  padding: 0px;
                  margin-bottom: 32px;
              }
              .text-content {
                  font-size: var(--font-size, 0.8em);
                  color: var(--font-color, #aaaaaa);
                  font-family: var(--font-family, Gilroy, Inter);
                  text-align: center;
                  margin: 0;
                  line-height: 140%;
                  width: 100%;
              }
          `;
    this.shadowRoot.appendChild(style);
  }

  connectedCallback() {
    this.updateContent();
    this.updateStyle();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.updateContent();
    this.updateStyle();
  }

  updateContent() {
    this.textElement.textContent = this.getAttribute("text") || "";
  }

  updateStyle() {
    this.textElement.style.fontSize = this.getAttribute("font-size") || "0.8em";
    this.textElement.style.color = this.getAttribute("font-color") || "#aaaaaa";
    this.textElement.style.fontFamily =
      this.getAttribute("font-family") || "Inter";
    this.textElement.style.textAlign =
      this.getAttribute("text-align") || "left";
  }
}

class SecondaryButton extends HTMLElement {
  static get observedAttributes() {
    return [
      "font-size",
      "background-color",
      "font-color",
      "label",
      "shadow",
      "image-url",
      "trailing-image-url",
      "font-family",
      "btn-border",
      "disabled",
      "disabled-bg-color",
      "disabled-font-color",
    ];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Create elements
    this.button = document.createElement("button");
    this.button.classList.add("custom-button");

    this.leadingImg = document.createElement("img");
    this.leadingImg.classList.add("button-image");

    this.label = document.createElement("span");
    this.label.classList.add("button-label");

    this.trailingImg = document.createElement("img");
    this.trailingImg.classList.add("trailing-image");

    // Append elements to the button
    this.button.append(this.leadingImg, this.label, this.trailingImg);
    this.shadowRoot.appendChild(this.button);

    // Create and append style
    const style = document.createElement("style");
    style.textContent = `
              .custom-button {
                  position: fixed;
                  bottom: 36px;
                  margin-top: auto;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  padding: 15px 25px;
                  border: none;
                  border-radius: 6px;
                  cursor: pointer;
                  text-align: center;
                  font-family: Gilroy, Lato, sans-serif; /* Default font family */
                  width: 88.5%;
              }
              .custom-button:disabled {
                  cursor: not-allowed;
                  box-shadow: none;
              }
              .button-image, .trailing-image {
                  max-height: 24px; /* Adjust as needed */
              }
              .button-image {
                  margin-right: 10px;
                  display: none; /* Initially hidden */
              }
              .trailing-image {
                  margin-left: 10px;
                  display: none; /* Initially hidden */
              }
              .button-label {
                  display: inline-block;
                  text-align: center;
                  font-weight: 500;
              }
          `;
    this.shadowRoot.appendChild(style);

    // Add click event listener
    this.button.addEventListener("click", () => {
      if (!this.button.disabled) {
        this.dispatchEvent(
          new CustomEvent("button-click", {
            detail: { message: "Button clicked!" },
            bubbles: true,
            composed: true,
          })
        );
      }
    });
  }

  connectedCallback() {
    this.updateStyle();
    this.updateContent();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "disabled") {
      this.updateDisabledState();
    }
    this.updateStyle();
    this.updateContent();
  }

  get disabled() {
    return this.hasAttribute("disabled");
  }

  set disabled(value) {
    if (value) {
      this.setAttribute("disabled", "yes");
    } else {
      this.removeAttribute("disabled");
    }
    this.updateDisabledState();
  }

  updateDisabledState() {
    this.button.disabled = this.getAttribute("disabled") === "yes";
    this.updateStyle();
  }

  updateContent() {
    this.label.textContent = this.getAttribute("label") || "Upload Documents";

    const leadingImageUrl = this.getAttribute("image-url");
    if (leadingImageUrl && leadingImageUrl != "null") {
      this.leadingImg.src = leadingImageUrl;
      this.leadingImg.style.display = "inline-block";
    } else {
      this.leadingImg.style.display = "none";
    }

    const trailingImageUrl = this.getAttribute("trailing-image-url");
    if (trailingImageUrl && trailingImageUrl != "null") {
      this.trailingImg.src = trailingImageUrl;
      this.trailingImg.style.display = "inline-block";
    } else {
      this.trailingImg.style.display = "none";
    }
  }

  updateStyle() {
    this.button.style.fontSize = this.getAttribute("font-size") || "1em";
    this.button.style.backgroundColor =
      this.getAttribute("background-color") || "#54B39A";
    this.button.style.color = this.getAttribute("font-color") || "#FFFFFF";
    this.button.style.boxShadow = this.getAttribute("shadow") || "2px 2px grey";
    this.button.style.fontFamily = this.getAttribute("font-family") || "Inter";
    this.button.style.border =
      this.getAttribute("btn-border") || "0px solid #000000";

    if (this.button.disabled) {
      this.button.style.backgroundColor =
        this.getAttribute("disabled-bg-color") || "#8A8A8A";
      this.button.style.color =
        this.getAttribute("disabled-font-color") || "#FFFFFF50";
      this.button.style.boxShadow = "none";
    }
  }
}

class CustomDropdown extends HTMLElement {
  static get observedAttributes() {
    return [
      "label",
      "blacklist1",
      "options",
      "label-font-size",
      "label-font-color",
      "label-font-family",
      "label-font-weight",
      "option-font-size",
      "option-font-color",
      "option-font-family",
      "option-font-weight",
      "selected",
      "placeholder",
      "value",
      "limit",
    ];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const container = document.createElement("div");
    container.classList.add("dropdown-container");

    this.labelElement = document.createElement("label");
    this.labelElement.classList.add("dropdown-label");

    this.selectElement = document.createElement("select");
    this.selectElement.classList.add("dropdown-select");

    container.append(this.labelElement, this.selectElement);
    this.shadowRoot.append(container);

    const style = document.createElement("style");
    style.textContent = `
          .dropdown-container {
            display: flex;
            flex-direction: column;
            margin-bottom: 16px;
          }
          .dropdown-label {
            font-size: 12px;
            color: #FFFFFFCC;
            font-weight: 400;
            margin-bottom: 4px;
            font-family: Inter, Inter;
            padding: 0 4px 0 4px;
          }
          .dropdown-select {
            font-size: 14px;
            color: #ffffff;
            background-color: #191919;
            border: 1px solid #FFFFFF66;
            padding: 12px;
            border-radius: 5px;
            width: auto;
            font-family: Inter, Inter;
            font-weight: 400;
            appearance: none;
            background-image: url('https://kycdev-hyperverge-co.s3.ap-south-1.amazonaws.com/audit-portal/dev/workflow-builder/logos/clientIds/unobank_ph/down.png');
            background-repeat: no-repeat;
            background-position: right 10px center;
            background-size: 20px 20px
          }
          .dropdown-select option {
            color: #ffffff;
            background-color: #1f1f1f;
            font-family: Inter, Inter;
            font-weight: 400;
          }
          .dropdown-select option[selected] {
            background-color: #383838;
          }
        `;
    this.shadowRoot.append(style);

    this.value = this.selectElement.value;
    this.limit = 1;
    this.text = "";

    this.selectElement.addEventListener("change", this.handleChange.bind(this));

    this.initialized = true;
  }

  connectedCallback() {
    this.updateComponent();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.updateComponent();
  }

  parseOptions(options) {
    const result = {};

    if (typeof options !== "string") {
      return {};
    }

    const keyValuePairs = options.split(",");

    if (keyValuePairs.length % 3 !== 0) {
      return result;
    }

    for (let i = 0; i < keyValuePairs.length; i += 3) {
      const key = keyValuePairs[i].trim();
      const value = keyValuePairs[i + 1].trim();
      const limit = keyValuePairs[i + 2].trim();
      if (
        key == this.getAttribute("blacklist1") ||
        key == this.getAttribute("blacklist2")
      )
        continue;
      result[key] = {
        value: value,
        limit: limit,
      };
    }

    return result;
  }

  updateComponent() {
    this.updateLabel();
    this.updateSelect();
  }

  updateLabel() {
    const label = this.getAttribute("label") || "Document Type";
    const labelFontSize = this.getAttribute("label-font-size") || "12px";
    const labelFontColor = this.getAttribute("label-font-color") || "#FFFFFFCC";
    const labelFontFamily =
      this.getAttribute("label-font-family") || "Inter, Inter";
    const labelFontWeight = this.getAttribute("label-font-weight") || "400";

    this.labelElement.textContent = label;
    this.labelElement.style.fontSize = labelFontSize;
    this.labelElement.style.color = labelFontColor;
    this.labelElement.style.fontFamily = labelFontFamily;
    this.labelElement.style.fontWeight = labelFontWeight;
  }

  updateSelect() {
    const options = this.getAttribute("options")
      ? this.parseOptions(this.getAttribute("options"))
      : {};

    const selected = this.getAttribute("selected") || "";
    const placeholder =
      this.getAttribute("placeholder") || "-- Please select an option --";
    const optionFontSize = this.getAttribute("option-font-size") || "14px";
    const optionFontColor = this.getAttribute("option-font-color") || "#ffffff";
    const optionFontFamily =
      this.getAttribute("option-font-family") || "Inter, Inter";
    const optionFontWeight = this.getAttribute("option-font-weight") || "400";

    this.selectElement.innerHTML = ``;

    if (!selected || selected == "null") {
      const firstKey = Object.keys(options)[0];
      if (firstKey) {
        this.setAttribute("selected", firstKey);
        this.value = firstKey;
        this.text = options[firstKey].value;
        this.limit = options[firstKey].limit;
      }
    }

    this.selectElement.innerHTML = "";
    for (const [key, value] of Object.entries(options)) {
      const optionElement = document.createElement("option");
      optionElement.value = key;
      optionElement.textContent = value.value;
      if (key === selected) {
        optionElement.selected = true;
        this.value = key;
        this.text = value.value;
        this.limit = value.limit;
      }
      this.selectElement.append(optionElement);
    }

    this.selectElement.style.fontSize = optionFontSize;
    this.selectElement.style.color = optionFontColor;
    this.selectElement.style.fontFamily = optionFontFamily;
    this.selectElement.style.fontWeight = optionFontWeight;
  }

  handleChange(event) {
    const options = this.getAttribute("options")
      ? this.parseOptions(this.getAttribute("options"))
      : {};
    const selectedValue = this.selectElement.value;

    this.setAttribute("selected", selectedValue);

    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { selected: selectedValue },
        bubbles: true,
        composed: true,
      })
    );
  }

  get selected() {
    return this.getAttribute("selected");
  }

  set selected(value) {
    this.setAttribute("selected", value);
  }
}

class UnoForm1 extends HTMLElement {
  static get observedAttributes() {
    return [
      // File upload attributes
      "file-allowed-file-types",
      "file-max-size",
      "file-max-files",
      "file-header-text",
      "file-font-size",
      "file-font-weight",
      "file-font-color",
      "file-font-family",
      "file-warning-font-size",
      "file-warning-font-weight",
      "file-warning-font-color",
      "file-button-text",
      "file-button-font-size",
      "file-button-font-weight",
      "file-button-font-color",
      "file-button-font-family",
      "file-file-size-error-text",
      "file-max-files-error-text",
      "file-delete-icon",
      "file-image-icon",
      "file-pdf-icon",
      // Secondary button attributes
      "button-font-size",
      "button-background-color",
      "button-font-color",
      "button-label",
      "button-shadow",
      "button-image-url",
      "button-trailing-image-url",
      "button-font-family",
      "button-btn-border",
      "button-disabled-bg-color",
      "button-disabled-font-color",
    ];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const formContainer = document.createElement("div");
    formContainer.classList.add("uno-form1-container");

    this.fileUploadElement = document.createElement("file-upload");
    this.fileUploadElement.setAttribute("id", "fileUploadElement");
    this.submitButton = document.createElement("uno-secondary-button");
    this.submitButton.classList.add("submitButtonTag");
    this.submitButton.setAttribute("id", "submitButton");

    this.crossPlatformFiles = [];
    this.isProcessed = [];
    this.value = "";
    this.fileCount = 0;
    this.visible = "";

    this.codes = [];
    this.messages = [];

    const buttonStyle = document.createElement("style");
    buttonStyle.textContent = `
        .uno-form1-container{
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .submitButtonTag {
           margin-top: auto;
        }
      `;

    formContainer.append(this.fileUploadElement, this.submitButton);
    this.shadowRoot.append(formContainer);

    this.shadowRoot.appendChild(buttonStyle);

    this.fileUploadElement.addEventListener(
      "change",
      this.handleFileSelect.bind(this)
    );

    this.fileUploadElement.addEventListener(
      "change",
      this.handlePasswordChange.bind(this)
    );

    this.fileUploadElement.addEventListener(
      "input",
      this.handlePasswordChange.bind(this)
    );

    this.submitButton.setAttribute(
      "disabled",
      this.areFilesValid() ? "no" : "yes"
    );
  }

  get code_1() {
    return this._code_1;
  }
  set code_1(code) {
    this._code_1 = code;

    this.updateChildComponentsBasedOnSummary();
  }
  get code_2() {
    return this._code_2;
  }
  set code_2(code) {
    this._code_2 = code;

    this.updateChildComponentsBasedOnSummary();
  }
  get code_3() {
    return this._code_3;
  }
  set code_3(code) {
    this._code_3 = code;

    this.updateChildComponentsBasedOnSummary();
  }
  get code_4() {
    return this._code_4;
  }
  set code_4(code) {
    this._code_4 = code;

    this.updateChildComponentsBasedOnSummary();
  }
  get code_5() {
    return this._code_5;
  }
  set code_5(code) {
    this._code_5 = code;

    this.updateChildComponentsBasedOnSummary();
  }
  get code_6() {
    return this._code_6;
  }
  set code_6(code) {
    this._code_6 = code;

    this.updateChildComponentsBasedOnSummary();
  }
  get code_7() {
    return this._code_7;
  }
  set code_7(code) {
    this._code_7 = code;

    this.updateChildComponentsBasedOnSummary();
  }
  get code_8() {
    return this._code_8;
  }
  set code_8(code) {
    this._code_8 = code;

    this.updateChildComponentsBasedOnSummary();
  }
  get code_9() {
    return this._code_9;
  }
  set code_9(code) {
    this._code_9 = code;

    this.updateChildComponentsBasedOnSummary();
  }
  get code_10() {
    return this._code_10;
  }
  set code_10(code) {
    this._code_10 = code;

    this.updateChildComponentsBasedOnSummary();
  }

  get message_1() {
    return this._message_1;
  }
  set message_1(message) {
    this._message_1 = message;

    this.updateChildComponentsBasedOnSummary();
  }
  get message_2() {
    return this._message_2;
  }
  set message_2(message) {
    this._message_2 = message;

    this.updateChildComponentsBasedOnSummary();
  }
  get message_3() {
    return this._message_3;
  }
  set message_3(message) {
    this._message_3 = message;

    this.updateChildComponentsBasedOnSummary();
  }
  get message_4() {
    return this._message_4;
  }
  set message_4(message) {
    this._message_4 = message;

    this.updateChildComponentsBasedOnSummary();
  }
  get message_5() {
    return this._message_5;
  }
  set message_5(message) {
    this._message_5 = message;

    this.updateChildComponentsBasedOnSummary();
  }
  get message_6() {
    return this._message_6;
  }
  set message_6(message) {
    this._message_6 = message;

    this.updateChildComponentsBasedOnSummary();
  }
  get message_7() {
    return this._message_7;
  }
  set message_7(message) {
    this._message_7 = message;

    this.updateChildComponentsBasedOnSummary();
  }
  get message_8() {
    return this._message_8;
  }
  set message_8(message) {
    this._message_8 = message;

    this.updateChildComponentsBasedOnSummary();
  }
  get message_9() {
    return this._message_9;
  }
  set message_9(message) {
    this._message_9 = message;

    this.updateChildComponentsBasedOnSummary();
  }
  get message_10() {
    return this._message_10;
  }
  set message_10(message) {
    this._message_10 = message;

    this.updateChildComponentsBasedOnSummary();
  }

  updateChildComponentsBasedOnSummary() {
    this.codes = [
      this.code_1,
      this.code_2,
      this.code_3,
      this.code_4,
      this.code_5,
      this.code_6,
      this.code_7,
      this.code_8,
      this.code_9,
      this.code_10,
    ];
    this.messages = [
      this.message_1,
      this.message_2,
      this.message_3,
      this.message_4,
      this.message_5,
      this.message_6,
      this.message_7,
      this.message_8,
      this.message_9,
      this.message_10,
    ];

    for (let i = 1; i <= this.fileCount + 1; i++) {
      let item = "",
        warning = "";
      for (let j = 0; j < 10; j++) {
        if (typeof this.codes[j] === "string") {
          if (this.codes[j][0] == i) {
            item = this.fileUploadElement.shadowRoot.getElementById(
              `upload-item-${i - 1}`
            );
            warning = this.fileUploadElement.shadowRoot.getElementById(
              `upload-item-warning-${i - 1}`
            );
            if (item) {
              item.classList.remove("pass");
              item.classList.add("warning");
              if (this.messages[j] == "Invalid Password") {
                item
                  .querySelector(".password-input")
                  ?.classList.add("incorrect-password");
                item
                  .querySelector(".password-label")
                  ?.classList.add("incorrect-password");
              }
              if (this.messages[j]) {
                warning.innerHTML = `${this.messages[j]}`;
                warning.classList.remove("invisible");
                warning.style.marginTop = "8px";
              }
            }
            break;
          }
        } else {
          break;
        }
      }
      if (item === "") {
        item = this.fileUploadElement.shadowRoot.getElementById(
          `upload-item-${i - 1}`
        );

        warning = this.fileUploadElement.shadowRoot.getElementById(
          `upload-item-warning-${i - 1}`
        );
        if (item) {
          item.classList.remove("warning");
          item.classList.add("pass");
          item
            .querySelector(".password-input")
            ?.classList.remove("incorrect-password");
          item
            .querySelector(".password-label")
            ?.classList.remove("incorrect-password");
        }
        if (warning) {
          warning.classList.add("invisible");
          warning.style.marginTop = "0px";
        }
      }
    }

    this.submitButton.setAttribute(
      "disabled",
      this.areFilesValid() ? "no" : "yes"
    );
  }

  areFilesValid() {
    const fileElement = this.fileUploadElement;

    this.fileCount = fileElement.fileCount;

    if (fileElement.shadowRoot) {
      let inputFields = fileElement.shadowRoot.querySelectorAll(
        ".upload-item .password-input"
      );
      for (let i = 0; i < inputFields.length; i++) {
        if (inputFields[i].value == "" || inputFields[i].value == null)
          return false;
      }

      let items = fileElement.shadowRoot.querySelectorAll(".upload-item");

      for (let i = 0; i < items.length; i++) {
        if (items[i].classList.contains("warning")) return false;
      }
    }

    if (this.fileCount == 0 || this.fileCount == undefined) return false;

    return true;
  }

  handleFileSelect(event) {
    const fileElement = this.shadowRoot.querySelector("#fileUploadElement");
    const submit = this.shadowRoot.querySelector("#submitButton");

    const files = fileElement.crossPlatformFiles;
    const fileNames = fileElement.fileNames;
    this.fileCount = fileElement.fileCount;

    this.crossPlatformFiles = [];

    for (let i = 0; i < this.fileCount; i++) {
      let name = fileNames[i].replaceAll(",", "");
      let fileBase64 = files[i];
      let commaIndex = files[i].indexOf(";");
      let type = files[i].substring(5, commaIndex);

      this.crossPlatformFiles.push({
        name: name,
        fileBase64: fileBase64,
        type: type,
      });
    }

    this.isProcessed = fileElement.isProcessed;

    if (this.areFilesValid()) {
      submit.setAttribute("disabled", "no");
    } else {
      submit.setAttribute("disabled", "yes");
    }

    this.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          files: this.shadowRoot.querySelector("#fileUploadElement").files,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  connectedCallback() {
    this.updateChildComponents();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.updateChildComponents();
  }

  handlePasswordChange(event) {
    const fileUploadElement = this.shadowRoot.querySelector("file-upload");

    this.visible = fileUploadElement.passwords.join("|~|");

    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { visible: this.visible },
        bubbles: true,
        composed: true,
      })
    );
  }

  updateChildComponents() {
    // Forward attributes to child components
    for (const attr of UnoForm1.observedAttributes) {
      const childAttrName = attr.replace(/^([^-]*)-/, "");
      let comp = attr.split("-")[0];
      // Convert kebab-case to camelCase
      switch (comp) {
        case "button":
          this.submitButton.setAttribute(
            childAttrName,
            this.getAttribute(attr)
          );
          break;
        case "file":
          this.fileUploadElement.setAttribute(
            childAttrName,
            this.getAttribute(attr)
          );
          break;
      }
    }
  }
}

class UnoForm2 extends HTMLElement {
  static get observedAttributes() {
    return [
      // Dropdown attributes
      "dropdown-label",
      "dropdown-options",
      "dropdown-label-font-size",
      "dropdown-label-font-color",
      "dropdown-label-font-family",
      "dropdown-label-font-weight",
      "dropdown-option-font-size",
      "dropdown-option-font-color",
      "dropdown-option-font-family",
      "dropdown-option-font-weight",
      "dropdown-placeholder",
      "dropdown-value",
      "dropdown-limit",
      "dropdown-selected",
      // File upload attributes
      "file-allowed-file-types",
      "file-header-text",
      "file-max-files",
      "file-max-size",
      "file-font-size",
      "file-font-weight",
      "file-font-color",
      "file-font-family",
      "file-warning-font-size",
      "file-warning-font-weight",
      "file-warning-font-color",
      "file-button-text",
      "file-button-font-size",
      "file-button-font-weight",
      "file-button-font-color",
      "file-button-font-family",
      "file-file-size-error-text",
      "file-max-files-error-text",
      "file-delete-icon",
      "file-image-icon",
      "file-pdf-icon",
      // Secondary button attributes
      "button-font-size",
      "button-background-color",
      "button-font-color",
      "button-label",
      "button-shadow",
      "button-image-url",
      "button-trailing-image-url",
      "button-font-family",
      "button-btn-border",
      "button-disabled-bg-color",
      "button-disabled-font-color",
    ];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const formContainer = document.createElement("div");
    formContainer.classList.add("uno-form2-container");

    this.dropdownElement = document.createElement("uno-dropdown");
    this.dropdownElement.setAttribute("id", "dropdownElement");
    this.fileUploadElement = document.createElement("file-upload");
    this.fileUploadElement.setAttribute("id", "fileUploadElement");
    this.submitButton = document.createElement("uno-secondary-button");
    this.submitButton.classList.add("submitButtonTag");
    this.submitButton.setAttribute("id", "submitButton");

    this.crossPlatformFiles = [];
    this.isProcessed = [];
    this.value = "";
    this.files = [];
    this.filenames = "";
    this.filensizes = "";
    this.fileCount = 0;
    this.enabled = ""; // Dropdown select value
    this.visible = "";
    this.isValid = "https://ind-thomas.hyperverge.co/v1/PHLPayslipOCR";

    const buttonStyle = document.createElement("style");
    buttonStyle.textContent = `
        .uno-form2-container{
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .submitButtonTag {
           margin-top: auto;
        }
      `;

    formContainer.append(
      this.dropdownElement,
      this.fileUploadElement,
      this.submitButton
    );
    this.shadowRoot.append(formContainer);

    this.dropdownElement.addEventListener(
      "change",
      this.handleDropdownSelect.bind(this)
    );

    this.shadowRoot.appendChild(buttonStyle);

    this.fileUploadElement.addEventListener(
      "change",
      this.handleFileSelect.bind(this)
    );

    this.fileUploadElement.addEventListener(
      "change",
      this.handlePasswordChange.bind(this)
    );

    this.fileUploadElement.addEventListener(
      "input",
      this.handlePasswordChange.bind(this)
    );

    this.submitButton.setAttribute(
      "disabled",
      this.areFilesValid() ? "no" : "yes"
    );

    setTimeout(() => {
      this.updateChildComponents();
    }, 10);
  }

  get code_1() {
    return this._code_1;
  }
  set code_1(code) {
    this._code_1 = code;

    this.updateChildComponentsBasedOnSummary();
  }
  get code_2() {
    return this._code_2;
  }
  set code_2(code) {
    this._code_2 = code;

    this.updateChildComponentsBasedOnSummary();
  }
  get code_3() {
    return this._code_3;
  }
  set code_3(code) {
    this._code_3 = code;

    this.updateChildComponentsBasedOnSummary();
  }
  get code_4() {
    return this._code_4;
  }
  set code_4(code) {
    this._code_4 = code;

    this.updateChildComponentsBasedOnSummary();
  }
  get code_5() {
    return this._code_5;
  }
  set code_5(code) {
    this._code_5 = code;

    this.updateChildComponentsBasedOnSummary();
  }
  get code_6() {
    return this._code_6;
  }
  set code_6(code) {
    this._code_6 = code;

    this.updateChildComponentsBasedOnSummary();
  }
  get code_7() {
    return this._code_7;
  }
  set code_7(code) {
    this._code_7 = code;

    this.updateChildComponentsBasedOnSummary();
  }
  get code_8() {
    return this._code_8;
  }
  set code_8(code) {
    this._code_8 = code;

    this.updateChildComponentsBasedOnSummary();
  }
  get code_9() {
    return this._code_9;
  }
  set code_9(code) {
    this._code_9 = code;

    this.updateChildComponentsBasedOnSummary();
  }
  get code_10() {
    return this._code_10;
  }
  set code_10(code) {
    this._code_10 = code;

    this.updateChildComponentsBasedOnSummary();
  }

  get message_1() {
    return this._message_1;
  }
  set message_1(message) {
    this._message_1 = message;

    this.updateChildComponentsBasedOnSummary();
  }
  get message_2() {
    return this._message_2;
  }
  set message_2(message) {
    this._message_2 = message;

    this.updateChildComponentsBasedOnSummary();
  }
  get message_3() {
    return this._message_3;
  }
  set message_3(message) {
    this._message_3 = message;

    this.updateChildComponentsBasedOnSummary();
  }
  get message_4() {
    return this._message_4;
  }
  set message_4(message) {
    this._message_4 = message;

    this.updateChildComponentsBasedOnSummary();
  }
  get message_5() {
    return this._message_5;
  }
  set message_5(message) {
    this._message_5 = message;

    this.updateChildComponentsBasedOnSummary();
  }
  get message_6() {
    return this._message_6;
  }
  set message_6(message) {
    this._message_6 = message;

    this.updateChildComponentsBasedOnSummary();
  }
  get message_7() {
    return this._message_7;
  }
  set message_7(message) {
    this._message_7 = message;

    this.updateChildComponentsBasedOnSummary();
  }
  get message_8() {
    return this._message_8;
  }
  set message_8(message) {
    this._message_8 = message;

    this.updateChildComponentsBasedOnSummary();
  }
  get message_9() {
    return this._message_9;
  }
  set message_9(message) {
    this._message_9 = message;

    this.updateChildComponentsBasedOnSummary();
  }
  get message_10() {
    return this._message_10;
  }
  set message_10(message) {
    this._message_10 = message;

    this.updateChildComponentsBasedOnSummary();
  }

  updateChildComponentsBasedOnSummary() {
    this.codes = [
      this.code_1,
      this.code_2,
      this.code_3,
      this.code_4,
      this.code_5,
      this.code_6,
      this.code_7,
      this.code_8,
      this.code_9,
      this.code_10,
    ];
    this.messages = [
      this.message_1,
      this.message_2,
      this.message_3,
      this.message_4,
      this.message_5,
      this.message_6,
      this.message_7,
      this.message_8,
      this.message_9,
      this.message_10,
    ];

    for (let i = 1; i <= this.fileCount + 1; i++) {
      let item = "",
        warning = "";
      for (let j = 0; j < 10; j++) {
        if (typeof this.codes[j] === "string") {
          if (this.codes[j][0] == i) {
            item = this.fileUploadElement.shadowRoot.getElementById(
              `upload-item-${i - 1}`
            );
            warning = this.fileUploadElement.shadowRoot.getElementById(
              `upload-item-warning-${i - 1}`
            );
            if (item) {
              item.classList.remove("pass");
              item.classList.add("warning");
              if (this.messages[j] == "Invalid Password") {
                item
                  .querySelector(".password-input")
                  ?.classList.add("incorrect-password");
                item
                  .querySelector(".password-label")
                  ?.classList.add("incorrect-password");
              }
              if (this.messages[j]) {
                warning.innerHTML = `${this.messages[j]}`;
                warning.classList.remove("invisible");
                warning.style.marginTop = "8px";
              }
            }
            break;
          }
        } else {
          break;
        }
      }
      if (item === "") {
        item = this.fileUploadElement.shadowRoot.getElementById(
          `upload-item-${i - 1}`
        );

        warning = this.fileUploadElement.shadowRoot.getElementById(
          `upload-item-warning-${i - 1}`
        );
        if (item) {
          item.classList.remove("warning");
          item.classList.add("pass");
          item
            .querySelector(".password-input")
            ?.classList.remove("incorrect-password");
          item
            .querySelector(".password-label")
            ?.classList.remove("incorrect-password");
        }
        if (warning) {
          warning.classList.add("invisible");
          warning.style.marginTop = "0px";
        }
      }
    }

    this.submitButton.setAttribute(
      "disabled",
      this.areFilesValid() ? "no" : "yes"
    );
  }

  areFilesValid() {
    const fileElement = this.fileUploadElement;

    this.fileCount = fileElement.fileCount;

    if (fileElement.shadowRoot) {
      let inputFields = fileElement.shadowRoot.querySelectorAll(
        ".upload-item .password-input"
      );
      for (let i = 0; i < inputFields.length; i++) {
        if (inputFields[i].value == "" || inputFields[i].value == null)
          return false;
      }

      let items = fileElement.shadowRoot.querySelectorAll(".upload-item");

      for (let i = 0; i < items.length; i++) {
        if (items[i].classList.contains("warning")) return false;
      }
    }

    if (this.fileCount == 0 || this.fileCount == undefined) return false;

    return true;
  }

  handleFileSelect(event) {
    const fileElement = this.shadowRoot.querySelector("#fileUploadElement");
    const submit = this.shadowRoot.querySelector("#submitButton");

    const files = fileElement.crossPlatformFiles;
    const fileNames = fileElement.fileNames;
    const fileSizes = fileElement.fileSizes;
    this.fileCount = fileElement.fileCount;
    this.crossPlatformFiles = [];
    this.value = "";
    this.filenames = "";
    this.filesizes = "";
    this.files = [];

    for (let i = 0; i < this.fileCount; i++) {
      let name = fileNames[i].replaceAll(",", "");
      let fileBase64 = files[i];
      let commaIndex = files[i].indexOf(";");
      let type = files[i].substring(5, commaIndex);

      this.crossPlatformFiles.push({
        name: name,
        fileBase64: fileBase64,
        type: type,
      });

      this.value += this.value ? "," : "";
      this.filenames += this.filenames ? "," : "";
      this.filesizes += this.filesizes ? "," : "";
      this.value += fileBase64;
      this.files.push(fileBase64);
      this.filenames += name;
      this.filesizes += fileSizes[i];
    }
    this.isProcessed = fileElement.isProcessed;

    if (this.areFilesValid()) {
      submit.setAttribute("disabled", "no");
    } else {
      submit.setAttribute("disabled", "yes");
    }

    this.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          files: this.shadowRoot.querySelector("#fileUploadElement").files,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  connectedCallback() {
    this.updateChildComponents();
  }

  handleDropdownSelect(event) {
    const dropdownElement = this.shadowRoot.querySelector("uno-dropdown");
    const fileUploadElement = this.shadowRoot.querySelector("file-upload");

    const options = dropdownElement.getAttribute("options")
      ? dropdownElement.parseOptions(dropdownElement.getAttribute("options"))
      : {};

    const selectedValue = dropdownElement.selectElement.value;
    this.enabled = selectedValue;

    fileUploadElement.setAttribute("header-text", options[selectedValue].value);
    fileUploadElement.setAttribute("max-files", options[selectedValue].limit);

    fileUploadElement.clearFileInput();
    fileUploadElement.passwords = [];

    fileUploadElement.files = [];
    fileUploadElement.fileNames = [];
    fileUploadElement.crossPlatformFiles = [];
    this.crossPlatformFiles = [];
    this.fileCount = 0;
    fileUploadElement.updateFileList();

    let urls = {
      payslip: "https://ind-thomas.hyperverge.co/v1/PHLPayslipOCR",
      coe: "https://ind-thomas.hyperverge.co/v1/PHLCoeOcr",
      itr: "https://ind-thomas.hyperverge.co/v1/PHLItrOcr",
      cor: "",
      pcor: "",
      credit: "https://ind-thomas.hyperverge.co/v1/PHLCreditCardStatementOcr",
      loan: "https://ind-thomas.hyperverge.co/v1/PHLLoanStatementOcr",
      util: "https://ind-thomas.hyperverge.co/v1/PHLUtilityBillOcr",
      dti: "https://ind-thomas.hyperverge.co/v1/PHLBusinessDocsOcr",
      insurance: "https://ind-thomas.hyperverge.co/v1/PHLInsurancePremiumOcr",
    };

    this.isValid = urls[selectedValue];

    this.submitButton.setAttribute(
      "disabled",
      this.areFilesValid() ? "no" : "yes"
    );

    //this.warningMessage.textContent

    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { selected: selectedValue },
        bubbles: true,
        composed: true,
      })
    );
  }

  handlePasswordChange(event) {
    const fileUploadElement = this.shadowRoot.querySelector("file-upload");

    this.visible = fileUploadElement.passwords.join("|~|");

    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { visible: this.visible },
        bubbles: true,
        composed: true,
      })
    );
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.updateChildComponents();
  }

  updateChildComponents() {
    // Forward attributes to child components
    for (const attr of UnoForm2.observedAttributes) {
      const childAttrName = attr.replace(/^([^-]*)-/, "");
      let comp = attr.split("-")[0];
      // Convert kebab-case to camelCase
      switch (comp) {
        case "button":
          this.submitButton.setAttribute(
            childAttrName,
            this.getAttribute(attr)
          );
          break;
        case "file":
          this.fileUploadElement.setAttribute(
            childAttrName,
            this.getAttribute(attr)
          );
          break;
        case "dropdown":
          this.dropdownElement.setAttribute(
            childAttrName,
            this.getAttribute(attr)
          );
          break;
      }
    }
    const dropdownElement = this.shadowRoot.querySelector("uno-dropdown");
    this.enabled = dropdownElement.value;
  }
}

class InvisibleComponent extends HTMLElement {
  static get observedAttributes() {
    return ["delay"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.delay = 0; // Default delay
    this.fired = false;
  }
  connectedCallback() {
    // Use the delay from the attribute if it's already set
    const delayAttr = this.getAttribute("delay");
    if (delayAttr) {
      this.delay = parseInt(delayAttr, 10) || 0;
    }
    this.fireEvent();
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "delay") {
      this.delay = parseInt(newValue, 10) || 0; // Fallback to default if newValue is invalid
    }
    this.fireEvent();
  }

  fireEvent() {
    if (this.fired === false && this.delay > 0) {
      this.fired = true;
      setTimeout(() => {
        this.dispatchEvent(
          new CustomEvent("load", {
            detail: { message: "Component has been loaded" },
            bubbles: true,
            composed: true,
          })
        );
      }, this.delay);
    }
  }
}

class LoaderOverlay extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Create elements
    this.container = document.createElement("div");
    this.container.classList.add("overlay-container");

    // Loader element
    this.loader = document.createElement("div");
    this.loader.classList.add("loader");

    // Append elements to shadow root
    this.container.appendChild(this.loader);
    this.shadowRoot.appendChild(this.container);

    // Create and append style
    const style = document.createElement("style");
    style.textContent = `
              .overlay-container.invisible{
                display:none;
              }
              .overlay-container {
                  position: fixed;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100vh;
                  background-color: rgba(0, 0, 0, 0.2); /* 20% opacity */
                  display: flex;
                  justify-content: center;
                  align-items: center;
              }
  
              .loader {
                  border: 16px solid #f3f3f3; /* Light gray border */
                  border-radius: 50%; /* Make it a circle */
                  border-top: 16px solid #791D99; /* Blue top for animation */
                  width: 80px;
                  height: 80px;
                  animation: spin 1s linear infinite;
              }
  
              @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
              }
          `;
    this.shadowRoot.appendChild(style);

    this.visible = "no";
  }

  get visible() {
    return this._visible;
  }
  set visible(input) {
    this._visible = input;
    this.updateVisibleOnChange(input);
  }

  updateVisibleOnChange(input) {
    if (input == "no") {
      this.container.classList.add("invisible");
    } else {
      this.container.classList.remove("invisible");
    }
  }
}

class UnoForm3 extends HTMLElement {
  static get observedAttributes() {
    return [
      // Dropdown attributes
      "dropdown-label",
      "dropdown-options",
      "dropdown-label-font-size",
      "dropdown-label-font-color",
      "dropdown-label-font-family",
      "dropdown-label-font-weight",
      "dropdown-option-font-size",
      "dropdown-option-font-color",
      "dropdown-option-font-family",
      "dropdown-option-font-weight",
      "dropdown-placeholder",
      "dropdown-value",
      "dropdown-limit",
      "dropdown-blacklist1",
      "dropdown-blacklist2",
      "employment-status",
      "dropdown-selected",
      // File upload attributes
      "file-allowed-file-types",
      "file-max-size",
      "file-font-size",
      "file-font-weight",
      "file-font-color",
      "file-font-family",
      "file-warning-font-size",
      "file-warning-font-weight",
      "file-warning-font-color",
      "file-button-text",
      "file-button-font-size",
      "file-button-font-weight",
      "file-button-font-color",
      "file-button-font-family",
      "file-file-size-error-text",
      "file-max-files-error-text",
      "file-delete-icon",
      "file-image-icon",
      "file-pdf-icon",
      // Secondary button attributes
      "button-font-size",
      "button-background-color",
      "button-font-color",
      "button-label",
      "button-shadow",
      "button-image-url",
      "button-trailing-image-url",
      "button-font-family",
      "button-btn-border",
      "button-disabled-bg-color",
      "button-disabled-font-color",
    ];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const formContainer = document.createElement("div");
    formContainer.classList.add("uno-form3-container");

    this.dropdownElement = document.createElement("uno-dropdown");
    this.dropdownElement.setAttribute("id", "dropdownElement");
    this.fileUploadElement = document.createElement("file-upload");
    this.fileUploadElement.setAttribute("id", "fileUploadElement");
    this.submitButton = document.createElement("uno-secondary-button");
    this.submitButton.classList.add("submitButtonTag");
    this.submitButton.setAttribute("id", "submitButton");

    this.crossPlatformFiles = [];
    this.isProcessed = [];
    this.value = "";
    this.fileCount = 0;
    this.enabled = ""; // Dropdown select value
    this.visible = "";
    this.isValid = "https://ind-thomas.hyperverge.co/v1/PHLPayslipOCR";
    this.files = [];
    this.filenames = "";
    this.filesizes = "";

    const buttonStyle = document.createElement("style");
    buttonStyle.textContent = `
        .uno-form3-container{
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .submitButtonTag {
           margin-top: auto;
        }
      `;

    formContainer.append(
      this.dropdownElement,
      this.fileUploadElement,
      this.submitButton
    );
    this.shadowRoot.append(formContainer);

    this.dropdownElement.addEventListener(
      "change",
      this.handleDropdownSelect.bind(this)
    );

    this.shadowRoot.appendChild(buttonStyle);

    this.fileUploadElement.addEventListener(
      "change",
      this.handleFileSelect.bind(this)
    );

    this.fileUploadElement.addEventListener(
      "change",
      this.handlePasswordChange.bind(this)
    );

    this.fileUploadElement.addEventListener(
      "input",
      this.handlePasswordChange.bind(this)
    );

    this.submitButton.setAttribute(
      "disabled",
      this.areFilesValid() ? "no" : "yes"
    );

    setTimeout(() => {
      this.updateChildComponents();
    }, 10);
  }

  get code_1() {
    return this._code_1;
  }
  set code_1(code) {
    this._code_1 = code;

    this.updateChildComponentsBasedOnSummary();
  }
  get code_2() {
    return this._code_2;
  }
  set code_2(code) {
    this._code_2 = code;

    this.updateChildComponentsBasedOnSummary();
  }
  get code_3() {
    return this._code_3;
  }
  set code_3(code) {
    this._code_3 = code;

    this.updateChildComponentsBasedOnSummary();
  }
  get code_4() {
    return this._code_4;
  }
  set code_4(code) {
    this._code_4 = code;

    this.updateChildComponentsBasedOnSummary();
  }
  get code_5() {
    return this._code_5;
  }
  set code_5(code) {
    this._code_5 = code;

    this.updateChildComponentsBasedOnSummary();
  }
  get code_6() {
    return this._code_6;
  }
  set code_6(code) {
    this._code_6 = code;

    this.updateChildComponentsBasedOnSummary();
  }
  get code_7() {
    return this._code_7;
  }
  set code_7(code) {
    this._code_7 = code;

    this.updateChildComponentsBasedOnSummary();
  }
  get code_8() {
    return this._code_8;
  }
  set code_8(code) {
    this._code_8 = code;

    this.updateChildComponentsBasedOnSummary();
  }
  get code_9() {
    return this._code_9;
  }
  set code_9(code) {
    this._code_9 = code;

    this.updateChildComponentsBasedOnSummary();
  }
  get code_10() {
    return this._code_10;
  }
  set code_10(code) {
    this._code_10 = code;

    this.updateChildComponentsBasedOnSummary();
  }

  get message_1() {
    return this._message_1;
  }
  set message_1(message) {
    this._message_1 = message;

    this.updateChildComponentsBasedOnSummary();
  }
  get message_2() {
    return this._message_2;
  }
  set message_2(message) {
    this._message_2 = message;

    this.updateChildComponentsBasedOnSummary();
  }
  get message_3() {
    return this._message_3;
  }
  set message_3(message) {
    this._message_3 = message;

    this.updateChildComponentsBasedOnSummary();
  }
  get message_4() {
    return this._message_4;
  }
  set message_4(message) {
    this._message_4 = message;

    this.updateChildComponentsBasedOnSummary();
  }
  get message_5() {
    return this._message_5;
  }
  set message_5(message) {
    this._message_5 = message;

    this.updateChildComponentsBasedOnSummary();
  }
  get message_6() {
    return this._message_6;
  }
  set message_6(message) {
    this._message_6 = message;

    this.updateChildComponentsBasedOnSummary();
  }
  get message_7() {
    return this._message_7;
  }
  set message_7(message) {
    this._message_7 = message;

    this.updateChildComponentsBasedOnSummary();
  }
  get message_8() {
    return this._message_8;
  }
  set message_8(message) {
    this._message_8 = message;

    this.updateChildComponentsBasedOnSummary();
  }
  get message_9() {
    return this._message_9;
  }
  set message_9(message) {
    this._message_9 = message;

    this.updateChildComponentsBasedOnSummary();
  }
  get message_10() {
    return this._message_10;
  }
  set message_10(message) {
    this._message_10 = message;

    this.updateChildComponentsBasedOnSummary();
  }

  updateChildComponentsBasedOnSummary() {
    this.codes = [
      this.code_1,
      this.code_2,
      this.code_3,
      this.code_4,
      this.code_5,
      this.code_6,
      this.code_7,
      this.code_8,
      this.code_9,
      this.code_10,
    ];
    this.messages = [
      this.message_1,
      this.message_2,
      this.message_3,
      this.message_4,
      this.message_5,
      this.message_6,
      this.message_7,
      this.message_8,
      this.message_9,
      this.message_10,
    ];

    for (let i = 1; i <= this.fileCount + 1; i++) {
      let item = "",
        warning = "";
      for (let j = 0; j < 10; j++) {
        if (typeof this.codes[j] === "string") {
          if (this.codes[j][0] == i) {
            item = this.fileUploadElement.shadowRoot.getElementById(
              `upload-item-${i - 1}`
            );
            warning = this.fileUploadElement.shadowRoot.getElementById(
              `upload-item-warning-${i - 1}`
            );
            if (item) {
              item.classList.remove("pass");
              item.classList.add("warning");
              if (this.messages[j] == "Invalid Password") {
                item
                  .querySelector(".password-input")
                  ?.classList.add("incorrect-password");
                item
                  .querySelector(".password-label")
                  ?.classList.add("incorrect-password");
              }
              if (this.messages[j]) {
                warning.innerHTML = `${this.messages[j]}`;
                warning.classList.remove("invisible");
                warning.style.marginTop = "8px";
              }
            }
            break;
          }
        } else {
          break;
        }
      }
      if (item === "") {
        item = this.fileUploadElement.shadowRoot.getElementById(
          `upload-item-${i - 1}`
        );

        warning = this.fileUploadElement.shadowRoot.getElementById(
          `upload-item-warning-${i - 1}`
        );
        if (item) {
          item.classList.remove("warning");
          item.classList.add("pass");
          item
            .querySelector(".password-input")
            ?.classList.remove("incorrect-password");
          item
            .querySelector(".password-label")
            ?.classList.remove("incorrect-password");
        }
        if (warning) {
          warning.classList.add("invisible");
          warning.style.marginTop = "0px";
        }
      }
    }

    this.submitButton.setAttribute(
      "disabled",
      this.areFilesValid() ? "no" : "yes"
    );
  }

  areFilesValid() {
    const fileElement = this.fileUploadElement;

    this.fileCount = fileElement.fileCount;

    if (fileElement.shadowRoot) {
      let inputFields = fileElement.shadowRoot.querySelectorAll(
        ".upload-item .password-input"
      );
      for (let i = 0; i < inputFields.length; i++) {
        if (inputFields[i].value == "" || inputFields[i].value == null)
          return false;
      }

      let items = fileElement.shadowRoot.querySelectorAll(".upload-item");

      for (let i = 0; i < items.length; i++) {
        if (items[i].classList.contains("warning")) return false;
      }
    }

    if (this.fileCount == 0 || this.fileCount == undefined) return false;

    return true;
  }

  handleFileSelect(event) {
    const fileElement = this.shadowRoot.querySelector("#fileUploadElement");
    const submit = this.shadowRoot.querySelector("#submitButton");

    const files = fileElement.crossPlatformFiles;
    const fileNames = fileElement.fileNames;
    const fileSizes = fileElement.fileSizes;
    this.fileCount = fileElement.fileCount;
    this.crossPlatformFiles = [];

    this.value = "";
    this.filenames = "";
    this.files = [];
    this.filesizes = "";

    for (let i = 0; i < this.fileCount; i++) {
      let name = fileNames[i].replaceAll(",", "");
      let fileBase64 = files[i];
      let commaIndex = files[i].indexOf(";");
      let type = files[i].substring(5, commaIndex);

      this.crossPlatformFiles.push({
        name: name,
        fileBase64: fileBase64,
        type: type,
      });

      this.value += this.value ? "," : "";
      this.filenames += this.filenames ? "," : "";
      this.filesizes += this.filesizes ? "," : "";
      this.value += fileBase64;
      this.files.push(fileBase64);
      this.filenames += name;
      this.filesizes += fileSizes[i];
    }
    this.isProcessed = fileElement.isProcessed;

    if (this.areFilesValid()) {
      submit.setAttribute("disabled", "no");
    } else {
      submit.setAttribute("disabled", "yes");
    }

    this.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          files: this.shadowRoot.querySelector("#fileUploadElement").files,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  connectedCallback() {
    this.updateChildComponents();
  }

  handleDropdownSelect(event) {
    const dropdownElement = this.shadowRoot.querySelector("uno-dropdown");
    const fileUploadElement = this.shadowRoot.querySelector("file-upload");

    const options = dropdownElement.getAttribute("options")
      ? dropdownElement.parseOptions(dropdownElement.getAttribute("options"))
      : {};

    const selectedValue = dropdownElement.selectElement.value;
    this.enabled = selectedValue;

    fileUploadElement.setAttribute("header-text", options[selectedValue].value);
    fileUploadElement.setAttribute("max-files", options[selectedValue].limit);

    fileUploadElement.clearFileInput();
    fileUploadElement.passwords = [];

    fileUploadElement.files = [];
    fileUploadElement.fileNames = [];
    fileUploadElement.crossPlatformFiles = [];
    this.crossPlatformFiles = [];
    this.fileCount = 0;
    fileUploadElement.updateFileList();

    let urls = {
      payslip: "https://ind-thomas.hyperverge.co/v1/PHLPayslipOCR",
      coe: "https://ind-thomas.hyperverge.co/v1/PHLCoeOcr",
      itr: "https://ind-thomas.hyperverge.co/v1/PHLItrOcr",
      cor: "",
      pcor: "",
      credit: "https://ind-thomas.hyperverge.co/v1/PHLCreditCardStatementOcr",
      loan: "https://ind-thomas.hyperverge.co/v1/PHLLoanStatementOcr",
      util: "https://ind-thomas.hyperverge.co/v1/PHLUtilityBillOcr",
      dti: "https://ind-thomas.hyperverge.co/v1/PHLBusinessDocsOcr",
      insurance: "https://ind-thomas.hyperverge.co/v1/PHLInsurancePremiumOcr",
      bank: "https://ind-engine.hyperverge.co/v1/PHLBankStatementUpload",
    };

    this.isValid = urls[selectedValue];

    this.submitButton.setAttribute(
      "disabled",
      this.areFilesValid() ? "no" : "yes"
    );

    //this.warningMessage.textContent

    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { selected: selectedValue },
        bubbles: true,
        composed: true,
      })
    );
  }

  handlePasswordChange(event) {
    const fileUploadElement = this.shadowRoot.querySelector("file-upload");

    this.visible = fileUploadElement.passwords.join("|~|");

    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { visible: this.visible },
        bubbles: true,
        composed: true,
      })
    );
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.updateChildComponents();
  }

  updateChildComponents() {
    // Forward attributes to child components
    for (const attr of UnoForm3.observedAttributes) {
      const childAttrName = attr.replace(/^([^-]*)-/, "");
      let comp = attr.split("-")[0];
      // Convert kebab-case to camelCase
      switch (comp) {
        case "button":
          this.submitButton.setAttribute(
            childAttrName,
            this.getAttribute(attr)
          );
          break;
        case "employment":
          let status = this.getAttribute(attr);

          let dropdownOptions = "";
          if (status == "Self-Employed / Business Owner") {
            dropdownOptions =
              "itr,Income Tax Return / BIR Form 1701,3,bank,Bank Statements,3,credit,Credit Card Statement,1,loan,Bank Loan Statement,1";
            this.isValid = "https://ind-thomas.hyperverge.co/v1/PHLItrOcr";
          } else if (
            status == "Employed - Private" ||
            status == "Employed - Government"
          ) {
            dropdownOptions =
              "payslip,Pay Slip/s (1 month),3,coe,Certificate of Employment,1,bank,Bank Statements,3,credit,Credit Card Statement,1,loan,Bank Loan Statement,1";
          } else {
            dropdownOptions =
              "itr,Income Tax Return / BIR Form 1701,3,bank,Bank Statements,3,credit,Credit Card Statement,1,loan,Bank Loan Statement,1";
          }
          this.dropdownElement.setAttribute("options", dropdownOptions);
          this.fileUploadElement.setAttribute(
            "header-text",
            this.dropdownElement.text
          );
          this.fileUploadElement.setAttribute(
            "max-files",
            this.dropdownElement.limit
          );
          break;
        case "file":
          this.fileUploadElement.setAttribute(
            childAttrName,
            this.getAttribute(attr)
          );
          break;
        case "dropdown":
          this.dropdownElement.setAttribute(
            childAttrName,
            this.getAttribute(attr)
          );
          if (attr == "dropdown-selected") {
            this.fileUploadElement.setAttribute(
              "header-text",
              this.dropdownElement.text
            );
            this.fileUploadElement.setAttribute(
              "max-files",
              this.dropdownElement.limit
            );
          }
          break;
      }
    }

    const dropdownElement = this.shadowRoot.querySelector("uno-dropdown");
    this.enabled = dropdownElement.value;
  }
}

class InfoBoxComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const wrapper = document.createElement("div");
    wrapper.className = "info-box";

    const iconWrapper = document.createElement("div");
    iconWrapper.className = "icon-container";

    iconWrapper.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" 
               width="16" height="16" 
               viewBox="0 0 24 24" 
               fill="none" stroke="#CBD5E1" 
               stroke-width="2" stroke-linecap="round" 
               stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="8" />
          </svg>
        `;

    const textWrapper = document.createElement("div");
    textWrapper.className = "text-wrapper";

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = "Want a faster process?";

    const subtitle = document.createElement("div");
    subtitle.className = "subtitle";
    subtitle.textContent = "Upload your salary slip for express evaluation";

    textWrapper.appendChild(title);
    textWrapper.appendChild(subtitle);

    wrapper.appendChild(iconWrapper);
    wrapper.appendChild(textWrapper);
    this.shadowRoot.append(wrapper);

    const style = document.createElement("style");
    style.textContent = `
          .info-box {
            display: flex;
            align-items: flex-start;
            padding: 20px;
            border: 1px solid #333741;
            background-color: #161B26;
            border-radius: 12px;
            gap: 16px;
            font-family: 'Poppins', sans-serif;
          }

          .icon-container {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            min-width: 40px;
            min-height: 40px;
            background-color: #1E293B;
            border: 1px solid #334155;
            border-radius: 8px;
            flex-shrink: 0;
          }

          .text-wrapper {
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 4px; /* Paragraph spacing */
          }

          .title {
            font-size: 14px;
            font-weight: 600;
            line-height: 20px;
            color: #CECFD2;
            letter-spacing: 0%;
	    margin-bottom: 4px;
          }

          .subtitle {
            font-size: 14px;
            font-weight: 400;
            line-height: 20px;
            color: #94969C;
            letter-spacing: 0%;
          }
        `;
    this.shadowRoot.appendChild(style);
  }
}

customElements.define("info-box-component", InfoBoxComponent);

// Register the custom component

customElements.define("uno-load-component", InvisibleComponent);

customElements.define("uno-form1", UnoForm1);

customElements.define("uno-form2", UnoForm2);

customElements.define("uno-form3", UnoForm3);

customElements.define("loader-overlay", LoaderOverlay);

customElements.define("uno-dropdown", CustomDropdown);

customElements.define("file-upload", FileUpload);

customElements.define("uno-main-label", CustomLabel);

customElements.define("uno-secondary-button", SecondaryButton);

customElements.define("uno-subtitle-text", SubtitleText);
