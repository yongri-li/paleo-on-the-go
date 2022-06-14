<template>
  <div class="modal__box-size">
    <div class="modal__close" @click="closeModal">x</div>
    <div class="modal__title">
      {{ content.title }}
    </div>
    <div class="modal__description">
      {{ content.description }}
    </div>
    <div class="modal__options">
      <div class="modal__options--item modal__options--continue" @click="saveChanged">Continue</div>
      <div class="modal__options--item modal__options--cancel" @click="closeModal">Cancel</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    params: {
      type: Object
    },
    content: {
      type: Object
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    saveChanged() {
      this.$store.dispatch('mealcart/changeSizeSelected', this.params.newVal)
      if (this.params.newVal === 'onetime') this.$store.commit('mealcart/CLEAR_BUNDLES')
    }
  }
}
</script>
