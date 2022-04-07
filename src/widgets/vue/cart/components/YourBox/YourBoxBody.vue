<template>
  <div class="yb-body">
    <your-box-body-items
      :items="items"
    />
    <your-box-body-add-ons
      v-if="getAddonsItems.length"
      :addons="getAddonsItems"
    />
  </div>
</template>

<script>
import YourBoxBodyItems from './YourBoxBodyItems.vue'
import YourBoxBodyAddOns from './YourBoxBodyAddOns.vue'

import { mapGetters } from 'vuex'

export default {
  components: {
    YourBoxBodyItems,
    YourBoxBodyAddOns
  },
  computed: {
    ...mapGetters('cartdrawer', [
      'getSubscriptionItems',
      'getOnetimeItems',
      'getAddonsItems'
    ]),
    items() {
      return [
        ...this.getSubscriptionItems,
        ...this.getOnetimeItems
      ]
    }
  }
}
</script>