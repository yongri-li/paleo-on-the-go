<template>
  <div>
    <nav v-if="!account" class="c-stepNav u-hideMobile">
      <div class="o-container">
        <div class="c-stepNav__grid">
          <div>
            <a href="/">
              <cIcon icon="logo" />
            </a>
          </div>
          <ul class="c-stepNav__list">
            <li v-for="(link, index) in navigation.links" class="c-stepNav__list-item"
              :key="index"
            >
              <div
                :class="['c-step', {
                  'c-step--active': link.url === $route.path,
                  'c-step--completed': checkStepCompleted(link.url)
                }]"
                @click="$router.push(link.url)"
              >
                <span class="c-step__index">
                  {{ index + 1 }}
                  <c-icon icon="checkmark" />
                </span>
                <span class="c-step__name">{{ link.title }}</span>
              </div>
            </li>
            <li class="c-stepNav__list-item">
              <div class="c-step">
                <span class="c-step__index">{{ navigation.links.length + 1 }}</span>
                <span class="c-step__name">Checkout</span>
              </div>
            </li>
          </ul>
          <div></div>
        </div>
      </div>
    </nav>
    <nav :class="['c-mobileNav', {
      'u-hideDesktop': !account
    }]">
      <div class="o-container">
        <button v-if="prevStep || account" class="c-mobileNav__back u-btnUnset" @click="handlePrevStep">
          <cIcon icon="chevron" />
        </button>
        <button v-if="!prevStep && !account" class="go--back" @click="goBack">
          <cIcon icon="chevron" />
        </button>        
        {{ currentStepTitle }}
      </div>
    </nav>
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex';
  import cIcon from '@shared/components/core/cIcon.vue';

  export default {
    name: "cBundleNav",
    props: {
      currentStepTitle: {
        type: String
      }
    },
    computed: {
      ...mapState([
        'navigation',
        'assets',
        'routes',
        'account',
        'activeStep'
      ]),
      prevStep() {
        const currentRouteIndex = this.routes.findIndex(route => route.path === this.$route.path);
        return this.routes[currentRouteIndex - 1];
      }
    },
    methods: {
      ...mapMutations(['BUNDLE_CHANGE_ACTIVE_STEP']),
      checkStepCompleted(path) {
        const routeIndex = this.routes.findIndex(route => route.path === path);
        const currentRouteIndex = this.routes.findIndex(route => route.path === this.$route.path);
        return routeIndex < currentRouteIndex ? true : false;
      },
      handlePrevStep() {
        if (!this.account) {
          const $promoBar = document.querySelector('.c-header');

          this.$router.push(this.prevStep.path);

          if (!$promoBar) return;

          if (this.$route.path === '/') {
            $promoBar.style.display = '';
          } else if (this.$route.path === '/add-ons') {
            $promoBar.style.display = 'none';
          }

          return;
        }
        if (this.activeStep > 0) {
          this.BUNDLE_CHANGE_ACTIVE_STEP([null, 'dec']);
        } else {
          const event = new CustomEvent('closeBundleDrawer');
          document.dispatchEvent(event);
        }
      },
      goBack() {        
        // window.history.back()   
        const currentPage = window.location.href
        const lastPage = document.referrer
        currentPage.includes('#/') ? window.location = '/' : window.history.back()  
      }      
    },
    components: {
      cIcon
    }
  }
</script>

<style>

  button.go--back {
    background: none;
    border: none;
    position: absolute;
    left: 0.875rem;
  }
  
</style>


