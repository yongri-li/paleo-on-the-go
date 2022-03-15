<template>
  <div class="box-sizes">
    <label v-for="size in sizes"
      :key="size.title"
      :style="{ order: size.order }"
      class="box-sizes__option"
    >
      <input
        type="radio"
        name="box-sizes"
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
      <div class="box-sizes__subscribe-title--txt">
        subscribe and save
      </div>
      <div class="box-sizes__subscribe-title--line"></div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { CHANGE_SIZE_SELECTED } from '../../store/_mutations-type'

export default {
  computed: {
    ...mapState({
      stateSizes: 'sizes'
    }),
    ...mapGetters([
      'getSizeSelected'
    ]),
    sizes() {
      return this.stateSizes.map( (size, index) => {
        const isSubscription = size.order_type === 'subscription'

        const info = {
          mobile: isSubscription
                  ? `Subscribe & Save ${size.discount}%`
                  : `${size.number_size} Items Minimum`,
          desk: isSubscription
                ? `${size.discount}% Saving`
                : `${size.number_size} Items Minimum`,
        }

        const order = isSubscription ? index+1 : index

        return {
          title: size.title,
          val: size.val,
          info,
          order
        }
      })
    },
    picked: {
      get: function() {
        const sizeSelected = this.getSizeSelected
        return sizeSelected.val
      },
      set: function(newVal) {
        this.$store.commit(CHANGE_SIZE_SELECTED, { val: newVal })
      }
    }
  },
}
</script>

<style lang="scss" scoped>

.box-sizes {

  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;

  &__option {
    width: 48%;
    margin-bottom: 0.5rem;
    position: relative;
    cursor: pointer;

    &--content {
      width: 100%;
      background-color: #EFEDE6;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0.7rem 0;

      @media screen and (min-width: 789px) {
        flex-direction: row;
        align-items: flex-end;
        padding: 1rem;

        &::before {
          content: "";
          display: inline-block;
          vertical-align: bottom;
          width: 4%;
          height: 30%;
          margin-right: 0.3rem;
          border-radius: 50%;
          border: 0.1rem solid #231F20;
          position: absolute;
          right: 4%;
          top: 35%;
        }
      }
    }

    &--title {
      font-family: 'Knockout';
      text-transform: uppercase;
      font-size: 1.5rem;

      @media screen and (min-width: 789px) {
        line-height: 1.3rem;
        margin-right: 1rem;
      }
    }

    &--info {
      font-size: .8rem;

      &-desk {
        display: none;
      }

      @media screen and (min-width: 789px) {
        font-size: 1rem;

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
        background-color: #231F20;
        color: #FEFEFE;

        .box-sizes__option--title {
          color: #FCD32B;
        }

        &::before {
          border-color: #FCD32B;
          background: radial-gradient(#FCD32B 0%, #FCD32B 35%, transparent 45%, transparent);
        }
      }

    }

    @media screen and (min-width: 789px) {
      width: 100%;
      margin-bottom: 1rem;
    }

  }

  &__subscribe-title {
    display: none;

    @media screen and (min-width: 769px) {
      order: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      margin: 0.5rem 0 1rem;

      &--line {
        border: 1px solid #231F20;
        width: 25%;
      }

      &--txt {
        text-transform: uppercase;
        font-size: .9rem;
        font-weight: 500;
      }
    }
  }

}

</style>