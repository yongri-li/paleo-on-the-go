<template>
  <div class="modal__box-size">
    <div class="modal__title">
      CHANGE BOX SIZE
    </div>
    <meal-cart-box-sizes
      :size-selected="getSizeSelected"
      @change="changeSizeSelected"
      radio-name="popup"
    />
    <div class="modal__options">
      <div
        class="modal__options--item modal__options--cancel"
        @click="closeModal"
      >
        Cancel
      </div>
      <div
        class="modal__options--item modal__options--continue"
        @click="saveChanged"
      >
        Save
      </div>
    </div>
  </div>
</template>

<script>
import MealCartBoxSizes from '../MealCart/MealCartBoxSizes.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'ModalBoxSize',
  components: {
    MealCartBoxSizes
  },
  data() {
    return {
      valSelected: '',
    }
  },
  mounted() {
    this.valSelected = this.getSizeSelected.val
  },
  computed: {
    ...mapGetters([
      'getSizeSelected'
    ])
  },
  methods: {
    changeSizeSelected(newVal) {
      this.valSelected = newVal
    },
    closeModal() {
      this.$emit('close')
    },
    saveChanged() {
      this.$store.dispatch('changeSizeSelected', this.valSelected)
      this.closeModal()
    }
  }
}
</script>

<style lang="scss" scoped>

@include media-tablet-up {

  .modal__options {
    @include flex($justify: space-between);

    &--item {
      width: 48%;
    }
  }

}


</style>