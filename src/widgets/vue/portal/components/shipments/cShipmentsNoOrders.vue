<template>
  <section>
  <div class="c-ctaBlock u-textCenter">
    <div class="c-ctaBlock__smallHeading">
      {{ content.no_orders_small_heading }}
    </div>
    <h2 class="c-ctaBlock__heading c-h2">
      {{ content.no_orders_heading }}
    </h2>
    <button class="c-ctaBlock__cta c-cta" 
      @click="sendToALaCarteFunnel"      
    >
      {{ content.no_orders_cta_text }}
    </button>
  </div>

<!-- 
    <div class="c-stackedText__text">
      <h3 class="c-promoBlock__heading c-h3">
        {{ ordercontent.start_new_order_heading }}
      </h3>
      <div class="c-promoBlock__text">
        {{ ordercontent.start_new_order_text }}
      </div>
      <a class="c-promoBlock__cta c-cta" :href="ordercontent.start_new_order_cta_url">
        {{ ordercontent.start_new_order_cta_text }}
      </a>
    </div> -->

      <div>
        <h3 class="c-promoBlock__heading c-h3">
          {{ ordercontent.subscription_promo_heading }}
        </h3>
        <div class="c-promoBlock__text">
          {{ ordercontent.subscription_promo_text }}
        </div>
        <button @click="goToPlansPage" class="c-promoBlock__cta c-cta">
          {{ ordercontent.subscription_promo_start_text }}
        </button>
<!--         <div class="c-promoBlock__text">
          <p>Shipping to: 
            <span class="u-colorBroccoli"></span>
          </p>
        </div> -->
        <div class="c-promoBlock__disclaimer">
          {{ ordercontent.subscription_promo_disclaimer }}
        </div>
        <a :href="ordercontent.subscription_link_url" class="u-underLine u-colorBroccoli">
          {{ ordercontent.start_new_order_cta_url }}
        </a>           
<!--         <a :href="ordercontent.subscription_link_url" class="u-underLine u-colorBroccoli">
          {{ ordercontent.subscription_link_text }}
        </a>    -->  
      </div>
  </section>
</template>


<script>
  import { mapGetters, mapMutations } from 'vuex';
  export default {
    props: {
      content: {
        type: Object,
        required: true
      },
      ordercontent: {
        type: Object,
        required: true
      }
    },
    computed: {
      ...mapGetters('customer', [
        'customerRecharge'
      ])
    },
    methods: {
      ...mapMutations([
        'BUNDLE_SELECT_PLAN'
      ]),
      sendToALaCarteFunnel(){
        if (this.customerRecharge) {
          sessionStorage.setItem('selected_plan', "{\"title\":\"A La Carte\",\"price\":\"1299\",\"text\":\"Min. 8 Meals per Order\",\"minimum\":8}");
          sessionStorage.setItem('customer_to_alacarte', true)
          window.location.href = '/collections/all#/plans';
        } else {
          window.location.href = this.content.no_orders_cta_url;
        }
      }
    }
  }
</script>

<style lang="scss">
  .c-ctaBlock {
    padding: 80px 0;
  }
  .c-ctaBlock__smallHeading {
    text-transform: uppercase;
    font-size: 15px;
    font-weight: 600;
    color: $color-broccoli;
    margin-bottom: 10px;
    @include media-desktop-up {
      margin-bottom: 13px;
    }
  }
  .c-ctaBlock__heading {
    font-size: 26px;
    margin-bottom: 24px;
    @include media-desktop-up {
      font-size: 34px;
    }
  }
  .c-ctaBlock__cta {
    width: 258px;
    max-width: 100%;
    margin: 0 auto;
  }
</style>