window.Scoutside = window.Scoutside || {}

window.Scoutside.checkout = {
  sectionsItems: [
    {
      title: "Item Box",
      prop: "_subscription",
      classes: "item-box"
    },
    {
      title: "One Time Box",
      prop: "_onetime",
      classes: "one-time-box"
    },
    {
      title: "Add Ons",
      prop: "_addons",
      classes: "addons"
    },
    {
      title: "Your Cart",
      prop: "_general",
      classes: "general"
    }
  ],
  init: function () {
    const self = this;
    document.addEventListener("DOMContentLoaded", function () {
      const cart = self.getCartJSON();
      console.log('cart', cart)
      self.setProducts(cart.line_items)
    });
  },
  getCartJSON: function () {
    if (window.cart_json) {
      return window.cart_json;
    } else {
      return JSON.parse(
        Checkout.$("#cart_json")
          .text()
          .split("CART JSON: ")[1]
          .split(" DEFAULT")[0]
          .trim()
      );
    }
  },
  setProducts: function (items) {
    let sections = []
    items.forEach(item => {
      const properties = Object.keys(item.properties)

      const routeShippingProp = properties.find(key => key === '_routeshipping')
      let propFound = routeShippingProp
                      ? `_${item.properties[routeShippingProp]}`
                      : properties.find(key => item.properties[key] === true)

      const section = this.sectionsItems.find(sec => sec.prop === propFound)

      if(sections.indexOf(section) === -1) {
        sections.push(section)
        this.createUL(section)
      }

      this.createItemLI(section, item)

    })
  },
  createUL: function (section) {
    const divProductList = document.querySelector('.order-summary__section--product-list')
    divProductList.innerHTML += `
      <ul class="order-summary__section--${section.classes}">
        <li class="order-summary__section--title">
          ${section.title}
        </li>
      </ul>
    `
  },
  createItemLI: function (section, item) {
    const ulProductList = document.querySelector(`.order-summary__section--${section.classes}`)
    const subtitle = item.properties._subtitle ? item.properties._subtitle : ''
    ulProductList.innerHTML += `
      <li class="product product-${item.variant_id}">
        <div class="product__figure">
          <img src="${item.image}" alt="${item.title}" />
          <span class="product__quantity">
            ${item.quantity}
          </span>
        </div>
        <div class="product__data">
          <span class="product__data--name">
            ${item.title}
          </span>
          <span class="product__data--subtitle">
            ${subtitle}
          </span>
        </div>
        <div class="product__price">
          $${item.price}
        </div>
      </li>
    `
  }
};
window.Scoutside.checkout.init();