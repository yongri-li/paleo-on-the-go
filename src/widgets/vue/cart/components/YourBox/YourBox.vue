<template>
  <div class="your-box">
    <div class="your-box__title">
      {{ settings.title_box }}
    </div>
    <div class="your-box__content">
      <div class="your-box__content-header">
        <div class="your-box__content-column product">Product</div>
        <div class="your-box__content-column qty u-hideMobileDown">QTY</div>
        <div class="your-box__content-column price u-hideMobileDown">Price</div>
      </div>
      <your-box-body class="your-box__content-body" />
    </div>
  </div>
</template>

<script>
import YourBoxBody from "./YourBoxBody.vue";
import { mapState } from "vuex";

export default {
  components: {
    YourBoxBody,
  },
  computed: {
    ...mapState("ui", ["settings"]),
  },
};
</script>

<style lang="scss" scoped>
.your-box {
  margin-bottom: 2rem;

  &__title {
    font-family: $font-heading;
    font-size: 2.63rem;
    text-transform: uppercase;
    margin-bottom: 1rem;

    @include media-tablet-up {
      font-size: 2.5rem;
    }
  }

  &__content {
    @include media-tablet-up {
      &-column.product {
        width: 55%;
      }

      &-column.qty {
        width: 10%;
        text-align: center;
      }

      &-column.price {
        width: 22%;
        text-align: right;
      }
    }
  }

  &__content-header {
    text-transform: uppercase;
    font-weight: 700;
    font-size: 0.88rem;
    letter-spacing: 0.06em;
    line-height: 1.4;

    @include media-tablet-up {
      padding: 0 0.4rem;
      @include flex();

      &-column.product {
        width: 60%;
      }

      &-column.qty {
        width: 10%;
      }

      &-column.price {
        width: 15%;
        text-align: right;
      }
    }
  }

  &__content-body {
    border: 1px solid #efede6;
    padding: 0.4rem;
    margin-top: 1rem;

    @include media-tablet-up {
      margin-top: 0;
    }
  }
}
</style>
