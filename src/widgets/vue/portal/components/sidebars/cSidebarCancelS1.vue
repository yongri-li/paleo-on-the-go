<template>
  <div :class="_buildModifiers('c-sidebarCancel', modifiers)"
    v-if="content && address"
  >
    <c-h class="c-sidebar__heading"
      tag="h1"
      level="1"
      :text="content.cancel_heading"
    />

    <c-p class="c-sidebarCancel__address"
      tag="address"
      level="1"
      v-html="_buildAddress({
        address: address,
        options: {
          hiddenFields: ['name', 'country', 'company'],
          provinceName: 'short',
          flatten: true
        }
      })"
    />
    <section class="content-block__wthBg cancel__steps">
      <img
        v-if="content.cancel_image_s1"
        class="c-sidebarCancel__image"
        :src="content.cancel_image_s1"
        :alt="content.cancel_image_alt_s1"
      />

      <article class="c-sidebarCancel__article">
        <div class="c-sidebarCancel__article-inner">
          <img
            v-if="content.cancel_break_image"
            class="c-sidebarCancel__article-icon"
            :src="content.cancel_break_image"
            :alt="content.cancel_break_heading"
          />
          <c-h
            class="c-sidebarCancel__article-subheading"
            tag="h3"
            level="2"
            :text="content.cancel_break_heading"
          />
          <c-p
            class="c-sidebarCancel__article-desc"
            tag="p"
            level="4"
            :text="content.cancel_break_text"
          />
          <c-button class="c-cta c-cta--inverse c-loading--isPrimary"
            @click="pushToShipmentsPage"
            :loading="loading.delay"
            :modifiers="['isHollow', 'hideTextLoading']"
            :text="content.cancel_break_btn"
          />            
        </div>
      </article>

      <article class="c-sidebarCancel__article">
        <div class="c-sidebarCancel__article-inner">
          <img
            v-if="content.cancel_faq_image"
            class="c-sidebarCancel__article-icon"
            :src="content.cancel_faq_image"
            :alt="content.cancel_faq_heading"
          />
          <c-h
            class="c-sidebarCancel__article-subheading"
            tag="h3"
            level="2"
            :text="content.cancel_faq_heading"
          />
          <c-p
            class="c-sidebarCancel__article-desc"
            tag="p"
            level="4"
            :text="content.cancel_faq_text"
          />
          <a :href="content.cancel_faq_link" class="c-cta c-cta--inverse">
            {{ content.cancel_faq_btn }}
          </a>
        </div>
      </article>

      <article class="c-sidebarCancel__article">
        <div class="c-sidebarCancel__article-inner">
          <img
            v-if="content.cancel_contact_image"
            class="c-sidebarCancel__article-icon"
            :src="content.cancel_contact_image"
            :alt="content.cancel_contact_heading"
          />
          <c-h
            class="c-sidebarCancel__article-subheading"
            tag="h3"
            level="2"
            :text="content.cancel_contact_heading"
          />
          <c-p
            class="c-sidebarCancel__article-desc"
            tag="p"
            level="4"
            :text="content.cancel_contact_text"
          />
          <button
            @click="handleZenDeskClick"
            type="button"
            class="c-cta c-cta--inverse"
          >
            {{ content.cancel_contact_btn }}
          </button>
        </div>
      </article>

      <div class="c-sidebarCancel__article">
        <div class="c-sidebarCancel__article-inner">
          <button class="c-cta c-button--isDefault" @click="handleSubmit">
            {{ content.cancel_submit_button_s1 }}
          </button>
          <button class="c-sidebarCancel__nevermind" @click="UI_CLOSE_SIDEBAR">
            {{ content.cancel_nevermind_button_s1 }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters, mapState } from 'vuex'
import { setOneMonthAhead, convertDateToDDMMYYYY, convertNumberToDay, setNewDateAheadofDateT } from '@shared/utils';
import { apiService } from '@shared/services'
import cP from '@shared/components/core/cP.vue'
import cH from '@shared/components/core/cH.vue'
import cButton from '@shared/components/core/cButton.vue';
import cLoading from '@shared/components/core/cLoading.vue'

export default {
  props: {
    content: {
      type: Object,
      required: true
    },
    settings: {
      type: Object,
      required: true
    },
    modifiers: {
      type: Array,
      default: () => ([])
    }
  },
  components: {
    cP, cH,
    cButton,
    cLoading    
  },
  data() {
    return {
      dfMenuSubs: [],
      oldOnetimes: [],      
      loading: {
        delay: false,
        cancel: false,
        activate: false
      }
    }
  },
  computed: {
    ...mapState('customer', ['deliveryday']),  
    ...mapState('products', ['defaultMenu', 'defaultMenuItems']),
    ...mapGetters('customer', [
      'customerUpcomingCharges'
    ]),    
    subscriptions() {
      return this.$store.getters['customer/customerSubscriptionsByAddress'](this.settings.addressId)
    },
    subscriptionIds() {
      return this.subscriptions.map(subscription => subscription.id)
    },      
    onetimes() {
      return this.$store.state.customer.resources.onetimes;
    },
    onetimeIds() {
      return this.onetimes.map(onetime => onetime.id);
    },    
    address() {
      return this.$store.getters['customer/customerAddressById'](this.settings.addressId)
    },
    nextCharge(){
      return this.customerUpcomingCharges.find(chrg => (chrg.status === 'QUEUED')); 
    },
    nextChargeDate(){
      return this.nextCharge.scheduled_at;
    },    
    delayChargeOneMonth(){
      return setOneMonthAhead(this.nextChargeDate);
    },
    delayChargeFourWeeks(){
      return setNewDateAheadofDateT(this.nextChargeDate, 28);
    },   
    delayDeliveryOneMonth(){
      return setOneMonthAhead(this.nextCharge.note_attributes[1].value);
    },
    delayDeliveryFourWeeks(){
      return setNewDateAheadofDateT(this.nextCharge.note_attributes[1].value, 28);
    },    
    delayedDelvDate(){
      return convertDateToDDMMYYYY(this.delayDeliveryOneMonth)
    },
    delayedDelvDate4Weeks(){
      return convertDateToDDMMYYYY(this.delayDeliveryFourWeeks)
    },    
    delayedDelvDay(){
      return (convertNumberToDay(new Date(this.delayDeliveryOneMonth).getDay()))
    },
    delayedDelvDay4Weeks(){
      return (convertNumberToDay(new Date(this.delayDeliveryFourWeeks).getDay()))
    },
    dfMenuSubscriptionUpdates() {        
      return this.defaultMenuItems.map(child => {
        return {
          shopify_variant_id: child.upsellId || child.variants[0].id,
          quantity: child.quantity,
          price: (child.variants[0].price / 100).toFixed(2),
          hash: child.price_hashes[0],
          tags: child.tags,
          product_type: child.type,
          charge_interval_frequency: 1,
          order_interval_frequency: 1,
          order_interval_unit: 'week',
          upsell_id: child.upsellId ? child.upsellId : null,
          upsell_price: child.upsellId ? (child.variants[1].price / 100).toFixed(2) : null,
          next_charge_scheduled_at: this.delayChargeFourWeeks 
        }
      })
    }          
  },
  methods: {
    ...mapMutations('ui', ['UI_SET_SIDEBAR', 'UI_CLOSE_SIDEBAR']),   
    ...mapActions('customer', [
      'customerUpdateAddressItems',
      'customerUpdateChargesDate',
      'customerUpdateAddress',
      'customerUpdatePlanToDFMenu'
    ]),
    ...mapActions('bundle', [
      'customerUpdatePlan',
      'customerDeleteOnetimes'
    ]),    
    ...mapMutations('customer', ['CUSTOMER_SET_DELIVERYDAY', 'CUSTOMER_SET_DELIVERYDATE']),     
    handleSubmit() {
      this.UI_SET_SIDEBAR({
        component: 'cSidebarCancelS2',
        content: this.content,
        settings: this.settings
      })
    },
    async handleZenDeskClick() {
      const script = document.createElement('script');
      const first = document.getElementsByTagName('script')[0];

      script.type = 'text/javascript';
      script.async = true;
      script.src = 'https://static.zdassets.com/ekr/snippet.js?key=12907745-07b4-47fa-aec2-26a4b2a1295c';
      script.id = 'ze-snippet';

      first.parentNode.insertBefore(script, first);
    },
    async getSubz(){
      const apiClient = new apiService()
      const { data } = await apiClient.get('/v1/customer/resources?resources=onetimes,subscriptions')
      this.dfMenuSubs = data.resources.subscriptions;
      this.oldOnetimes = data.resources.onetimes;
    }, 
    async pushToShipmentsPage(){
      await this.$router.push({ path: '/shipments' })
    },   
    async handleDelayCharge() {
      this.loading.delay = true

      const update = await this.customerUpdatePlanToDFMenu({
        addressId: this.address.id,
        updates: [
          ...this.dfMenuSubscriptionUpdates
        ],
        deletes: [  
          ...this.subscriptionIds
        ]
      }); 

      await this.deleteOnetimes({
        addressId: this.address.id,
        ids: this.onetimeIds 
      })      

      if(update) {
        setTimeout(async()=>{this.delayChargesUpdate()},500); 
      }
    },
    async deleteOnetimes(payload) {
      const { addressId, ids } = payload
      const apiClient = new apiService()
      const { data } = await apiClient.delete('/v1/customer/onetimes', { 
        data: { addressId, ids }
      })
    },    
    async delayChargesUpdate(){
      const { charges, onetimes, subscriptions, error } = await this.customerUpdateChargesDate({
        addressId: this.settings.addressId,
        updates: [{ 
          id: this.nextCharge.id, 
          next_charge_date: this.delayDeliveryFourWeeks              
        }]
      })   

      this.handleDelayDelivery();
    },
    async handleDelayDelivery() {
      const { address, error } = await this.customerUpdateAddress({  
        updates: { 
          id: this.settings.addressId,
          "note_attributes": [
            {
              "name": "Delivery Day",
              "value": this.delayedDelvDay4Weeks
            },          
            {
              "name": "Delivery Date",
              "value": this.delayedDelvDate4Weeks
            }
          ]         
        }        
      })  

      this.CUSTOMER_SET_DELIVERYDAY(this.delayedDelvDay4Weeks);
      this.CUSTOMER_SET_DELIVERYDATE(this.delayedDelvDate4Weeks);           
     
      this.loading.delay = false
      this.UI_CLOSE_SIDEBAR()
    }  
  }
}
</script>

<style lang="scss" scoped>
  .content-block__wthBg {
    background-color: $color-ecru;
    border-radius: 12px;
    padding: 14px;
    padding-bottom: 25px;
  }

  img.c-sidebarCancel__image {
    display: block;
    width: 100%;
    margin-bottom: 40px;
    border-radius: 12px;
  }

  .c-sidebarCancel__article-subheading {
    font-size: 24px;
  }

  .c-sidebarCancel__article {
    padding-right: 35px;
    padding-left: 35px;
  }

  p.c-sidebarCancel__article-desc {
    padding-left: 0;
    padding-right: 0;
  }

  .c-sidebarCancel__article-inner {
    margin-bottom: 30px;
    padding-right: 5px;
    padding-bottom: 30px;
    padding-left: 5px;
    border-bottom: 1px solid $color-paleo;
    text-align: center;

    .c-sidebarCancel__article:last-child & {
      margin-bottom: 0;
      padding-bottom: 0;
      border: 0;
    }
  }

  .c-sidebarCancel__article-icon {
    margin-bottom: 15px;
    display: inline-block;
  }

  .c-sidebarCancel__nevermind {
    font-size: 13px;
    font-weight: 800;
    text-transform: uppercase;
    color: $color-broccoli;
    margin-top: 18px;
    border: 0;
    padding: 0;
    border-bottom: 1px solid $color-broccoli;
    outline: 0;
    background: none;
    cursor: pointer;
  }

</style>
