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
        ref="dropdownObj"
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
  props: {
    sizeSelect: {
      type: [String, Number, Object]
    }
  },
  data() {
    return {
      selected: false,
      outOfStock: false,
      outOfStockItems: []
    }
  },
  computed: {
    ...mapState('mealcart', ['prebuilt']),
    ...mapGetters('mealcart', ['getSizeSelected', 'getPrebuiltByBox', 'getProductPrebuilt']),
    clearBundle() {
      return this.prebuilt.cleared
    },
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
    ...mapActions('mealcart', ['validateSetPrebuilt', 'checkBundleProducts']),
    // OLDhideBundlesIfContainOneOOSitem(){
    //   const sizeSelected = this.getSizeSelected
    //   const sizeNumber = sizeSelected.val === 'onetime' ? 0 : sizeSelected.number_size
    //   const options = this.getPrebuiltByBox(sizeNumber)
    //   const bundleProducts = await Promise.all(
    //     options.map(async option => {
    //       const bundle = option.products.filter(bun => bun.size * 1 === sizeNumber)
    //       return this.checkBundleProducts(bundle[0].list)
    //     })
    //   )

    //   const removeOOSitems = bundleProducts.map(bundleArr => {
    //     const bundleArray = bundleArr.filter(p => {
    //       const inventoryData = p.inventory[0]
    //       const tags = p.tags
    //       const inventoryTag = tags.filter(tag => tag.includes('inventory_'))
    //       if (!inventoryTag.length) return p

    //       const inventoryAmount = inventoryTag[0].replace('inventory_', '')
    //       console.log(+inventoryAmount, +inventoryData, +inventoryAmount - +inventoryTag < 0)
    //       if (+inventoryData - +inventoryAmount < 0) {
    //         return null
    //       }
    //       return p
    //     })

    //     console.log({ bundleArray })

    //     return bundleArray.includes(true) ? true : false
    //   })

    //   const activeBundles = options.map((option, i) => {
    //     if (!hasOutOfStock[i]) {
    //       return {
    //         label: option.bundlename,
    //         size: sizeNumber
    //       }
    //     }
    //   })
    //   this.options = activeBundles.filter(Boolean)
    //   return
    // }
    async setOptions() {
      const sizeSelected = this.getSizeSelected
      const sizeNumber = sizeSelected.val === 'onetime' ? 0 : sizeSelected.number_size
      const options = this.getPrebuiltByBox(sizeNumber)
      const bundleProducts = await Promise.all(
        options.map(async option => {
          const bundle = option.products.filter(bun => bun.size * 1 === sizeNumber)
          return this.checkBundleProducts(bundle[0].list)
        })
      )
      bundleProducts.map(bundleArr => {
        const bundleArray = bundleArr.filter(p => {
          const inventoryData = p.inventory[0]
          const tags = p.tags
          const inventoryTag = tags.filter(tag => tag.includes('inventory_'))
          if (!inventoryTag.length) return p
          const inventoryAmount = inventoryTag[0].replace('inventory_', '')
          ;+inventoryData - +inventoryAmount < 0 ? this.outOfStockItems.push(p.id) : null
        })
      })
      return
    },
    setBundleSelected(val) {
      if (val) {
        this.selected = true

        const bundleProducts = this.getProductPrebuilt({
          bundlename: val.label,
          size: val.size
        })

        const objs = bundleProducts.map(bp => {
          return {
            id: +bp.split('x')[0],
            qt: +bp.split('x')[1]
          }
        })

        const filteredProducts = objs
          .filter(id => !this.outOfStockItems.includes(id.id))
          .map(p => `${p.id}x${p.qt}`)

        this.validateSetPrebuilt(filteredProducts)
      } else {
        this.selected = false
        this.$store.commit(`babcart/${CLEAN_ALL_CART}`)
      }
    }
  },
  mounted() {
    this.setOptions()
  },
  watch: {
    sizeSelect() {
      this.setOptions()
    },
    clearBundle() {
      this.$refs.dropdownObj.value = undefined
      this.$refs.dropdownObj.clearSelection()
      this.selected = false
      this.setOptions()
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
  margin: 0.5rem 0 1rem;

  &__info {
    width: 100%;
    margin-bottom: 0.5rem;

    @include media-desktop-up {
      width: 40%;
    }

    &--title {
      font-family: $font-heading;
      text-transform: uppercase;
      // font-size: 1.2rem;
      font-size: 1rem;
    }
    &--subtitle {
      font-size: 0.88rem;
    }
  }

  &__select {
    font-weight: 500;
    text-transform: capitalize;
    font-size: 1rem;
    width: 100%;
    @include media-desktop-up {
      width: 55%;
    }

    .vs__search {
      margin-top: 0;
      font-weight: 600;
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
        font-weight: 600;
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
}
</style>
