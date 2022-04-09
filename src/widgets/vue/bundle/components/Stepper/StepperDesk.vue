<template>
  <div class="sp">
    <div class="sp__logo">
      <a href="/" class="sp__logo--link">
        <img
          src="https://cdn.shopify.com/s/files/1/0088/3163/1415/files/paleo__logo.png?v=1644951785"
          alt="Logo Paleo On the Go"
        />
      </a>
    </div>
    <div class="sp__content">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="sp__item"
        :class="{ active: step.active, clickeable: step.param }"
        @click="backRouter(step)"
      >
        <div class="sp__item--number">
          {{ index + 1 }}
        </div>
        <div class="sp__item--title">
          {{ step.name }}
        </div>
        <div class="sp__item--line"></div>
      </div>
    </div>
    <div class="sp__empty"></div>
  </div>
</template>

<script>
import { changeRouter } from '../../utils'

export default {
  computed: {
    isCustomer() {
      return customer.email && customer.shopify_id ? true : false
    },
    steps() {
      const param = this.$route.params.box
      const steps = [
        {
          name: 'Meals',
          active: true,
          param: 'subscription'
        },
        {
          name: 'Add-Ons',
          active: param === 'addons'
        },
        {
          name: 'Review',
          active: false
        },
        {
          name: 'Checkout',
          active: false
        }
      ]

      if (param === 'onetime') {
        steps.splice(1, 1)
        steps[0].param = 'onetime'
      }

      if ((this.isCustomer && param === 'addons') || param === 'subscription') {
        steps.splice(3, 1)
        steps[2].name = 'Udpate Box'
      }

      if (this.isCustomer && param === 'addons') {
        steps[2].active = true
      }

      return steps
    }
  },
  methods: {
    backRouter(step) {
      if (step.active && step.param) {
        changeRouter(step.param)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.sp {
  padding: 2rem 0;

  &__logo {
    flex-grow: 20%;

    &--link {
      display: block;
      width: 60%;
    }
  }

  &__content {
    width: 60%;
    @include flex($justify: center);
  }

  &__item {
    @include flex();
    margin-right: 1rem;

    &--number {
      border: 1px solid $color-black;
      width: 35px;
      height: 35px;
      border-radius: 100%;
      font-weight: 500;
      font-size: 1rem;
      margin-right: 1rem;
      @include flex($justify: center);
    }

    &--title {
      font-family: $font-heading;
      font-size: 1.3rem;
      text-transform: uppercase;
    }

    &--line {
      border: 0.5px solid $color-black;
      width: 2rem;
      margin-left: 1rem;
    }

    &:last-child {
      .sp__item--line {
        display: none;
      }
    }
  }
  &__item.active {
    .sp__item--number {
      background-color: $color-black;
      color: $color-primary;
    }
  }
  &__item.clickeable {
    cursor: pointer;
  }

  &__empty {
    width: 20%;
  }
}
</style>
