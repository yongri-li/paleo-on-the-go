<template>
  <div
    class="route-modal"
    :class="{'rm-open': open}"
  >
    <div class="route-modal-box">
      <img
        class="background"
        src="https://cdn.routeapp.io/route-widget-shopify/stable/images/LightboxBackground.svg"
      />
      <img
        class="route-line"
        src="https://cdn.routeapp.io/route-widget-shopify/stable/images/RouteLine.png"
      />
      <img
        class="route-rm-close-modal"
        src="https://cdn.routeapp.io/route-widget-shopify/stable/images/CloseIcon.svg"
        @click="closeModal"
      />
      <div class="route-modal-header">
        <img
          class="route-rm-route-logo"
          src="https://cdn.routeapp.io/route-widget-shopify/stable/images/RouteLogoWhite.svg"
        />
        <img
          class="route-rm-route-logo-color"
          src="https://cdn.routeapp.io/route-widget-shopify/stable/images/RouteLogoKiona.png"
        />
        <div class="route-rm-secure-with">
          Secure your shipment and easily <br />
          resolve order issues with one tap.
        </div>
      </div>
      <div class="route-modal-content">
        <div class="icon-box1">
          <span class="route-rm-icon-box1">
            <img
              class="route-rm-icon-box-image"
              src="https://cdn.routeapp.io/route-widget-shopify/stable/images/Purchase_RoutePlus.svg"
              alt="Secured your shipment"
            />
          </span>
          <div class="route-rm-text1">
            Protect orders from loss,<br />
            damage, or theft.
          </div>
        </div>
        <div class="icon-box2">
          <span class="route-rm-icon-box2">
            <img
              class="route-rm-icon-box-image"
              src="https://cdn.routeapp.io/route-widget-shopify/stable/images/Instant_Protection.svg"
              alt="Instantly insured"
            />
          </span>
          <div class="route-rm-text2"><br /><br /></div>
        </div>
        <div class="icon-box3">
          <span class="route-rm-icon-box3">
            <img
              class="route-rm-icon-box-image"
              src="https://cdn.routeapp.io/route-widget-shopify/stable/images/LBBox_3.svg"
              alt="One click claims"
            />
          </span>
          <div class="route-rm-text3">
            Refunds or reorders<br />
            in just a few clicks.
          </div>
        </div>
      </div>
      <div class="route-modal-footer">
        <div class="rm-footer-1">
          <div class="route-rm-terms">
            This optional protection is offered to you solely in order to
            effectuate the shipment of your package(s). Route is the named
            assured on the Route Policy of which your shipment will be protected
            on. The cost of adding your shipment to the Route Policy includes
            compensation paid to Safe Order Solutions, LLC (a licensed insurance
            agency affiliate of Route), for making this protection available.
          </div>
        </div>
        <div class="rm-footer-2">
          <div class="route-rm-copyright">Route App © 2022 Route App</div>
          <div class="route-rm-user-privacy">
            <a
              class="route-rm-user-privacy-text"
              href="https://route.com/privacy-page/"
              target="_blank"
              rel="noopener noreferrer"
            >
              User Privacy
            </a>
          </div>
          <div class="route-rm-terms-of-use">
            <a
              class="route-rm-terms-of-use-text"
              href="https://route.com/terms-and-conditions/"
              target="_blank"
              rel="noopener noreferrer"
            >
              User Terms of Use
            </a>
          </div>
          <div class="route-rm-lloyds-container"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    open: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    closeModal() {
      this.$emit('close-modal')
    }
  }
}
</script>