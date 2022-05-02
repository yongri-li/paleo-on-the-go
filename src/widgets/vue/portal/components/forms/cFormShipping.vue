<template>
  <form :class="_buildModifiers('c-formBilling', modifiers)" @submit.prevent="handleSubmit" v-if="content">
    <c-alert class="c-formBilling__alert" v-if="!hideAlert && status" :role="status" :messages="messages" />
    <c-field class="c-formBilling__field" v-if="content.first_label" :label="content.first_label">
      <c-input
        class="c-formBilling__input"
        v-model="shippingModel.firstName"
        :error="errors.firstName"
        :modifiers="['isDefault']"
        :attributes="{
          type: 'text',
          value: shippingModel.firstName
        }"
      />
    </c-field>

    <c-field class="c-formBilling__field" v-if="content.last_label" :label="content.last_label">
      <c-input
        class="c-formBilling__input"
        v-model="shippingModel.lastName"
        :error="errors.lastName"
        :modifiers="['isDefault']"
        :attributes="{
          type: 'text',
          value: shippingModel.lastName
        }"
      />
    </c-field>

    <c-field class="c-formBilling__field" v-if="content.address1_label" :label="content.address1_label">
      <c-input
        class="c-formBilling__input"
        v-model="shippingModel.address1"
        :error="errors.address1"
        :modifiers="['isDefault']"
        :attributes="{
          type: 'text',
          value: shippingModel.address1
        }"
      />
    </c-field>

    <c-field class="c-formBilling__field" v-if="content.address2_label" :label="content.address2_label">
      <c-input
        class="c-formBilling__input"
        v-model="shippingModel.address2"
        placeholder="Ex. Unit A"
        :error="errors.address2"
        :modifiers="['isDefault']"
        :attributes="{
          type: 'text',
          value: shippingModel.address2
        }"
      />
    </c-field>
    <c-field class="c-formBilling__field" v-if="content.city_label" :label="content.city_label">
      <c-input
        class="c-formBilling__input"
        v-model="shippingModel.city"
        :error="errors.city"
        :modifiers="['isDefault']"
        :attributes="{
          type: 'text',
          value: shippingModel.city
        }"
      />
    </c-field>
    <c-field class="c-formBilling__field" v-if="content.zip_label" :label="content.zip_label">
      <c-input
        class="c-formBilling__input"
        v-model="shippingModel.zip"
        :error="errors.zip"
        :modifiers="['isDefault']"
        :attributes="{
          type: 'text',
          value: shippingModel.zip,
          maxlength: '5'
        }"
      />
    </c-field>
    <c-field class="c-formBilling__field" v-if="content.province_label" :label="content.province_label">
      <c-provinceSelect
        class="c-formBilling__select"
        v-model="shippingModel.province"
        country="United States"
        :error="errors.province"
        :modifiers="['isDefault']"
        :attributes="{
          value: shippingModel.province
        }"
      />
    </c-field>
    <c-button
      class="c-formBilling__button"
      v-if="content.button_text"
      :loading="loading"
      :success="status === 'success'"
      :attributes="{
        disabled: status === 'success'
      }"
      :text="{
        default: content.button_text,
        success: content.button_success
      }"
      :modifiers="['isDefault', 'isPrimary', 'hideTextLoading', 'isSubmit']"
    />
  </form>
</template>

<script>
import deepEqual from 'deep-equal'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import cAlert from '@shared/components/core/cAlert.vue'
import cField from '@shared/components/core/cField.vue'
import cInput from '@shared/components/core/cInput.vue'
import cButton from '@shared/components/core/cButton.vue'
import cProvinceSelect from '@shared/components/parts/cProvinceSelect.vue'
import cCountrySelect from '@shared/components/parts/cCountrySelect.vue'

export default {
  props: {
    hideAlert: {
      type: Boolean,
      default: false
    },
    content: {
      type: Object,
      required: true
    },
    charge: {
      type: Object,
      required: true
    },
    modifiers: {
      type: Array,
      default: () => []
    },
    addressNum: {
      type: [String, Number]
    }
  },
  data() {
    return {
      shippingModel: {
        firstName: '',
        lastName: '',
        address1: '',
        address2: '',
        city: '',
        province: '',
        zip: '',
        country: 'United States'
      },
      loading: false,
      status: false,
      messages: [],
      errors: {}
    }
  },
  components: {
    cAlert,
    cField,
    cInput,
    cButton,
    cProvinceSelect,
    cCountrySelect
  },
  computed: {
    ...mapGetters('customer', ['customerRecharge']),
    activeAddrs: {
      get: function () {
        //return this.$store.getters['customer/customerAddressesWithStatus'].active[0]
        return this.$store.state.customer.resources.addresses[this.addressNum]
      },
      set: function (newValue) {
        return newValue
      }
    },
    hasErrors() {
      return Object.keys(this.errors).length > 0
    }
  },
  methods: {
    ...mapActions('customer', ['customerUpdateAddress']),
    ...mapMutations('ui', ['UI_CLOSE_SIDEBAR']),
    validateForm() {
      this.status = false
      this.errors = {}
      this.messages = []
      const { firstName, lastName, address1, address2, city, province, zip, country } = this.shippingModel
      const formValidation = this._validateForm([
        {
          name: 'firstName',
          value: firstName,
          rules: ['validateRequired'],
          // messages: [this.content.error_required] ? [this.content.error_required] : ['First Name required']
          messages: ['First Name required']
        },
        {
          name: 'lastName',
          value: lastName,
          rules: ['validateRequired'],
          messages: ['Last Name required']
        },
        {
          name: 'address1',
          value: address1,
          rules: ['validateRequired'],
          messages: ['Address required']
        },
        {
          name: 'city',
          value: city,
          rules: ['validateRequired'],
          messages: ['City required']
        },
        {
          name: 'province',
          value: province,
          rules: ['validateRequired'],
          messages: ['State or province required']
        },
        {
          name: 'zip',
          value: zip,
          rules: ['validateRequired'],
          messages: ['Zip Code required']
        },
        {
          name: 'country',
          value: country,
          rules: [],
          messages: ['Country required']
        }
      ])
      if (formValidation.hasErrors) this.status = 'error'
      this.errors = { ...formValidation.errors }
      this.messages = [...formValidation.messages]
    },
    async handleSubmit() {
      this.validateForm()
      if (!this.hasErrors) {
        this.loading = true
        const { success, error } = await this.customerUpdateAddress({ updates: this.shippingModel })
        console.log(success, error)

        if (!error) {
          this.status = 'success'
          this.$store.state.customer.resources.addresses[this.addressNum] = {
            ...this.activeAddrs,
            ...this.shippingModel
          }
          // const charges = this.$store.state.customer.resources.charges
          // const chrgNum = charges.length
          // charges[chrgNum - 1].shipping_address = { ...this.activeAddrs, ...this.shippingModel }
          this.charge.shipping_address = { ...this.activeAddrs, ...this.shippingModel }

          if (!this.hideAlert && this.content.success_text) {
            //this.messages.push(this.content.success_text)
          }
        } else {
          this.status = 'error'
          this.messages =
            error.message === 'ZIP_INVALID'
              ? ["Invalid Zip, or Zip & State don't match"]
              : ['Error:', error.message]
          switch (error.message) {
            case 'LIMIT_EXCEEDED':
              this.messages.push(this.content.error_limit)
              break
            default:
          }
          this.loading = false
          return false
        }
        this.loading = false
        setTimeout(() => this.UI_CLOSE_SIDEBAR(), 750)
      }
    }
  },
  watch: {
    addressFields: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) this.shippingModel = { ...val }
      }
    },
    shippingModel: {
      deep: true,
      handler() {
        // this.status = !this.status
        const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        const arrFrom = Array.from(String(this.shippingModel.zip), Number)
        const isNum = arrFrom.map(num => nums.includes(num))
        if (!isNum.every(itm => itm === true)) this.shippingModel.zip = this.shippingModel.zip.slice(0, -1)
      }
    },
    activeAddrs: {
      immediate: true,
      handler(val) {
        if (val)
          this.shippingModel = {
            id: val.id,
            firstName: val.firstName,
            lastName: val.lastName,
            address1: val.address1,
            address2: val.address2,
            zip: val.zip,
            city: val.city,
            company: '',
            province: val.province,
            country: val.country,
            phone: val.phone
          }
      }
    }
  }
}
</script>

<style lang="scss">
.c-formBilling__fieldGroup {
  @include grid($columns: 1fr, $auto-flow: row, $gap: 0 40px);
  @include media-tablet-up {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
