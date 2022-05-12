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
        <div v-if="step.complete" class="sp__item--number">
          <svg
            width="18"
            height="12"
            viewBox="0 0 18 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.8889 1L6.2963 11.1111L1 6.05578"
              stroke="#FCD32B"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div v-else class="sp__item--number">
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
export default {
  computed: {
    isCustomer() {
      return customer.email && customer.shopify_id ? true : false;
    },
    fromPortal() {
      return !!sessionStorage.getItem("fromPortal");
    },
    steps() {
      const param = this.$route.params.box;
      const steps = [
        {
          name: "Meals",
          active: true,
          param: "subscription",
          complete: param === "addons",
        },
        {
          name: "Add-Ons",
          active: param === "addons",
        },
        {
          name: "Review",
          active: false,
        },
        {
          name: "Checkout",
          active: false,
        },
      ];

      if (param === "onetime") {
        steps.splice(1, 1);
        steps[0].param = "onetime";
      }

      if (this.isCustomer && this.fromPortal && param !== "onetime") {
        steps.splice(3, 1);
        steps[2].name = "Udpate Box";
      }

      if (this.isCustomer && this.fromPortal && param === "addons") {
        steps[2].active = true;
      }

      return steps;
    },
  },
  methods: {
    backRouter(step) {
      if (step.active && step.complete && step.param) {
        this.$router.push(`/${step.param}`);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.sp {
  padding: 2rem 0;

  &__logo {
    width: 15%;

    @include media-tablet-only {
      @include flex($justify: center);
      margin-bottom: 1rem;
    }

    &--link {
      display: block;
      // width: 60%;
      width: 145px;
    }
  }

  &__content {
    width: 70%;
    @include flex($justify: center);

    @include media-tablet-only {
      width: 100%;
    }
  }

  &__item {
    @include flex();
    margin-right: 1rem;

    &--number {
      border: 1px solid $color-black;
      width: 30px;
      height: 30px;
      border-radius: 100%;
      font-weight: 500;
      font-size: 1rem;
      margin-right: 1rem;
      @include flex($justify: center);

      svg {
        width: 50%;
      }
    }

    &--title {
      font-family: $font-heading;
      font-size: 1.13rem;
      text-transform: uppercase;
      @include media-tablet-only {
        font-size: 1rem;
      }
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
