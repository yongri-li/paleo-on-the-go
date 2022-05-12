<template>
  <div class="box-sizes">
    <label
      v-for="size in sizes"
      :key="size.title"
      :style="{ order: size.order }"
      class="box-sizes__option"
    >
      <input
        type="radio"
        :name="`box-sizes-${radioName}`"
        :value="size.val"
        v-model="picked"
        class="box-sizes__option--input"
      />
      <div class="box-sizes__option--content">
        <span class="box-sizes__option--title">
          {{ size.title }}
        </span>
        <div class="box-sizes__option--info">
          <span class="box-sizes__option--info-mobile">
            {{ size.info.mobile }}
          </span>
          <span class="box-sizes__option--info-desk">
            {{ size.info.desk }}
          </span>
        </div>
      </div>
    </label>
    <div class="box-sizes__subscribe-title">
      <div class="box-sizes__subscribe-title--line"></div>
      <div class="box-sizes__subscribe-title--txt">subscribe and save</div>
      <div class="box-sizes__subscribe-title--line"></div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    sizeSelected: {
      type: Object,
      required: true,
    },
    radioName: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState({
      stateSizes: (state) => state.mealcart.sizes,
    }),
    sizes() {
      return this.stateSizes.map((size, index) => {
        const isSubscription = size.order_type === "subscription";

        const info = {
          mobile: isSubscription
            ? `Subscribe & Save ${size.discount}%`
            : `${size.number_size} Items Minimum`,
          desk: isSubscription
            ? `${size.discount}% Saving`
            : `${size.number_size} Items Minimum`,
        };

        const order = isSubscription ? index + 1 : index;

        return {
          title: size.title,
          val: size.val,
          info,
          order,
        };
      });
    },
    picked: {
      get: function () {
        return this.sizeSelected.val;
      },
      set: function (newVal) {
        this.$emit("change", newVal);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.box-sizes {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  height: 145px;

  @include media-tablet-up {
    height: auto;
  }

  &__option {
    width: 48%;
    margin-bottom: 0.5rem;
    position: relative;
    cursor: pointer;

    &--content {
      width: 100%;
      background-color: #efede6;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0.7rem 0;

      @include media-tablet-up {
        flex-direction: row;
        align-items: flex-end;
        padding: 1rem;

        &::before {
          content: "";
          display: inline-block;
          vertical-align: bottom;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 0.1rem solid #231f20;
          position: absolute;
          right: 1rem;
          top: 35%;
        }
      }
    }

    &--title {
      font-family: "Knockout";
      text-transform: uppercase;
      font-size: 1.38rem;
      line-height: 1;

      @include media-tablet-up {
        line-height: 1.3rem;
        margin-right: 1rem;
      }
    }

    &--info {
      font-size: 0.75rem;

      &-desk {
        display: none;
      }

      @include media-tablet-up {
        font-size: 1rem;
        line-height: 1.3rem;

        &-mobile {
          display: none;
        }
        &-desk {
          display: block;
        }
      }
    }

    &--input {
      display: none;

      &:checked + * {
        background-color: #231f20;
        color: #fefefe;

        .box-sizes__option--title {
          color: #fcd32b;
        }

        &::before {
          border-color: #fcd32b;
          background: radial-gradient(
            #fcd32b 0%,
            #fcd32b 35%,
            transparent 45%,
            transparent
          );
        }
      }
    }

    @include media-tablet-up {
      width: 100%;
      margin-bottom: 1rem;
    }
  }

  &__subscribe-title {
    display: none;

    @include media-tablet-up {
      order: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      margin: 0.5rem 0 1rem;

      &--line {
        border: 1px solid #231f20;
        width: 25%;
      }

      &--txt {
        text-transform: uppercase;
        font-size: 0.9rem;
        font-weight: 500;
      }
    }
  }
}
</style>
