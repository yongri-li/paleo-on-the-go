<template>
  <div class="addons">
    <div class="addons__title">
      Add Ons
      <div class="info__edit" @click="backToEditAddons">
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8.49985" cy="8.49985" r="5.88462" fill="#231F20" />
          <path
            d="M8.5 0C3.80588 0 0 3.80588 0 8.5C0 13.1941 3.80588 17 8.5 17C13.1941 17 17 13.1941 17 8.5C17 3.80588 13.1941 0 8.5 0ZM4.95833 12.0417L5.67092 9.18283L7.871 11.3822L4.95833 12.0417ZM8.61333 10.7107L6.34525 8.44262L10.4826 4.25L12.75 6.51667L8.61333 10.7107Z"
            fill="#FCD32B"
          />
        </svg>
        Edit
      </div>
    </div>
    <product-item-add-ons v-for="addon in addons" :key="addon.id" :product="addon" class="addons__content" />
  </div>
</template>

<script>
import ProductItemAddOns from '../Products/ProductItemAddOns.vue'

export default {
  props: {
    addons: {
      type: Array,
      required: true
    }
  },
  components: {
    ProductItemAddOns
  },
  methods: {
    backToEditAddons() {
      location = '/pages/bundle#/addons'
    }
  }
}
</script>

<style lang="scss" scoped>
.addons {
  &__title {
    display: flex;
    text-transform: uppercase;
    font-weight: 700;
    font-size: 0.88rem;
    letter-spacing: 0.06em;
    margin-bottom: 0.5rem;

    .info__edit {
      margin-left: 0.75rem;
    }
  }
  &__content {
    background-color: #efede6;
    padding: 0.5rem;
  }
}
</style>
