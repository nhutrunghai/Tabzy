function Tabzy(tabs, options) {
  this.tabs = document.querySelector(tabs);
  this.options = Object.assign(
    {
      remember: false,
    },
    options
  );
  if (!tabs) {
    console.error(`${tabs} is not define `);
    return;
  }
  this.listTab = Array.from(this.tabs.querySelectorAll("li a"));
  if (this.listTab.length === 0) {
    console.error(`List tab rỗng !`);
    return;
  }
  this.tabContent = this.listTab
    .map((value) => {
      return document.querySelector(value.getAttribute("href"));
    })
    .filter(Boolean);
  if (this.tabContent.length !== this.listTab.length) {
    console.error("Length tab error");
    return;
  }
  this.Element = this.tabs.cloneNode(true);
  this._init();
}
Tabzy.prototype._active = function (item) {
  this.listTab.forEach((value) => {
    value.closest("li").classList.remove("tab-active");
  });
  this.tabContent.forEach((value) => {
    value.hidden = true;
  });
  item.closest("li").classList.add("tab-active");
  document.querySelector(item.getAttribute("href")).hidden = false;
};

Tabzy.prototype._handleClick = function (event, tab) {
  event.preventDefault();
  if (this.options.remember) {
    history.pushState(null, null, tab);
  }
  this._active(tab);
};
Tabzy.prototype._init = function () {
  this.moment = this.listTab[0];
  if (this.options.remember) {
    this.moment = this.listTab.find(
      (value) => value.getAttribute("href") === location.hash
    );

    if (!this.moment) {
      this.moment = this.listTab[0];
    }
  }
  this._active(this.moment);
  this.listTab.forEach((value) => {
    value.addEventListener("click", (event) => {
      this._handleClick(event, value);
    });
  });
};
Tabzy.prototype.toggle = function (item) {
  this.itemToggle = item;
  if (!this.listTab.includes(item)) {
    this.itemToggle = this.listTab.find(
      (value) => item === value.getAttribute("href")
    );
    if (!this.itemToggle) {
      console.error(`${item} is not define`);
      return;
    }
  }
  this._active(this.itemToggle);
};
Tabzy.prototype.destroy = function () {
  this.tabs.replaceWith(this.Element);
  this.tabContent.forEach((value) => {
    value.hidden = false;
  });
};
