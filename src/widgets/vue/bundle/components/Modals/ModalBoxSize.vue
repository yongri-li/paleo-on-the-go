<template>
  <div class="modal__box-size">
    <div class="modal__close" @click="closeModal">x</div>
    <div class="modal__title">CHANGE BOX SIZE</div>
    <meal-cart-box-sizes :size-selected="getSizeSelected" @change="changeSizeSelected" radio-name="popup" />
    <div class="modal__options">
      <div class="modal__options--item modal__options--cancel" @click="closeModal">Cancel</div>
      <div class="modal__options--item modal__options--continue" @click="saveChanged">Save</div>
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
      valSelected: ''
    }
  },
  mounted() {
    this.valSelected = this.getSizeSelected.val
  },
  computed: {
    ...mapGetters('mealcart', ['getSizeSelected'])
  },
  methods: {
    changeSizeSelected(newVal) {
      this.valSelected = newVal
      const boxSize = +newVal.split('items')[0]
      sessionStorage.setItem('boxSize', boxSize)
    },
    closeModal() {
      this.$emit('close')
    },
    saveChanged() {
      this.$store.dispatch('mealcart/validateChangeSizeSelected', this.valSelected)
    }
  }
}
</script>

<style lang="scss">
@include media-tablet-up {
  .modal__box-size {
    .modal__options {
      @include flex($justify: space-between);

      &--item {
        width: 48%;
      }
    }

    .box-sizes__option {
      &--content {
        flex-direction: column;
        align-items: flex-start;

        &::before {
          /* width: 5%;*/
        }
      }

      &--title {
        margin-bottom: 0.2rem;
      }
    }
  }
}
</style>
