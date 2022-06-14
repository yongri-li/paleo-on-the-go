<template>
  <section>
    <c-title-highlight ecru-text="earn" black-text="points" />
    <div data-lion-rules-list></div>
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
.lion-rule-item {
  width: 100%;

  @include media-tablet-up {
    /*width: 25%;*/
  }

  &__content {
    background-color: $color-ecru;
    position: relative;
    padding: 15px 5px;
  }

  &__title {
    font-family: $font-heading;
    text-transform: uppercase;
    margin: 1rem 0;
    font-size: 1.5rem;
    padding: 15px 0 5px 0;
  }

  &__points {
    font-family: $font-body;
    text-transform: capitalize;

    .text,
    .value {
      color: $color-black;
      margin: 0;
      font-weight: 600;
      font-size: 1.3rem;
    }
  }

  .lion-rule-item__icon {
    margin-top: 1rem;
    width: 60px;
    height: 60px;
  }

  &--authenticated {
    .lion-action-button {
      position: absolute;
      bottom: 15px;
      left: 5%;
      width: 90%;
      height: 60px;
      background-color: transparent;
      font-size: 0;
      // border: 1px solid red;
    }
    .lion-rule-item {
      &__points {
        background-color: $color-primary;
        height: 60px;
        width: 95%;
        padding: 0;
        @include flex($justify: center);
      }
    }
  }
}

.lion-rule-item__completed-forever {
  position: absolute;
  bottom: 15px;
  left: 3%;
  width: 94%;
  height: 60px;
  background-color: $color-white;
  border: 1px solid $color-black;
  font-size: 1rem;
  @include flex($justify: center);

  &::before {
    content: '✓';
    color: $color-white;
    background-color: $color-black;
    width: 25px;
    height: 25px;
    border-radius: 100%;
    margin-right: 0.5rem;
    @include flex($justify: center);
  }

  &::after {
    content: 'Completed';
    font-family: $font-body !important;
    font-weight: 600;
    line-height: initial;
    color: $color-black;
  }
}
</style>
