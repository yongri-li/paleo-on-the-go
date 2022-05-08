<template>
  <div class="prebuilt" v-if="options.length">
    <div class="prebuilt__info">
      <div class="prebuilt__info--title">
        {{ prebuilt.content.title }}
      </div>
      <div class="prebuilt__info--subtitle">
        {{ prebuilt.content.subtitle }}
      </div>
    </div>
    <div class="prebuilt__select">
      <v-select
        placeholder="Select a Bundle"
        label="label"
        :options="options"
        :searchable="false"
        @input="setBundleSelected"
        :class="{ selected: selected }"
      >
        <template v-slot:option="option">
          {{ option.label }}
          <span class="vs__dropdown-option--radio"></span>
        </template>
      </v-select>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import { CLEAN_ALL_CART } from '@shared/store/modules/babcart/_mutations-type'

export default {
  data() {
    return {
      selected: false,
    }
  },
  computed: {
    ...mapState('mealcart', [
      'prebuilt'
    ]),
    ...mapGetters('mealcart', [
      'getSizeSelected',
      'getPrebuiltByBox',
      'getProductPrebuilt'
    ]),
    options() {
      const sizeSelected = this.getSizeSelected
      const sizeNumber = sizeSelected.val === 'onetime' ? 0 : sizeSelected.number_size
      const options = this.getPrebuiltByBox(sizeNumber)
      return options.map(option => {
        return {
          label: option.bundlename,
          size: sizeNumber
        }
      })
    }
  },
  methods: {
    ...mapActions('mealcart', [
      'validateSetPrebuilt'
    ]),
    setBundleSelected(val) {
      console.log('val',val)
      if(val) {
        this.selected = true

        const products = this.getProductPrebuilt({
          bundlename: val.label,
          size: val.size
        })
        console.log('products',products)
        this.validateSetPrebuilt(products)
      }
      else {
        this.selected = false

        this.$store.commit(`babcart/${CLEAN_ALL_CART}`)
      }
    }
  }
}
</script>

<style lang="scss">

.prebuilt {
  @include flex($justify: space-between);
  border-top: 1px solid $color-ecru;
  border-bottom: 1px solid $color-ecru;
  padding: 0 0.5rem;
  margin-top: .5rem;
  height: 77px;

  &__info {
    width: 40%;

    &--title {
      font-family: $font-heading;
      text-transform: uppercase;
      font-size: 1.2rem;
    }
    &--subtitle {
      font-size: .8rem;
    }
  }

  &__select {
    width: 55%;
    font-weight: 500;
    text-transform: capitalize;
    font-size: 1rem;

    .vs__search {
      margin-top: 0;
      font-weight: 500;
      font-family: $font-body;
    }

    .vs__dropdown-toggle {
      border-radius: 20px;
      padding: 0.8rem 0.3rem;
      height: auto;

      .vs__selected {
        text-overflow: ellipsis;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        display: -webkit-box;
        overflow: hidden;
      }
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

    .vs__dropdown-option{
      padding: .6rem .7rem .6rem calc(.5rem + 7px);
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
}

</style>