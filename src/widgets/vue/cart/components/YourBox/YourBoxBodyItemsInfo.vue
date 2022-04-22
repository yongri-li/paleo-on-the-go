<template>
  <div class="info">
    <div class="info-mobile u-hideTabletUp">
      <div class="info-mobile__section">
        <div class="info__item-number">
          {{ sizeSelected.title }} box
        </div>
        <div class="info__price">
          <div
            class="info__price--sub"
            :class="{'u-hide': isOneTime}"
          >
            {{ formatPrice(getBoxPrices.sub) }}
          </div>
          <div class="info__price--final">
            {{ formatPrice(getBoxPrices.final) }}
          </div>
        </div>
      </div>
      <div class="info-mobile__section">
        <div class="info__edit" @click="backToEditBundle">
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8.49985" cy="8.49985" r="5.88462" fill="#231F20"/>
            <path d="M8.5 0C3.80588 0 0 3.80588 0 8.5C0 13.1941 3.80588 17 8.5 17C13.1941 17 17 13.1941 17 8.5C17 3.80588 13.1941 0 8.5 0ZM4.95833 12.0417L5.67092 9.18283L7.871 11.3822L4.95833 12.0417ZM8.61333 10.7107L6.34525 8.44262L10.4826 4.25L12.75 6.51667L8.61333 10.7107Z" fill="#FCD32B"/>
          </svg>
          Edit
        </div>
        <div class="info__remove" @click="removeBundle">
          Remove
        </div>
      </div>
      <div class="info-mobile__section">
        <div
          class="info__frequency"
          :class="{'u-hidden': isOneTime}"
        >
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
              {{ option.label }}
              <span class="vs__dropdown-option--radio"></span>
            </template>
          </v-select>
        </div>
        <div class="info__qt">
          QTY: 1
        </div>
      </div>
    </div>
    <div class="info-desk u-hideMobileDown">
      <div class="info-desk__colum product">
        <div class="info__item-number">
          {{ sizeSelected.title }} box
        </div>
        <div class="info__edit" @click="backToEditBundle">
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8.49985" cy="8.49985" r="5.88462" fill="#231F20"/>
            <path d="M8.5 0C3.80588 0 0 3.80588 0 8.5C0 13.1941 3.80588 17 8.5 17C13.1941 17 17 13.1941 17 8.5C17 3.80588 13.1941 0 8.5 0ZM4.95833 12.0417L5.67092 9.18283L7.871 11.3822L4.95833 12.0417ZM8.61333 10.7107L6.34525 8.44262L10.4826 4.25L12.75 6.51667L8.61333 10.7107Z" fill="#FCD32B"/>
          </svg>
          Edit
        </div>
        <div
          class="info__frequency"
          :class="{'u-hidden': isOneTime}"
        >
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
              {{ option.label }}
              <span class="vs__dropdown-option--radio"></span>
            </template>
          </v-select>
        </div>
      </div>
      <div class="info__qt">
        1
      </div>
      <div class="info__price">
        <div
          class="info__price--sub"
          :class="{'u-hide': isOneTime}"
        >
          {{ formatPrice(getBoxPrices.sub) }}
        </div>
        <div class="info__price--final">
          {{ formatPrice(getBoxPrices.final) }}
        </div>
      </div>
      <div class="info__remove" @click="removeBundle">
        Remove
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { formatPrice } from '@shared/utils'
import { CHANGE_FREQUENCY_SELECTED } from '../../store/modules/frequency/_mutations-type'
import { CLEAR_BOX } from '@shared/cartdrawer/store/_mutations-type'

export default {
  data() {
    return {
      options: [
        {
          label: '2 Week',
          week: 2
        },
        {
          label: '4 Week',
          week: 4
        },
        {
          label: '6 Week',
          week: 6
        },
        {
          label: '8 Week',
          week: 8
        },
      ],
      frequency: {
        label: '2 Week',
        week: 2
      }
    }
  },
  computed: {
    ...mapState('cartdrawer', [
      'sizeSelected'
    ]),
    ...mapState('frequency', [
      'frequencies',
      'frequencySelected'
    ]),
    ...mapGetters('cartdrawer', [
      'getBoxPrices'
    ]),
    isOneTime() {
      return (this.getBoxPrices.sub === this.getBoxPrices.final)
    }
  },
  methods: {
    formatPrice,
    backToEditBundle() {
      window.location = '/pages/bundle'
    },
    removeBundle() {
      this.$store.commit(`cartdrawer/${CLEAR_BOX}`)
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

  padding: .5rem;

  @include media-tablet-up {
    padding: .5rem 0;
  }

  .info-mobile {

    &__section {
      @include flex($justify: space-between);
      padding-bottom: .2rem;
    }

    &__section:last-child {
      padding-top: 1rem;
    }
  }

  &__item-number {
    font-family: $font-heading;
    font-size: 1.7rem;
    text-transform: uppercase;

    @include media-tablet-up {
      font-size: 2rem
    }
  }

  &__price {
    @include flex();
    font-size: 1.2rem;

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
    cursor: pointer;

    svg {
      margin-right: .4rem;
    }

    @include media-tablet-up {
      font-size: .8rem;
    }
  }

  &__remove {
    color: $color-info;
    font-size: 1rem;
    text-decoration: underline;
    cursor: pointer;

    @include media-tablet-up {
      width: 12%;
      text-align: right;
    }
  }

  &__frequency {
    text-transform: capitalize;
    font-size: 1rem;
    width: 70%;

    @include media-tablet-up {
      width: 50%;
    }

    .vs__search {
      margin-top: 0;
      font-weight: 500;
      font-family: $font-body;
    }

    .vs__dropdown-toggle {
      border-radius: 10px;
      padding: .3rem .3rem .5rem;
      background-color: $color-white;
    }

    .vs__dropdown-menu {
      border-bottom-right-radius: 10px;
      border-bottom-left-radius: 10px;
      padding: 0;
      top: 80%;
      box-shadow: none;
    }

    .vs__dropdown-option{
      padding: .3rem calc(.5rem + 7px);
      border-top: 1px solid #D3D2D2;
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