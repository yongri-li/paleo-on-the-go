<template>
  <div class="modal__box-size">
    <div class="modal__close" @click="closeModal">
      x
    </div>
    <div class="modal__title">
      ARE YOU SURE?
    </div>
    <div class="modal__description">
      Your Box Will Be Cleared
    </div>
    <div class="modal__options">
      <div
        class="modal__options--item modal__options--continue"
        @click="saveChanged"
      >
        Continue
      </div>
      <div
        class="modal__options--item modal__options--cancel"
        @click="closeModal"
      >
        Cancel
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    params: {
      type: Object
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    saveChanged() {
      this.$store.dispatch('mealcart/changeSizeSelected', this.params.newVal)
    }
  }
}
</script>