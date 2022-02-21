<template>
  <div class="c-promoBlock">
    <div class="c-promoBlock__imageWrapper">
      <img class="c-promoBlock__image" :src="content.subscription_promo_image" />
    </div>
    <div class="c-promoBlock__content u-textCenter">
      <div>

<!--         <div class="c-promoBlock__smallHeading u-hideMobile">
          {{ content.subscription_promo_small_heading }}
        </div>
        <h3 class="c-promoBlock__heading c-h3">
          {{ content.subscription_promo_heading }}
        </h3>
        <div class="c-promoBlock__text">
          {{ content.subscription_promo_text }}
        </div>
        <button class="c-promoBlock__cta c-cta">
          {{ content.subscription_promo_start_text }}
        </button>
        <div class="c-promoBlock__text">
          Shipping to: <span class="u-colorBroccoli">17A Princess St.</span>
        </div>
        <div class="c-promoBlock__disclaimer">
          {{ content.subscription_promo_disclaimer }}
        </div> -->


<!--     <div class="c-stackedText__text">
      <h3 class="c-promoBlock__heading c-h3">
        {{ content.start_new_order_heading }}
      </h3>
      <div class="c-promoBlock__text">
        {{ content.start_new_order_text }}
      </div>
      <a class="c-promoBlock__cta c-cta" :href="content.start_new_order_cta_url">
        {{ content.start_new_order_cta_text }}
      </a>
    </div> -->

        <h3 class="c-promoBlock__heading c-h3">
          {{ content.start_new_order_heading }}
        </h3>
  <!--       <h3 class="c-promoBlock__heading c-h3">
          {{ content.subscription_promo_heading }}
        </h3> -->
        <div class="c-promoBlock__text">
          {{ content.subscription_promo_text }}
        </div>
        <button @click="goToPlansPage" class="c-promoBlock__cta c-cta">
          {{ content.subscription_promo_start_text }}
        </button>
<!--         <div class="c-promoBlock__text">
          <p>Shipping to: <span class="u-colorBroccoli">
          </span></p>
        </div> -->
        <div class="c-promoBlock__disclaimer">
          {{ content.subscription_promo_disclaimer }}
        </div>
        <a :href="content.subscription_link_url" class="u-underLine u-colorBroccoli">
          {{ content.subscription_link_text }}
        </a>     
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    content: {
      type: Object,
      required: true
    },
    billing: {
      type: Object,
      required: true
    }    
  },
  methods: {
    goToPlansPage() {
      window.location.href = "/collections/all/"
    }
  }
}
</script>

<style lang="scss">
  .c-promoBlock {
    display: grid;
    grid-gap: 17px;
    background-color: $color-ecru;
    border: 1px solid $color-paleo;
    border-radius: 12px;
    padding: 20px;
    margin-top: 3rem;
    @include media-desktop-up {
      grid-template-columns: 1fr 1fr;
      grid-column-gap: 50px;
    }
  }
  .c-promoBlock__imageWrapper {
    line-height: 0;
  }
  .c-promoBlock__image {
    width: 100%;
    border-radius: 12px;
  }
  .c-promoBlock__content {
    @include media-desktop-up {
      display: flex;
      align-items: center;
      padding: 2rem;
    }
    .u-colorBroccoli {
      font-weight: 600;
    }    
    p, a {
      display: block;
      font-size: 16px;
    }
    a {
      margin-top: 0.75rem;
    }

  }
  .c-promoBlock__smallHeading {
    color: $color-broccoli;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 0.06em;
    margin-bottom: 12px;
  }
  .c-promoBlock__heading {
    font-size: 22px;
    @include media-desktop-up {
      font-size: 26px;
    }
  }
  .c-promoBlock__cta {
    width: 262px;
    margin: 0 auto 18px;
    @include media-desktop-up {
      width: 330px;
    }
  }
  .c-promoBlock__text {
    font-size: 15px;
    line-height: 1.5;
    margin-bottom: 17px;
    @include media-desktop-up {
      font-size: 18px;
      margin-bottom: 1rem;
    }
  }
  .c-promoBlock__disclaimer {
/*    color: $color-grey;*/
    border-top: 1px solid #e2dfd7;
    font-size: 14px;    
    line-height: 1.5;
    padding-top: 1rem;    
  }
</style>