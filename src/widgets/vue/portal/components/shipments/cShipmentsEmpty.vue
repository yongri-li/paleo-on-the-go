<template>
  <article :class="_buildModifiers('c-shipmentsEmpty', modifiers)">
    <section class="c-shipmentsEmpty__wrap">
      <div class="c-shipmentsEmpty__wrap--left">
        <img :src="content.no_subs_image" alt="No Subscriptions, Reactivate" />
      </div>
      <div class="c-shipmentsEmpty__wrap--right">
        <h2 class="c-h2">{{ content.no_subs_heading }}</h2>
        <p>{{ isRecharge ? content.no_subs_text : content.no_subs_orders_text }}</p>
        <c-button
          class="c-button c-button--isDefault c-button--isPrimary"
          @click="handleCta"
          :text="isRecharge ? content.no_subs_cta_text : 'Shop Now'"
          :modifiers="['isDefault', 'isPrimary']"
        />
      </div>
    </section>
  </article>
</template>

<script>
import cButton from '@shared/components/core/cButton.vue'

export default {
  props: {
    content: {
      type: Object,
      required: true
    },
    isRecharge: {
      type: Boolean,
      default: true
    },
    modifiers: {
      type: Array,
      default: () => []
    }
  },
  components: { cButton },
  methods: {
    handleCta() {
      this.isRecharge ? $router.push({ path: '/details' }) : (location.href = '/pages/bundle/#/subscription')
    }
  }
}
</script>

<style lang="scss">
.c-shipmentsEmpty {
  width: 92vw;
  max-width: 1600px;
  padding: 1rem;
  margin: 0 auto;

  &__wrap {
    display: flex;
    grid-gap: 5rem;
    min-height: 50vh;
    align-items: center;
    justify-content: space-evenly;
  }

  @include media-desktop-up {
    &__wrap {
      padding: 5rem 4rem;

      &--left {
        flex: 1.75;
      }
      &--right {
        flex: 2;
        padding-right: 3vw;
      }
    }
  }

  @include media-mobile-down {
    width: 100vw;
  }
}
</style>
