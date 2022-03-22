<template>
  <div class="modal">
    <c-overlay
      class="modal__overlay"
      :show="true"
      @close="closeModal"
      slot="overlay"
    />
    <component
      class="modal__content"
      :is="modal.component"
      @close="closeModal"
    />
  </div>
</template>

<script>
import cOverlay from '@shared/components/core/cOverlay.vue'
import { MODAL_CLOSE } from '../../store/_mutations-type'

import { mapState } from 'vuex'

export default {
  components: {
    cOverlay
  },
  computed: {
    ...mapState([
      'modal'
    ])
  },
  methods: {
    closeModal() {
      console.log('funciona el click')
      this.$store.commit(MODAL_CLOSE)
    }
  }
}
</script>

<style lang="scss">

.modal {

  &__overlay {
    z-index: 105;
    // cursor: pointer;
  }

  &__content {
    position: fixed;
    top: 10%;
    left: 7%;
    z-index: 105;
    background-color: $color-white;
    width: 86%;
    padding: 2rem 1rem 1rem;

    @include media-tablet-up {
      width: 30%;
      min-width: 500px;
      left: 35%;
      padding: 3rem;
    }
  }

  &__title {
    font-family: $font-heading;
    font-size: 2rem;
    text-align: center;
    margin-bottom: 1rem;

    @include media-tablet-up {
      font-size: 2.5rem;
      margin-bottom: 2rem;
    }
  }

  &__options {

    &--item {
      text-align: center;
      padding: 1rem 0;
      margin-top: 1rem;
      font-size: 1.2rem;
      font-weight: 500;
      cursor: pointer;
      width: 100%;
    }

    &--cancel {
      border: 1px solid #A7A5A6;
    }

    &--continue {
      background-color: $color-primary
    }
  }

}

</style>