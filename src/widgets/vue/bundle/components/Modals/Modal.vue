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
      :params="modal.settings.params"
      @close="closeModal"
    />
  </div>
</template>

<script>
import cOverlay from '@shared/components/core/cOverlay.vue'
import { MODAL_CLOSE } from '../../store/modules/modals/_mutations-type'

import { mapState } from 'vuex'

export default {
  components: {
    cOverlay
  },
  computed: {
    ...mapState('modals', [
      'modal'
    ])
  },
  methods: {
    closeModal() {
      console.log('funciona el click')
      this.$store.commit(`modals/${MODAL_CLOSE}`)
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
    text-align: center;

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
    margin-bottom: 1rem;

    @include media-tablet-up {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
  }

  &__options {

    &--item {
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

  &__close {
    position: absolute;
    right: 3%;
    top: 3%;
    font-family: $font-heading;
    font-size: 1.5rem;
    border-radius: 100%;
    cursor: pointer;
    width: 35px;
    height: 35px;
    border: 1px solid $color-black;
    @include flex($justify: center);
  }

}

</style>