<template>
  <form :class="_buildModifiers('c-formShipping', modifiers)"
    @submit.prevent="handleSubmit"
    v-if="content && address"
  >
    <c-alert class="c-formShipping__alert"
      v-if="!hideAlert && status"
      :role="status"
      :messages="messages"
    />
    <c-field class="c-formShipping__field"
      v-if="content.first_label"
      :label="content.first_label"
    >
      <c-input class="c-formShipping__input"
        v-model="shippingModel.firstName"
        :error="errors.firstName"
        :modifiers="['isDefault']"
        :attributes="{
          type: 'text',
          value: shippingModel.firstName
        }"
      />
    </c-field>
    <c-field class="c-formShipping__field"
      v-if="content.last_label"
      :label="content.last_label"
    >
      <c-input class="c-formShipping__input"
        v-model="shippingModel.lastName"
        :error="errors.lastName"
        :modifiers="['isDefault']"
        :attributes="{
          type: 'text',
          value: shippingModel.lastName
        }"
      />
    </c-field>
    <c-field class="c-formShipping__field"
      v-if="content.address1_label"
      :label="content.address1_label"
    >
      <c-input class="c-formShipping__input"
        v-model="shippingModel.address1"
        :error="errors.address1"
        :modifiers="['isDefault']"
        :attributes="{
          type: 'text',
          value: shippingModel.address1
        }"
      />
    </c-field>
    <c-field class="c-formShipping__field"
      v-if="content.address2_label"
      :label="content.address2_label"
    >
      <c-input class="c-formShipping__input"
        v-model="shippingModel.address2"
        :error="errors.address2"
        :modifiers="['isDefault']"
        :attributes="{
          type: 'text',
          value: shippingModel.address2
        }"
      />
    </c-field>
    <c-field class="c-formShipping__field"
      v-if="content.city_label"
      :label="content.city_label"
    >
      <c-input class="c-formShipping__input"
        v-model="shippingModel.city"
        :error="errors.city"
        :modifiers="['isDefault']"
        :attributes="{
          type: 'text',
          value: shippingModel.city
        }"
      />
    </c-field>
    <c-field class="c-formShipping__field"
      v-if="content.province_label"
      :label="content.province_label"
    >
      <c-provinceSelect class="c-formShipping__select"
        v-model="shippingModel.province"
        :country="shippingModel.country"
        :error="errors.province"
        :modifiers="['isDefault']"
        :attributes="{
          value: shippingModel.province
        }"
      />
    </c-field>
    <c-field class="c-formShipping__field"
      v-if="content.zip_label"
      :label="content.zip_label"
    >
      <c-input class="c-formShipping__input"
        v-model="shippingModel.zip"
        :error="errors.zip"
        :modifiers="['isDefault']"
        :attributes="{
          type: 'tel',
          value: shippingModel.zip,
          minlength: '5',
          maxlength: '5'          
        }"        
      />
    </c-field>
    <c-field class="c-formShipping__field"
      v-if="content.country_label"
      :label="content.country_label"
    >
      <c-countrySelect class="c-formShipping__select"
        v-model="shippingModel.country"
        :country="shippingModel.country"
        :error="errors.country"
        :modifiers="['isDefault']"
        :attributes="{
          value: shippingModel.country
        }"
      />
    </c-field>
    <label v-if="notesAllowed" class="c-field__label">Special Delivery Instructions</label>
    <textarea v-if="notesAllowed" class="c-textarea" v-model="deliveryNote" rows="4">{{address.cartNote}}</textarea>   
    <c-button class="c-formShipping__button"
      v-if="content.button_text"
      :loading="loading"
      :success="status === 'success'"
      :attributes="{ 
        disabled: disabled && deliveryNote.length < 1 || status === 'success'
      }"
      :text="{
        default: content.button_text,
        success: content.button_success
      }"
      :modifiers="[
        'isDefault', 'isSecondary', 
        'hideTextLoading', 'isSubmit'
      ]"
    />
    <c-alert class="c-formShipping__alert"
      v-if="!hideAlert && status === 'error' "
      :role="status"
      :messages="messages"
    />
  </form>
</template>

<script>
import deepEqual from 'deep-equal'
import { mapGetters, mapActions, mapMutations, mapState } from 'vuex'
import cAlert from '@shared/components/core/cAlert.vue'
import cField from '@shared/components/core/cField.vue'
import cInput from '@shared/components/core/cInput.vue'
import cButton from '@shared/components/core/cButton.vue'
import cProvinceSelect from '@shared/components/parts/cProvinceSelect.vue'
import cCountrySelect from '@shared/components/parts/cCountrySelect.vue'
import { getDeliveryDaysByZip, zipAllowsCustomNote } from '@shared/utils'

export default {
  props: {
    address: {
      type: Object,
      required: true
    },
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
      default: () => ([])
    }
  },
  data() {
    return { 
      shippingModel: { 
        firstName: '', lastName: '',
        address1: '', address2: '', city: '',
        province: '', zip: '', country: ''
      },
      notesAllowed: false,
      loading: false,
      status: false,
      messages: [],
      deliveryNote: this.address.cartNote ? this.address.cartNote : '',
      errors: {},
      ...window.Scoutside.shop
    }
  },
  components: { 
    cAlert, cField, cInput, cButton,
    cProvinceSelect, cCountrySelect
  },
  computed: {
    ...mapState('customer', ['deliverydays']),     
    addressFields() {
      const { firstName, lastName, address1, address2, city, province, zip, country } = this.address
      return { firstName, lastName, address1, address2, city, province, zip, country }
    },
    disabled() {
      return deepEqual(this.shippingModel, this.addressFields, this.deliveryNote)
    },
    hasErrors() {
      return Object.keys(this.errors).length > 0
    },
    modalContent() {
      const deliveryzip = this.$store.getters['customize/customizeModalByPrefix']('deliveryzip_')
      return { deliveryzip }
    },    
    shipdayz(){
      const arrStr = this.deliverydays.length > 0 ? this.deliverydays : localStorage.getItem('delvDays')
      return `[${arrStr}]`
    },
    currentShipDays() {
      const devDaysStr = this.shipdayz.split(',')
      const devDaysArr = devDaysStr.map(day => day*1)
      return devDaysArr
    },
    newShipDays() {
      return JSON.stringify(getDeliveryDaysByZip(this.shippingModel.zip, this.custom_json));
    },
    newZipHasNewShipDates() {
      return this.shipdayz === this.newShipDays ? false : true;
    }
  },
  methods: {
    ...mapActions('customer', ['customerUpdateAddress']),    
    ...mapMutations('ui', ['UI_CLOSE_SIDEBAR', 'UI_SET_MODAL']),             
    async validateForm() {
      this.status = false
      this.errors = {}
      this.messages = []
      const { 
        firstName, lastName,
        address1, address2, city,
        province, zip, country 
      } = this.shippingModel
      const formValidation = this._validateForm([
        { 
          name: 'firstName', value: firstName, 
          rules: ['validateRequired'],
          messages: [
            'First name required'
          ]          
          // messages: [
          //   this.content.error_required
          // ]
        },
        { 
          name: 'lastName', value: lastName, 
          rules: ['validateRequired'],
          messages: [
            'Last name required'
          ]
        },
        { 
          name: 'address1', value: address1, 
          rules: ['validateRequired'],
          messages: [
            'Address required'
          ]
        },
        { 
          name: 'city', value: city, 
          rules: ['validateRequired'],
          messages: [
            'City required'
          ]
          // [
          //   this.content.error_required
          // ]
        },
        { 
          name: 'province', value: province, 
          rules: ['validateRequired'],
          messages: [
            'State or province required'
          ]
        },
         { 
          name: 'zip', value: zip, 
          rules: ['validateRequired', 'validatePostcode'],
          reference: country,
          messages: [
            'Zip code required'
          ]
        },
         { 
          name: 'country', value: country, 
          rules: ['validateRequired'],
          messages: [
            'Country required'
          ]
        }
      ])
      if(formValidation.hasErrors) this.status = 'error'
      this.errors = { ...formValidation.errors }
      this.messages = [ ...formValidation.messages ]
      this.loading = false
      return false;
    },
    async triggerZipModal(){
      this.UI_SET_MODAL({
        component: 'cModalZipChange',
        content: this.modalContent.deliveryzip,
        settings: { 
          closable: false
        }
      })
    },    
    async handleSubmit() {
      if(this.newZipHasNewShipDates) {
        this.loading = false 
        this.triggerZipModal()     
        return false;
      }       
      this.validateForm()
      if(!this.hasErrors) {
        this.loading = true
        const { success, error } = await this.customerUpdateAddress({ 
          updates: { 
            id: this.address.id,
            ...this.shippingModel,
            "cart_note": this.deliveryNote
          }
        })
        if(!error) {
          this.status = 'success'
          if(!this.hideAlert && this.content.success_text) {
            this.messages.push(this.content.success_text)
          }
        } 
        else {
          this.status = 'error'
          this.messages = [ "Zip and State don't match" ]
          switch(error) {
            case 'LIMIT_EXCEEDED':
              this.messages.push(this.content.error_limit)
              break;
            default: 
              //this.messages.push(this.content.error_general)
          }
          this.loading = false
          return false;
        }
        this.loading = false
        this.UI_CLOSE_SIDEBAR()
      }
    }
  },
  mounted(){
    if (zipAllowsCustomNote(this.custom_json_notes, this.shippingModel.zip)) {
      this.notesAllowed = true;
    }
  },
  watch: {
    addressFields: {
      deep: true,
      immediate: true,
      handler(val) {
        if(val) this.shippingModel = { ...val }
      }
    },
    shippingModel: {
      deep: true,
      handler() {
        this.status = false
        const nums = [0,1,2,3,4,5,6,7,8,9]
        const arrFrom = Array.from(String(this.shippingModel.zip), Number)
        const isNum = arrFrom.map(num => nums.includes(num))
        if(!isNum.every(itm => itm === true)) this.shippingModel.zip = this.shippingModel.zip.slice(0,-1)
      }
    }
  }
}
</script>

<style lang="scss">
  .c-sidebarShipping {
    padding-bottom: 3.5rem;
  }

  .c-formShipping__fieldGroup {
    @include grid($columns: 1fr, $auto-flow: row, $gap: 0 40px);
    @include media-tablet-up {
      grid-template-columns: 1fr 1fr;
    }
  }

  .c-textarea {
    font-weight: 500;
  }

  .c-formShipping__alert {
    .c-alert__icon {
      display: none;
    }
  }

  button + .c-formShipping__alert {
    margin-top: 1rem;
  }
</style>