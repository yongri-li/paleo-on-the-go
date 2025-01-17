<template>
  <form :class="_buildModifiers('c-formBilling', modifiers)" @submit.prevent="handleSubmit" v-if="content">
    <div class="c-formBilling__fieldGroup">
      <c-field class="c-formBilling__field" v-if="content.first_label" :label="content.first_label">
        <c-input
          class="c-formBilling__input"
          v-model="billingModel.firstName"
          :error="errors.firstName"
          :modifiers="['isDefault']"
          :attributes="{
            type: 'text',
            value: billingModel.firstName
          }"
        />
      </c-field>
      <c-field class="c-formBilling__field" v-if="content.last_label" :label="content.last_label">
        <c-input
          class="c-formBilling__input"
          v-model="billingModel.lastName"
          :error="errors.lastName"
          :modifiers="['isDefault']"
          :attributes="{
            type: 'text',
            value: billingModel.lastName
          }"
        />
      </c-field>
    </div>
    <div>
      <c-field class="c-formBilling__field" v-if="content.address1_label" :label="content.address1_label">
        <c-input
          class="c-formBilling__input"
          v-model="billingModel.address1"
          :error="errors.address1"
          :modifiers="['isDefault']"
          :attributes="{
            type: 'text',
            value: billingModel.address1
          }"
        />
      </c-field>
    </div>
    <div class="c-formBilling__fieldGroup">
      <c-field class="c-formBilling__field" v-if="content.address2_label" :label="content.address2_label">
        <c-input
          class="c-formBilling__input"
          v-model="billingModel.address2"
          placeholder="Ex. Unit A"
          :error="errors.address2"
          :modifiers="['isDefault']"
          :attributes="{
            type: 'text',
            value: billingModel.address2
          }"
        />
      </c-field>
      <c-field class="c-formBilling__field" v-if="content.zip_label" :label="content.zip_label">
        <c-input
          class="c-formBilling__input"
          v-model="billingModel.zip"
          :error="errors.zip"
          :modifiers="['isDefault']"
          :attributes="{
            type: 'text',
            value: billingModel.zip
          }"
        />
      </c-field>
    </div>
    <div class="c-formBilling__fieldGroup">
      <c-field class="c-formBilling__field" v-if="content.city_label" :label="content.city_label">
        <c-input
          class="c-formBilling__input"
          v-model="billingModel.city"
          :error="errors.city"
          :modifiers="['isDefault']"
          :attributes="{
            type: 'text',
            value: billingModel.city
          }"
        />
      </c-field>
      <c-field class="c-formBilling__field" v-if="content.province_label" :label="content.province_label">
        <c-provinceSelect
          class="c-formBilling__select"
          v-model="billingModel.province"
          country="United States"
          :error="errors.province"
          :modifiers="['isDefault']"
          :attributes="{
            value: billingModel.province
          }"
        />
      </c-field>
      <!-- :country="billingModel.country" -->
    </div>
    <!--     <div class="c-formBilling__fieldGroup">
      <c-field class="c-formBilling__field"
        v-if="content.zip_label"
        :label="content.zip_label"
      >
        <c-input class="c-formBilling__input"
          v-model="billingModel.zip"
          :error="errors.zip"
          :modifiers="['isDefault']"
          :attributes="{
            type: 'text',
            value: billingModel.zip
          }"
        />
      </c-field>
      <c-field class="c-formBilling__field"
        v-if="content.country_label"
        :label="content.country_label"
      >
        <c-countrySelect class="c-formBilling__select"
          v-model="billingModel.country"
          :country="billingModel.country"
          :error="errors.country"
          :modifiers="['isDefault']"
          :attributes="{
            value: billingModel.country
          }"
        />
      </c-field>
    </div> -->
    <div class="c-formBilling__ctaWrap">
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
      <c-alert class="c-formBilling__alert" v-if="!hideAlert && status" :role="status" :messages="messages" />
    </div>
  </form>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
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
    modifiers: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      billingModel: {
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
    hasErrors() {
      return Object.keys(this.errors).length > 0
    }
  },
  methods: {
    ...mapActions('customer', ['customerUpdatePaymentMethod', 'customerUpdateBilling']),
    validateForm() {
      this.status = false
      this.errors = {}
      this.messages = []
      const { firstName, lastName, address1, address2, city, province, zip, country } = this.billingModel
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
      console.log(formValidation)
      if (formValidation.hasErrors) this.status = 'error'
      this.errors = { ...formValidation.errors }
      this.messages = [...formValidation.messages]
    },
    async handleSubmit() {
      this.validateForm()
      if (!this.hasErrors) {
        this.loading = true
        const { customer, error } = await this.customerUpdateBilling({ address: this.billingModel })
        console.log(error)
        // const { paymentMethod, error } = await this.customerUpdatePaymentMethod({
        //   address: this.billingModel
        // })
        // console.log(paymentMethod, error)
        if (!error) {
          this.status = 'success'
          if (!this.hideAlert && this.content.success_text) {
            this.messages.push(this.content.success_text)
          }
        } else {
          this.status = 'error'
          switch (error) {
            case 'LIMIT_EXCEEDED':
              this.messages.push(this.content.error_limit)
              break
            default:
              // this.messages.push(this.content.error_general)
              this.messages.push('Error, could not save')
          }
        }
        this.loading = false
      }
    }
  },
  watch: {
    customerRecharge: {
      immediate: true,
      handler(val) {
        if (val)
          this.billingModel = {
            firstName: val.firstName,
            lastName: val.lastName,
            ...val.billingAddress
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

.c-formBilling__ctaWrap {
  display: flex;
  align-items: flex-end;
  gap: 2rem;

  .c-formBilling__button {
    margin-bottom: 0;
  }
}
</style>
