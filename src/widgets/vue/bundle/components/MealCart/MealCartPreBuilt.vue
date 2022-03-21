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
import { CLEAN_CART_ITEMS } from '../../store/_mutations-type'

export default {
  data() {
    return {
      selected: false,
    }
  },
  computed: {
    ...mapState([
      'prebuilt'
    ]),
    ...mapGetters([
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
    ...mapActions([
      'setPrebuiltBoxToCart'
    ]),
    setBundleSelected(val) {
      console.log('val',val)
      if(val) {
        this.selected = true

        const products = this.getProductPrebuilt({
          bundlename: val.label,
          size: val.size
        })
        this.setPrebuiltBoxToCart(products)
      }
      else {
        this.selected = false

        this.$store.commit(CLEAN_CART_ITEMS)
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
  padding: 1rem 0.5rem;
  margin-top: .5rem;

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
      border-radius: 10px;
      padding: .3rem .3rem .5rem;
      height: 43px;

      .vs__selected {
        text-overflow: ellipsis;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        display: -webkit-box;
        overflow: hidden;
      }
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
}

</style>