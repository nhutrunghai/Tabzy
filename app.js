function Tabzy(tabs, options) {
  this.tabs = document.querySelector(tabs);
  this.cleanRegax = /[^a-zA-Z0-9]/g;
  this.options = Object.assign(
    {
      activeClassName: "",
      remember: false,
      onChange: null,
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
  if (this.options.remember) {
    this.param = new URLSearchParams(location.search);

    this.keyParam = tabs.split("#")[1];
  }
  this._init();
}
Tabzy.prototype._active = function (item) {
  this.listTab.forEach((value) => {
    value.closest("li").classList.remove(this.options.activeClassName);
  });
  this.tabContent.forEach((value) => {
    value.hidden = true;
  });
  item.closest("li").classList.add(this.options.activeClassName);
  document.querySelector(item.getAttribute("href")).hidden = false;
};

Tabzy.prototype._handleClick = function (event, tab) {
  event.preventDefault();
  if (this.changeElement !== tab) {
    this.changeElement = tab;
    this.options.onChange({
      tab: this.changeElement,
      panel: document.querySelector(this.changeElement.getAttribute("href")),
    });
  }

  if (this.options.remember) {
    this.param = new URLSearchParams(location.search);
    this.param.set(
      this.keyParam,
      tab.getAttribute("href").replace(this.cleanRegax, "")
    );
    console.log(this.param.get(this.keyParam));
    history.replaceState(null, null, `?${this.param.toString()}`);
  }
  this._active(tab);
};
Tabzy.prototype._init = function () {
  this.moment = this.listTab[0];
  if (this.options.remember) {
    this.moment = this.listTab.find(
      (value) =>
        value.getAttribute("href").replace(this.cleanRegax, "") ===
        this.param.get(this.keyParam)
    );

    if (!this.moment) {
      this.moment = this.listTab[0];
    }
  }
  this.changeElement = this.moment;

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
  if (this.changeElement !== this.itemToggle) {
    this.changeElement = this.itemToggle;
    this.options.onChange({
      tab: this.changeElement,
      panel: document.querySelector(this.changeElement.getAttribute("href")),
    });
    this._active(this.itemToggle);
  }
};
Tabzy.prototype.destroy = function () {
  this.tabs.replaceWith(this.Element);
  this.tabContent.forEach((value) => {
    value.hidden = false;
  });
  this.tabs = null;
  this.listTab = null;
  this.changeElement = null;
};
const tabs = new Tabzy("#tabs", {
  activeClassName: "tab-active",
  remember: true,
  onChange(data) {
    console.log(data);
  },
});

const tabsBar = new Tabzy("#tabsBar", {
  activeClassName: "tab-active",
  remember: true,
  onChange(data) {
    console.log(data);
  },
});
