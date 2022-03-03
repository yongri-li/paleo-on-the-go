<template>
  <div>
    <c-bundle-nav currentStepTitle="Select Your Plan"/>
    <section class="c-plansOverview">
      <div class="o-container u-textCenter">
        <h2 class="c-plansOverview__title c-h2 u-hideMobile">{{ plans.content.title }}</h2>
        <div class="c-plansOverview__text" v-html="plans.content.text"></div>
        <div class="c-plansGrid">
          <div class="c-plansGrid__one-times">
            <c-plan
              v-for="(plan, index) in oneTimePlans"
              :key="index"
              :plan="plan"
              @selected="handlePlanSelected"
            />
          </div>
          <div class="u-relative">
            <div class="c-plansGrid__subs-title">
              Subscribe &amp; Save
            </div>
            <div class="c-plansGrid__subs">
              <c-plan
                v-for="(plan, index) in subscriptionPlans"
                :key="index"
                :plan="plan"
                @selected="handlePlanSelected"
              />
            </div>
          </div>
        </div>
        <div class="c-plansOverview__note">
          <span class="c-note">
            Shipping Added at Checkout
          </span>
        </div>
      </div>
    </section>
    <section class="c-faqsSection">
      <div class="o-container">
        <h2 class="c-faqsSection__title c-h2 u-textCenter">{{ faqsSection.content.title }}</h2>
        <c-faq v-for="(faq, index) in faqsSection.faqs"
          :title="faq.title"
          :text="faq.text"
          :open="openFaqIndex === index"
          :index="index"
          :key="index"
          @toggled="handleFaqToggle"
        />
      </div>
    </section>
  </div>
</template>


<script>
  import { mapMutations, mapState, mapGetters } from 'vuex';
  import cPlan from '../parts/cPlan.vue';
  import cBundleNav from '../parts/cBundleNav.vue';
  import cFaq from '@shared/components/core/cFaq.vue';

  export default {
    name: 'Plans',
    data() {
      return {
        openFaqIndex: 0
      }
    },
    computed: {
      ...mapState([
        'faqsSection',
        'plans',
        'navigation',
        'bundle',
        'inactiveSubscriber'
      ]),     
      oneTimePlans() {
        return this.plans.products.filter(product => !product.subscription);
      },
      subscriptionPlans() {
        return this.plans.products.filter(product => product.subscription);
      },
      getUserZip() {
        return sessionStorage.getItem('userZipCode');
      },
      selPlan() {
        return sessionStorage.getItem('selected_plan');
      },  
      fromPDP() {
        return sessionStorage.getItem('from_pdp');
      },
      fromHome() {
        return sessionStorage.getItem('from_home');
      },      
      existingCustomertoALaCarte() {
        return sessionStorage.getItem('customer_to_alacarte');
      },  
      fromGetStarted() {
        return document.referrer.includes('/get-started') 
      },
      isPlansPage() {
        return window.location.href.includes('/meals')
      },
      isLoggedInCustomer() {
        return customer.email && customer.shopify_id ? true : false; 
      },
      isInactiveSubs(){
        return customer.tags.includes('Inactive')
      },
      isActiveSubs(){
        return customer.tags.includes('Active Subscriber')
      }      
    },
    methods: {
      ...mapMutations([
        'BUNDLE_SELECT_PLAN',
        'BUNDLE_SET_INACTIVE_SUBS',
        'BUNDLE_SET_EXISTING_CUSTOMER'
      ]),
      async handlePlanSelected(plan) {
        console.log('1', plan)
        await sessionStorage.setItem('selected_plan', JSON.stringify(plan));
        console.log('2', plan)
        if (this.getUserZip || this.isLoggedInCustomer && !this.isInactiveSubs && !this.isActiveSubs) {
          this.BUNDLE_SELECT_PLAN(plan);          
          //this.bundle.children = []; - this clears the selected meals
          this.$router.push(this.navigation.links[1].url);
        }
        else {
          window.location.href = '/pages/get-started/'
          // fix this tomorrow with other flows
          // this.BUNDLE_SELECT_PLAN(plan);          
          // this.$router.push(this.navigation.links[1].url);
        }
      },
      handleFaqToggle(index) {
        this.openFaqIndex = index;
      },
      moveBundleNavtoPlans(selectedPlan) {
        const planJson = JSON.parse(selectedPlan)
        this.BUNDLE_SELECT_PLAN(planJson)
        this.$router.push(this.navigation.links[1].url)
      },
      async setCartFromRCcheckout(){
        const getPlanStr   = localStorage.getItem('ls_selected_plan')
        const getBundleStr = localStorage.getItem('ls_bundle_content')
        const getAddOnsStr = localStorage.getItem('ls_addOns')
        const userPlan     = JSON.parse(getPlanStr)
        const userBundle   = JSON.parse(getBundleStr)
        const userAddOns   = JSON.parse(getAddOnsStr) 

        this.BUNDLE_SELECT_PLAN(userPlan)      
        this.bundle.children = userBundle 
        this.bundle.addOns = userAddOns

        localStorage.removeItem('rc_checkout')
        localStorage.removeItem('ls_selected_plan')
        localStorage.removeItem('ls_bundle_content')
        localStorage.removeItem('ls_addOns')

        this.$router.push(this.navigation.links[3].url)  
      }   
    },
    mounted() {
      const isActiveSubNotLoggedIn = sessionStorage.getItem('is_active_subscriber') === "true" && !this.isActiveSubs
      ? true
      : false;

      if(localStorage.getItem('rc_checkout') === 'true') this.setCartFromRCcheckout();
      if(!isActiveSubNotLoggedIn) {
        if (this.selPlan && this.fromPDP || this.selPlan && this.existingCustomertoALaCarte || this.selPlan && this.fromHome) {
          this.moveBundleNavtoPlans(this.selPlan)
          sessionStorage.setItem('from_pdp', '')
          sessionStorage.removeItem('from_home')      
        } 
      }
      if (this.selPlan && this.fromGetStarted) {  
        const getFromGetStarted = sessionStorage.getItem('hit_meal_page')          
        setTimeout(()=>{
          if (!getFromGetStarted) {
            this.moveBundleNavtoPlans(this.selPlan)
            sessionStorage.setItem('from_pdp', '')         
          }
          else {
            sessionStorage.removeItem('hit_meal_page')
          }
        }, 125)
      }   
      if(this.isLoggedInCustomer) this.BUNDLE_SET_EXISTING_CUSTOMER(true)
      //if(this.isInactiveSubs) this.BUNDLE_SET_INACTIVE_SUBS(true)
    },
    components: {
      cFaq,
      cPlan,
      cBundleNav
    }
  }
</script>