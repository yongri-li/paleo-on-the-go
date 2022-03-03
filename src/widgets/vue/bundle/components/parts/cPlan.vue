<template>
  <div class="c-plan">
    <span v-if="plan.mostPopular" class="c-plan__flag">
      Most Popular
    </span>
    <div class="c-plan__title-wrapper">
      <h3 class="c-plan__title c-h3">
        {{ plan.title }}
      </h3>
      <span v-if="plan.subscription" class="c-plan__subtitle u-colorGrey">
        per week
      </span>
    </div>
    <div class="c-plan__price">
      {{ productPrice }}<span class="c-plan__unit u-colorGrey u-weight-400">/meal</span>
    </div>
    <div class="c-plan__text">
      <span v-if="plan.subscription" class="u-colorBroccoli">
        {{ plan.text }}
      </span>
      <span v-else>{{ plan.text }}</span>
    </div>
    <div class="c-plan__cta-wrapper">
      <button class="c-cta" 
        @click="handleSelectClk"
        :disabled="plan.subscription && checkingEmail"
      >
        {{ CTAtext }}
      </button>
    </div>
<!--    <div class="c-plan__details">
      {{ plan.minimum }} Meal Minimum
    </div> -->
  </div>
</template>

<script>
  import { mapState } from 'vuex';  
  import { formatPrice } from '../../utils';
  export default {
    name: "cPlan",
    props: {
      plan: {
        type: Object
      }
    },
    data() {
      return {
        checkingEmail: false
      }
    },
    computed: {
      ...mapState([
        'inactiveSubscriber',
        'inactiveSubs',
        'isSubscriber'
      ]),       
      productPrice() {
        return formatPrice(this.plan.price);
      },
      isLoggedinCustomer(){
        return customer.email && customer.shopify_id ? true : false;
      },
      isInactiveSubs(){
        return customer.tags.includes('Inactive Subscriber')
      },  
      isActiveSubs(){
        return customer.tags.includes('Active Subscriber')
      },          
      CTAtext(){
        if((this.isSubscriber || this.inactiveSubscriber || this.isInactiveSubs || this.isActiveSubs) && this.plan.subscription && !this.isLoggedinCustomer) {
          return 'Login'
        } else if (this.isInactiveSubs && this.isLoggedinCustomer && this.plan.subscription) {
          return 'Reactivate'
        } else if (this.isActiveSubs && this.isLoggedinCustomer && this.plan.subscription) {
          return 'View Account'          
        } else {
          return 'Select'
        }
        return 'Select'
      }     
    },
    methods: {
      handleSelectClk(){
        if((this.isSubscriber || this.inactiveSubscriber || this.isInactiveSubs || this.isActiveSubs) && this.plan.subscription && !this.isLoggedinCustomer) {
          window.location.href = '/account/login'
        } else if ((this.isActiveSubs || this.isInactiveSubs) && this.isLoggedinCustomer && this.plan.subscription) {
          window.location.href = '/account/#/shipments';
        } else if (this.isLoggedinCustomer && !this.isInactiveSubs && !this.isActiveSubs && !this.plan.subscription) {
          this.$emit('selected', this.plan)
          this.hidePromoBar() 
        } else if (!this.plan.subscription && this.isActiveSubs){
          window.location.href = '/account/#/shipments';              
        } else if (!this.plan.subscription){
          // window.location.href = '/account/register'
          this.$emit('selected', this.plan)
          this.hidePromoBar()
        } else {
          this.$emit('selected', this.plan)
          this.hidePromoBar()
        }     
      },
      hidePromoBar() {
        const $promoBar = document.querySelector('.c-header');
        if (!$promoBar) return;
        $promoBar.style.display = 'none';
      }      
    },
    watch: {
      CTAtext() {
        this.checkingEmail = false;
      }
    }
  };
</script>

<style lang="scss">
  
</style>

<docs>
  ```jsx
  <div class="u-bgIvory pa4">
    <section class="c-plansGrid">
      <cPlan
        title="A La Carte"
      />
      <cPlan
        title="6"
      />
    </section>
  </div>
  ```
</docs>
