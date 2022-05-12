<template>
  <div class="stepper">
    <stepper-mobile class="stepper__mobile" />
    <stepper-desk class="stepper__desk" />
  </div>
</template>

<script>
import StepperMobile from "./StepperMobile.vue";
import StepperDesk from "./StepperDesk.vue";

export default {
  components: {
    StepperMobile,
    StepperDesk,
  },
};
</script>

<style lang="scss" scoped>
.stepper {
  &__desk {
    display: none;
  }

  @include media-tablet-up {
    &__desk {
      @include flex();
    }

    &__mobile {
      display: none;
    }
  }

  @include media-tablet-only {
    &__desk {
      flex-direction: column;
    }
  }
}
</style>
