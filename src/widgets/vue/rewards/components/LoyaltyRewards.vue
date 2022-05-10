<template>
  <section>
    <c-title-highlight
      black-text="rewards"
    />
   <div data-lion-rewards-list></div>
  </section>
</template>

<script>
import cTitleHighlight from './cTitleHighlight.vue'

export default {
  components: {
    cTitleHighlight
  }
}
</script>

<style lang="scss">

$height-icon: 70px;

.lion-reward-item {

  &__content {
    position: relative;
    background-color: $color-ecru;
    text-align: left;
    min-height: 90px;
    justify-content: center;

    &::before {
      content: '';
      display: block;
      width: $height-icon;
      height: $height-icon;
      position: absolute;
      left: 10px;
      top: 10px;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;

      @include media-tablet-up {
        width: calc($height-icon - 20px);
        height: calc($height-icon - 20px);
        left: 20px;
        top: 20px;
      }
    }
  }

  &__title {
    padding-left: calc($height-icon + 10px);
    padding-top: 0;
    font-family: $font-heading;
    font-size: 1.5rem;
    text-transform: uppercase;
    color: $color-black;

    @include media-tablet-up {
      font-size: 1.1rem;
    }
  }

  &__meta {
    padding-left: calc($height-icon + 10px);
    flex-grow: initial;

    @include media-tablet-up {
      margin-top: 0;
    }

    span {
      font-family: $font-body;
      color: $color-black;
      font-weight: 600;
    }
  }

  &__redeem-button {
    margin-top: 25px;
    background-color: $color-primary;

    &--disabled {
      background-color: $color-white;
      color: $color-black;
      font-family: $font-body;
      font-weight: 500;
    }
  }
  &__fill {
    background-color: $color-primary;
  }

  &--customer {
    .lion-reward-item {
      &__content {
        justify-content: flex-start;

        &::before {
          @include media-tablet-up {
            top: 10px;
          }
        }
      }

      &__title {
        padding-top: 5px;
      }
    }
  }
}
</style>