<template>
  <div class="c-bundleFlow u-bgSpringWood">
    <c-shipmentsLoading class="c-shipments__loading"
      v-if="!ready"
    />
    <router-view v-if="!account"
      :key="$route.name"
    />
    <c-drawer v-else
      side="right"
      :show="open"
      :modifiers="['isFullWidth']"
      :closable="false"
      @click="open = false"
    >
      <div class="u-bgSpringWood">
        <cMeals v-if="activeStep === 0" />
        <cAddOns v-if="activeStep === 1" />
        <cReview v-if="activeStep === 2" />
      </div>
    </c-drawer>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import cShipmentsLoading from '@vue/portal/components/shipments/cShipmentsLoading.vue';
import cDrawer from '@shared/components/core/cDrawer.vue';
import cMeals from './steps/cMeals.vue';
import cReview from './steps/cReview.vue';
import cAddOns from './steps/cAddOns.vue';

export default {
  name: 'Bundle',
  data() {
    return {
      open: false,
      ready: false
    }
  },
  computed: {
    ...mapState([
      'account',
      'plans',
      'selectedPlan',
      'navigation',
      'activeStep',
      'bundle'
    ]),
    ...mapGetters(['allProducts', 'allAddOns']),
    subscriptionPlans() {
      return this.plans.products.filter(product => product.subscription);
    },
    customerObj() {
      return customer
    }
  },
  methods: {
    ...mapMutations([
      'BUNDLE_SET_ROUTES',
      'BUNDLE_SELECT_PLAN',
      'BUNDLE_SET_SELECTED',
      'BUNDLE_SET_CUSTOMER',
      'BUNDLE_CHANGE_ACTIVE_STEP',
      'BUNDLE_ADD_CHILD',
      'BUNDLE_SET_INACTIVE_SUBSCRIBER',
      'BUNDLE_SET_ISSUBSCRIBER'
    ]),
    ...mapActions([
      'searchCustomer'
    ]),
    async checkForShopifyUser() {
      let email

      if (this.customerObj?.email) {
        email = this.customerObj.email
      } else {
        // if no user email exists in session, bail
        email = sessionStorage.getItem('userEmail')
        if (!email) {
          sessionStorage.removeItem('is_active_subscriber')
          sessionStorage.removeItem('shopify_user__no_recharge')
          return
        }
      }

      // // if no user email exists in session, bail
      // const email = sessionStorage.getItem('userEmail')
      // if (!email) {
      //   return
      // }

      // subscribe users to klaviyo email list
      const appRequest = await fetch('https://fmp-app-production.herokuapp.com/email-subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-fmp-key': window.Scoutside.api.fmp_app_key
        },
        body: JSON.stringify({ email })
      });

      // call action to check for customer using email in session storage
      const {customers, error} = await this.searchCustomer({email})
      console.log('customer info', customers)

      // if req error, bail
      if (error) {
        console.error(error)
        sessionStorage.removeItem('shopify_user__no_recharge')
        return
      }
      // if no customer exists, bail
      if (!customers || !customers.length) {
        sessionStorage.removeItem('is_active_subscriber')
        sessionStorage.removeItem('shopify_user__no_recharge')
        return
      }
      // Set customer to first item
      const customer = customers.find(user => user.email === email)
      // if customer has subscription
      if (customer.tags && customer.tags.toLowerCase().includes('subscriber')) {
        // if customer subscription is active
        this.BUNDLE_SET_ISSUBSCRIBER(true)
        if (customer.tags.includes('Active Subscriber')) {
          // redirect to login form
          // window.location.href = '/account/#/details'
          sessionStorage.setItem('is_active_subscriber', true)
          sessionStorage.removeItem('shopify_user__no_recharge')
        } else {
          this.BUNDLE_CHANGE_ACTIVE_STEP([0])
          this.BUNDLE_SET_INACTIVE_SUBSCRIBER(true)
          sessionStorage.removeItem('is_active_subscriber')
          sessionStorage.removeItem('shopify_user__no_recharge')
        }
      } else {
        sessionStorage.removeItem('is_active_subscriber')
        console.log('asdx', customer.state)
        if(customer.state === "enabled") sessionStorage.setItem('shopify_user__no_recharge', true)        
      }
    },
  },
  mounted() {
    //this.checkForShopifyUser()
    if (!this.account) {
      this.checkForShopifyUser()

      const selectedPlan = sessionStorage.getItem('selected_plan');
      if(selectedPlan){
        const { title: planSize } = JSON.parse(sessionStorage.getItem('selected_plan'));
        const planSizeNumber = Number(planSize.split(' ')[0]);
        const planObj = this.plans.products.find(plan => plan.minimum === planSizeNumber);

        if (planObj) this.BUNDLE_SELECT_PLAN(planObj);
      }

      this.BUNDLE_SET_ROUTES(this.$router.options.routes);

      if (this.bundle.children.length === 0) {
        const bundleContent = JSON.parse(sessionStorage.getItem('bundle_content'));

        if(bundleContent) {
          bundleContent.forEach((content) => {
            this.BUNDLE_ADD_CHILD(content);
          });
        }
      }
    }

    document.addEventListener('openBundleDrawer', async (e) => {
      const { children, addOns, activeStep, customer } = e.detail;
      const totalChildren = children.reduce((accumulator, child) => accumulator + child.quantity, 0);
      const plans = this.plans.products;
      const selectedChildren = [];
      const selectedAddOns = [];
      let planTier = null;

      document.getElementsByTagName('body')[0].classList.add('o-body--noScroll');

      this.open = true;

      for (let i = 0; i < plans.length; i++) {
        if (plans[i + 1]) {
          if (totalChildren >= plans[i].minimum && totalChildren < plans[i + 1].minimum) {
            planTier = plans[i];
            break;
          }
        } else {
          planTier = plans[i];
        }
      }

      children.forEach(orderChild => {
        const shopifyChild = this.allProducts.find(child => child.id === Number(orderChild.productId));

        if (shopifyChild) {
          shopifyChild.quantity = orderChild.quantity;

          if (orderChild.variantId !== shopifyChild.variants[0].id) {
            shopifyChild.upsellId = Number(orderChild.variantId);
          }

          selectedChildren.push(shopifyChild)
        }
      });

      addOns.forEach(orderChildAddOn => {
        const shopifyChildAddOn = this.allAddOns.find(child => child.id === Number(orderChildAddOn.productId));
        shopifyChildAddOn.quantity = orderChildAddOn.quantity;
        selectedAddOns.push(shopifyChildAddOn)
      });      

      this.BUNDLE_SELECT_PLAN(planTier);
      this.BUNDLE_SET_SELECTED({
        addOns: selectedAddOns,
        children: selectedChildren
      });

      this.BUNDLE_SET_CUSTOMER(customer);

      if (activeStep) {
        this.BUNDLE_CHANGE_ACTIVE_STEP([activeStep])
      }

      this.open = true;
    });
    document.addEventListener('closeBundleDrawer', () => {
      document.getElementsByTagName('body')[0].classList.remove('o-body--noScroll');
      this.BUNDLE_CHANGE_ACTIVE_STEP([0])
      this.open = false;
    })
  },
  created(){
    this.ready = true;
  },
  components: {
    cDrawer,
    cMeals,
    cAddOns,
    cReview,
    cShipmentsLoading
  }
}
</script>

<style>
  .c-drawer--onRight .c-basketPage.c-addOnsStep > div:first-child {
    position: sticky;
    top: 0;
    z-index: 11;
  }
</style>
