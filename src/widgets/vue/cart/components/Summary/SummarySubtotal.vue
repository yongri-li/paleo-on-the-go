<template>
  <div class="subtotal">
    <div class="subtotal__content">
      <div class="subtotal__title">
        Subtotal
      </div>
      <div class="subtotal__price">
        $89.95
      </div>
      <div class="subtotal__checkout">
        Checkout
      </div>
      <div class="subtotal__msg">
        Shipping & Taxes Calculated At Checkout
      </div>
      <div class="subtotal__agree">
        <input
          type="checkbox"
          name="agreecheck"
          id="agreecheck"
          class="subtotal__agree--check"
        />
        <label for="agreecheck" class="subtotal__agree--label">
          I agree with the
        </label>
        <a href="#" target="_blank"
          class="subtotal__agree--redirect"
        >
          Shipping Terms and Conditions
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.subtotal {
  background-color: #efede6;

  &__content {
    padding: 1rem 1.2rem;
  }

  &__title {
    text-align: center;
    font-size: 1.7rem;
    font-weight: 500;
  }

  &__price {
    font-family: $font-heading;
    text-align: center;
    font-size: 3.5rem;
    margin: .8rem 0;
  }

  &__checkout {
    background-color: $color-primary;
    text-align: center;
    padding: 1rem 0;
    font-size: 1.3rem;
    font-weight: 500;
    opacity: .5;
    margin-bottom: 1.5rem;
  }

  &__msg {
    font-size: 1.1rem;
  }

  &__agree {
    font-size: .8rem;
    margin: .5rem 0;
    @include flex();

    &--check {
      margin-right: 3px;
    }

    &--redirect {
      font-weight: 700;
      text-decoration: underline;
      margin-left: 3px;
    }
  }
}

</style>