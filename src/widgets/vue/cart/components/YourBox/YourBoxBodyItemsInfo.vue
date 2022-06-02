<template>
  <div class="info">
    <div class="info-mobile u-hideTabletUp">
      <div class="info-mobile__section">
        <div class="info__item-number">{{ sizeSelected.title }} box</div>
        <div class="info__price">
          <div class="info__price--sub" :class="{ 'u-hide': isOneTime }">
            {{ formatPrice(getBoxPrices.sub) }}
          </div>
          <div class="info__price--final">
            {{ formatPriceDollars(getBoxPrices.final) }}
          </div>
        </div>
      </div>
      <div class="info-mobile__section">
        <div class="info__edit" @click="backToEditBundle">
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8.49985" cy="8.49985" r="5.88462" fill="#231F20" />
            <path
              d="M8.5 0C3.80588 0 0 3.80588 0 8.5C0 13.1941 3.80588 17 8.5 17C13.1941 17 17 13.1941 17 8.5C17 3.80588 13.1941 0 8.5 0ZM4.95833 12.0417L5.67092 9.18283L7.871 11.3822L4.95833 12.0417ZM8.61333 10.7107L6.34525 8.44262L10.4826 4.25L12.75 6.51667L8.61333 10.7107Z"
              fill="#FCD32B"
            />
          </svg>
          Edit
        </div>
        <div class="info__remove" @click="removeBundle">Remove</div>
      </div>
      <div class="info-mobile__section">
        <div class="info__frequency" :class="{ 'u-hidden': isOneTime }">
          <v-select
            placeholder="Ships Every..."
            label="label"
            :options="frequencies"
            :searchable="false"
            :clearable="false"
            :value="frequencySelected"
            @input="setFrequency"
          >
            <template v-slot:option="option">
              {{ option.labelOption }}
              <span class="vs__dropdown-option--radio"></span>
            </template>
          </v-select>
        </div>
        <div class="info__qt">QTY: 1</div>
      </div>
    </div>
    <div class="info-desk u-hideMobileDown">
      <div class="info-desk__colum product">
        <div class="info__item-number">{{ sizeSelected.title }} box</div>
        <div class="info__edit" @click="backToEditBundle">
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8.49985" cy="8.49985" r="5.88462" fill="#231F20" />
            <path
              d="M8.5 0C3.80588 0 0 3.80588 0 8.5C0 13.1941 3.80588 17 8.5 17C13.1941 17 17 13.1941 17 8.5C17 3.80588 13.1941 0 8.5 0ZM4.95833 12.0417L5.67092 9.18283L7.871 11.3822L4.95833 12.0417ZM8.61333 10.7107L6.34525 8.44262L10.4826 4.25L12.75 6.51667L8.61333 10.7107Z"
              fill="#FCD32B"
            />
          </svg>
          Edit
        </div>
        <div class="info__frequency" :class="{ 'u-hidden': isOneTime }">
          <v-select
            placeholder="Ships Every 1 Week"
            label="label"
            :options="frequencies"
            :searchable="false"
            :clearable="false"
            :value="frequencySelected"
            @input="setFrequency"
          >
            <template v-slot:option="option">
              {{ option.labelOption }}
              <span class="vs__dropdown-option--radio"></span>
            </template>
          </v-select>
        </div>
      </div>
      <div class="info__qt">1</div>
      <div class="info__price">
        <div class="info__price--sub" :class="{ 'u-hide': isOneTime }">
          {{ formatPrice(getBoxPrices.sub) }}
        </div>
        <div class="info__price--final">
          {{ formatPriceDollars(getBoxPrices.final) }}
        </div>
      </div>
      <div class="info__remove" @click="removeBundle">Remove</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { formatPrice, formatPriceDollars } from '@shared/utils'
import { CHANGE_FREQUENCY_SELECTED } from '../../store/modules/frequency/_mutations-type'

export default {
  computed: {
    ...mapState('cartdrawer', ['sizeSelected']),
    ...mapState('frequency', ['frequencies', 'frequencySelected']),
    ...mapGetters('cartdrawer', ['getBoxPrices']),
    isOneTime() {
      return this.sizeSelected.order_type === 'onetime'
    }
  },
  methods: {
    formatPrice,
    formatPriceDollars,
    backToEditBundle() {
      window.location = '/pages/bundle'
    },
    removeBundle() {
      this.$store.dispatch(`cartdrawer/clearBox`)
      console.log('clean cart')
    },
    setFrequency(val) {
      this.$store.commit(`frequency/${CHANGE_FREQUENCY_SELECTED}`, val)
    }
  }
}
</script>

<style lang="scss">
.info {
  padding: 0.5rem;

  @include media-tablet-up {
    padding: 0.5rem 0;
  }

  .info-mobile {
    &__section {
      @include flex($justify: space-between);
      padding-bottom: 0.2rem;
    }

    &__section:last-child {
      padding-top: 1rem;
    }
  }

  &__item-number {
    font-family: $font-heading;
    font-size: 1.5rem;
    text-transform: uppercase;
    padding-right: 12px;
  }

  &__price {
    @include flex();
    font-size: 1rem;

    @include media-tablet-up {
      width: 23%;
      justify-content: flex-end;
    }

    &--sub {
      color: $color-info;
      text-decoration: line-through;
      margin-right: 0.5rem;
    }
  }

  &__edit {
    font-size: 1rem;
    display: flex;
    align-items: center;
    font-weight: 500;
    text-decoration: underline;
    text-transform: capitalize;
    letter-spacing: 0.5px;
    cursor: pointer;

    svg {
      margin-right: 0.4rem;
    }

    @include media-tablet-up {
      font-size: 0.8rem;
      padding-right: 12px;
    }
  }

  &__remove {
    color: $color-info;
    font-size: 0.88rem;
    text-decoration: underline;
    cursor: pointer;

    @include media-tablet-up {
      width: 12%;
      text-align: right;
    }
  }

  &__frequency {
    text-transform: capitalize;
    font-size: 0.88rem;
    width: 70%;

    @include media-tablet-up {
      width: auto;
      flex-grow: 1;
    }

    .vs__search {
      margin-top: 0;
      font-weight: 500;
      font-family: $font-body;
    }

    .vs__dropdown-toggle {
      border-radius: 20px;
      padding: 0.5rem 0.3rem;
      background-color: $color-white;
    }
    .vs--open .vs__dropdown-toggle {
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
    }

    .vs__dropdown-menu {
      border-bottom-right-radius: 20px;
      border-bottom-left-radius: 20px;
      padding: 0;
      top: 90%;
      box-shadow: none;
    }

    .vs__dropdown-option {
      padding: 0.6rem 0.7rem 0.6rem calc(0.5rem + 7px);
      border-top: 1px solid #d3d2d2;
      @include flex($justify: space-between);

      &--radio {
        display: inline-block;
        vertical-align: bottom;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        border: 1px solid $color-black;
      }

      &--highlight {
        background-color: $color-black;
        color: $color-primary;

        .vs__dropdown-option--radio {
          border-color: $color-white;
          background: radial-gradient($color-primary 0%, $color-primary 35%, transparent 45%, transparent);
        }
      }
    }

    .v-select.selected {
      .vs__search {
        display: none;
      }
    }
  }

  &__qt {
    font-size: 1rem;

    @include media-tablet-up {
      width: 10%;
      text-align: center;
    }
  }

  .info-desk {
    @include flex();

    &__colum.product {
      width: 55%;
      @include flex($justify: space-between);
    }
  }
}
</style>
