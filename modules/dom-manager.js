export default class DomManager {
  visibilityState = {
    visible: "visible",
    hidden: "hidden",
    clamped: "clamped",
  };

  isMobile = false;

  constructor() {
    this.init();
  }

  init = () => {
    this.isMobileViewport();
    this.listenViewportResize();
  };

  elType = (el) => {
    if (typeof el === "undefined" || el === null) {
      throw "DomManage elType: parameter must be a string";
    }
    return Object.prototype.toString.call(el);
  };

  isMultipleElements = (el) => {
    const elType = this.elType(el);

    return elType === "[object HTMLCollection]" ||
      elType === "[object NodeList]"
      ? true
      : false;
  };

  isSingleElement = (el) => {
    const elType = this.elType(el);
    return elType.includes("Element");
  };

  el = (query) => {
    const el = document.querySelectorAll(query);

    if (el) {
      if (el.length === 0) {
        return false;
      }
      if (el.length === 1) {
        return el[0];
      }
      return el;
    }
  };

  appendChild = ({ child = null, parent = null }) => {
    if (child && parent) {
      parent.appendChild(child);
    }
  };

  insertAfter = ({ target = null, newParent = null }) => {
    if (newParent) {
      newParent.parentNode?.insertBefore(target, newParent.nextSibling);
    }
  };

  scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  show = (el) => {
    if (!el) {
      return;
    }

    if (this.isSingleElement(el)) {
      el.setAttribute(
        this.domAttributes.dataVisibility,
        this.visibilityState.visible
      );
    }

    if (this.isMultipleElements(el)) {
      Object.keys(el).forEach((idx) => {
        el[parseInt(idx, 10)].setAttribute(
          this.domAttributes.dataVisibility,
          this.visibilityState.visible
        );
      });
    }
  };

  hide = (el) => {
    if (!el) {
      return;
    }

    if (this.isSingleElement(el)) {
      el.setAttribute(
        this.domAttributes.dataVisibility,
        this.visibilityState.hidden
      );
    }

    if (this.isMultipleElements(el)) {
      Object.keys(el).forEach((idx) => {
        el[parseInt(idx, 10)].setAttribute(
          this.domAttributes.dataVisibility,
          this.visibilityState.hidden
        );
      });
    }
  };

  exists = (el) => {
    return this.isMultipleElements(el) || this.isSingleElement(el);
  };

  toggleVisibility = (el) => {
    if (!el) {
      return;
    }

    if (this.isSingleElement(el)) {
      if (this.shouldVisible(el)) {
        this.hide(el);
        return "hidden";
      }
      if (this.shouldHidden(el)) {
        this.show(el);
        return "visible";
      }
    }

    if (this.isMultipleElements(el)) {
      Object.keys(el).forEach((idx) => {
        if (this.shouldVisible(el[parseInt(idx, 10)])) {
          this.hide(el[parseInt(idx, 10)]);
          return "hidden";
        }
        if (this.shouldHidden(el[parseInt(idx, 10)])) {
          this.show(el[parseInt(idx, 10)]);
          return "visible";
        }
      });
    }
  };

  clamp = (el) => {
    if (!el) {
      return;
    }

    el.setAttribute(
      this.domAttributes.dataVisibility,
      this.visibilityState.clamped
    );
  };

  shouldVisible = (el) => {
    const { visibility } = this.getElementAttribute(el);
    return visibility === this.visibilityState.visible ? true : false;
  };

  shouldHidden = (el) => {
    const { visibility } = this.getElementAttribute(el);
    console.log(el, visibility);
    return visibility === this.visibilityState.hidden ? true : false;
  };

  shouldClamped = (el) => {
    const { visibility } = this.getElementAttribute(el);
    return visibility === this.visibilityState.clamped ? true : false;
  };

  styleElements = () => {
    const elementsShouldStyled = this.el("*[data-style]");

    if (elementsShouldStyled === false) {
      return;
    }

    elementsShouldStyled.forEach((el) => {
      const jsonElementStyleData = el.getAttribute("data-style");

      if (
        typeof jsonElementStyleData === "undefined" ||
        jsonElementStyleData === null
      ) {
        return;
      }

      if (jsonElementStyleData.length === 0) {
        return;
      }

      const elementStyleData = JSON.parse(jsonElementStyleData);

      if (typeof elementStyleData["breakpoints"] === "undefined") {
        throw "DomManager - elementStyles: no breakpoints (min, max) are defined";
      }

      const { min, max } = elementStyleData["breakpoints"];

      Object.keys(elementStyleData).forEach((styleProperty) => {
        if (styleProperty === "breakpoints") {
          return;
        }

        if (
          window.innerWidth >= parseInt(min, 10) &&
          window.innerWidth <= parseInt(max, 10)
        ) {
          el.style[styleProperty] = elementStyleData[styleProperty];
        }
      });
    });
  };

  isMobileViewport = () => {
    this.isMobile = window.innerWidth < 478 ? true : false;
  };

  listenViewportResize = () => {
    window.addEventListener("resize", this.isMobileViewport);
  };
}
