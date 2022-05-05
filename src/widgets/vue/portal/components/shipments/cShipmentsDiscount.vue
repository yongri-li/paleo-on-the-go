<template>
  <form
    :class="_buildModifiers('c-shipmentsDiscount', modifiers)"
    v-if="address && shipment && content"
    @submit.prevent="handleApply"
  >
    <input
      class="c-shipmentsDiscount__input"
      v-if="content.placeholder"
      v-model="discountModel"
      :placeholder="content.placeholder"
    />
    <c-button
      class="c-shipmentsDiscount__button"
      :class="{ 'code-error': status === 'error', 'code-applied': status === 'applied' }"
      v-if="content.button_text"
      :loading="loading.apply"
      :success="status === 'success'"
      :status="status"
      :text="{
        default: content.button_text,
        success: content.button_success,
        error: 'Incorrect Code',
        remove: 'Remove',
        removed: 'Removed'
      }"
      :attributes="{ disabled }"
      :modifiers="['isSecondary']"
    />
  </form>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { apiService } from '@shared/services'

import cButton from '@shared/components/core/cButton.vue'

export default {
  props: {
    address: {
      type: Object
    },
    shipment: {
      type: Object,
      required: true
    },
    content: {
      type: Object,
      required: true
    },
    modifiers: {
      type: Array,
      default: () => []
    }
  },
  components: {
    cButton
  },
  data: () => ({
    discountModel: '',
    discountCode: '',
    loading: { apply: false },
    status: false
  }),
  computed: {
    disabled() {
      return this.status == 'success' || this._stringEmpty(this.discountModel)
    },
    modalContent() {
      const discount = this.$store.getters['customize/customizeModalByPrefix']('discount_')
      return { discount }
    }
  },
  methods: {
    ...mapMutations('ui', ['UI_SET_MODAL']),
    ...mapActions('customer', ['customerUpdateAddressDiscount', 'customerDeleteAddressDiscount']),
    async handleApply() {
      this.loading.apply = true
      if (this.status === 'applied') {
        await this.customerDeleteAddressDiscount({
          addressId: this.shipment.addressId
        })
        this.discountCode = ''
        this.discountModel = ''
        this.status = 'removed'
        this.loading.apply = false
        return
      }
      const { address, charges, error } = await this.customerUpdateAddressDiscount({
        addressId: this.shipment.addressId,
        discountCode: this.discountModel
      })
      if (!error) {
        this.status = 'success'
        this.discountCode = this.discountModel
        setTimeout(() => (this.status = 'applied'), 2250)
      } else {
        this.status = 'error'
      }
      this.loading.apply = false
    }
  },
  watch: {
    discountModel: {
      handler(val) {
        if (this._stringEmpty(val) && !this.discountCode) this.status = false
        if (this.status === 'error') this.status = false
      }
    }
  },
  async created() {
    const apiClient = new apiService()
    const { data } = await apiClient.get('/v1/customer/resources?resources=charges')
    const { resources } = data
    const num = resources.charges.length
    const discount = await resources.charges[num - 1].discount_codes[0]?.code

    if (discount) {
      this.discountCode = discount
      this.discountModel = discount
      this.status = 'applied'
    }
  }
}
</script>

<style lang="scss">
.c-shipmentsDiscount {
  position: relative;
  overflow: hidden;
  height: 4rem;
  width: 100%;
  border: 1px solid $color-ecru;
  font-size: 1rem;
  padding: 1rem;
  @include flex($justify: space-between, $wrap: nowrap);
  .c-loading {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .c-loading__wheel {
    width: 12px;
    height: 12px;
    border-width: 2px;
    border-color: rgba($color-grey, 0.5);
    border-top-color: $color-grey;
  }
}
.c-shipmentsDiscount__input {
  height: 100%;
  flex-grow: 1;
  @include input-unset;
  font-family: $font-body;
  font-weight: 500;
  font-size: 1rem;
  text-transform: uppercase;
  @include media-mobile-down {
    max-width: calc(100% - 80px);
  }
  &::placeholder {
    color: rgba($color-black, 0.5);
    font-weight: 400;
  }
  div {
    color: red;
  }
}
.c-shipmentsDiscount__button {
  height: 100%;
  color: $color-secondary;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.25px;
  line-height: 1;
  border-bottom: 0;
  margin-left: 0.5rem;
  text-transform: uppercase;
  &.code-error {
    color: red;
  }
  &.code-applied {
    color: $color-black;
    text-decoration: underline;
  }
}
</style>
