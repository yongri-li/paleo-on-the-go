<template>
  <div class="yb-body">
    <your-box-body-items
      :items="cart.items"
      :size-selected="getSizeSelected"
    />
    <your-box-body-add-ons
      v-if="cart.addons.length"
      :addons="cart.addons"
    />
  </div>
</template>

<script>
import YourBoxBodyItems from './YourBoxBodyItems.vue'
import YourBoxBodyAddOns from './YourBoxBodyAddOns.vue'

import { mapState, mapGetters } from 'vuex'

export default {
  components: {
    YourBoxBodyItems,
    YourBoxBodyAddOns
  },
  computed: {
    ...mapState([
      'cart'
    ]),
    ...mapGetters([
      'getSizeSelected'
    ])
  }
}
</script>