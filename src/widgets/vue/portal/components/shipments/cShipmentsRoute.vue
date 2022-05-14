<template>
  <article class="blockRoute">
    <section class="blockRoute__price">
      <div class="blockRoute__price--titles">
        <img
          src="https://protect-lightning-bolt-widget.route.com/assets/logo-lighting-light.svg"
          alt="Lighting Logo"
        />
        <header>
          <p class="rs-title">1-Click Protect</p>
          <p>Instantly resolve shipping issues</p>
        </header>
      </div>
      <div class="blockRoute__price--links">
        <span>{{ price }}</span>
        <button @click="toggleRoute">{{ routeAction }}</button>
      </div>
    </section>
    <section class="blockRoute__logos">
      <a
        href="https://help.route.com/hc/en-us/articles/360020122394?flash_digest=6a5c413dca99f6bfb8742ae5e46465b404c55d25"
        target="_blank"
        class="rs-learnMore"
        >Learn More
      </a>
      <a class="rs-trademark" href="https://route.com/" target="_blank">
        Powered by <b>Route</b>
        <img
          src="https://protect-lightning-bolt-widget.route.com/assets/logo-route-black.svg"
          alt="Route Logo"
        />
      </a>
    </section>
    <section class="blockRoute__terms">
      <span>
        *By deselecting shipping protection, Paleo On The Go is not liable for lost, damaged, or stolen items
      </span>
    </section>
  </article>
</template>

<script>
import { formatPrice } from '@shared/utils'

export default {
  name: 'cShipmentRoute',
  data() {
    return {
      routeAdded: false
    }
  },
  props: {
    routePrice: {
      type: [String, Number],
      required: true
    },
    hasRoute: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    price() {
      return this.routeAdded ? 'Added' : formatPrice(this.routePrice)
    },
    routeAction() {
      return this.routeAdded ? 'Remove' : 'Add+'
    }
  },
  methods: {
    toggleRoute() {
      console.log(this.routeAdded)
      if (this.routeAdded) {
        this.$emit('toggleRoute', 'remove')
        this.routeAdded = false
      } else {
        this.$emit('toggleRoute', 'add')
        this.routeAdded = true
      }
    },
    checkActive() {
      this.hasRoute ? (this.routeAdded = true) : (this.routeAdded = false)
    }
  },
  mounted() {
    this.checkActive()
  }
}
</script>

<style lang="scss">
.blockRoute {
  position: relative;
  width: clamp(280px, 25vw, 400px);
  border: 1px solid $color-ecru;
  font-family: Titillium Web, sans-serif;
  padding: 0.25rem 1.25rem;
  margin: 2rem 0;

  p,
  a,
  span {
    font-size: 0.85rem;
  }

  section {
    display: flex;
    margin: 1.5rem 0;
  }

  &__price {
    justify-content: space-between;

    div {
      display: flex;
    }

    &--titles {
      align-items: center;
    }

    img {
      width: 50px;
      margin-left: -0.5rem;
    }

    header {
      p {
        margin: 0;
      }
    }

    .rs-title {
      font-size: 1.125rem;
    }

    &--links {
      flex-direction: column;
      align-items: flex-end;

      span {
        color: $color-grey;
      }

      button {
        appearance: unset;
        border: none;
        background: none;
        color: #31c8e0;
        font-family: Titillium Web, sans-serif;
        font-size: 1rem;
        font-weight: 900;
        padding: 0.5rem 0 0;
        text-transform: uppercase;
      }
    }
  }

  &__logos {
    align-items: center;
    justify-content: space-between;

    .rs-trademark {
      background: $color-ltgrey;
      display: flex;
      align-items: center;
      gap: 4px;
      border-radius: 2rem;
      cursor: pointer;
      line-height: 1;
      padding: 0.25rem 1rem;
    }

    .rs-learnMore {
      color: $color-grey;
      font-weight: 700;
      text-decoration: underline;
    }
  }

  &__terms {
    font-size: 0.675rem;
  }
}
</style>
