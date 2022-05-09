<template>
  <section>
    <c-title-highlight
      ecru-text="earn"
      black-text="points"
    />
    <div data-lion-rules-list></div>
  </section>
</template>

<script>
import cTitleHighlight from './cTitleHighlight.vue'

export default {
  components: {
    cTitleHighlight
  }
}
</script>

<style lang="scss">

.lion-rule-item {

  @include media-tablet-up {
    width: 25%;
  }

  &__content {
    background-color: $color-ecru;
    position: relative;
  }

  &__title {
    font-family: $font-heading;
    text-transform: uppercase;
    margin: 1rem 0;
    font-size: 1.7rem;

    @include media-tablet-up {
      font-size: 1.5rem;
    }
  }

  &__points {
    font-family: $font-body;
    text-transform: capitalize;

    .text, .value {
      color: $color-black;
      margin: 0;
      font-weight: 600;
      font-size: 1.3rem;
    }
  }

  .lion-rule-item__icon {
    margin-top: 1rem;
    width: 60px;
    height: 60px;
  }

  .lion-icon {
    &__rule--purchase {
      background-image: url('https://cdn.shopify.com/s/files/1/0088/3163/1415/files/icon-make-a-purchase_256x256_crop_center.png');
    }
    &__rule--signup {
      background-image: url('https://cdn.shopify.com/s/files/1/0088/3163/1415/files/icon-create-an-account_256x256_crop_center.png');
    }
    &__rule--pageview {
      background-image: url('https://cdn.shopify.com/s/files/1/0088/3163/1415/files/icon-visit_256x256_crop_center.png');
    }
    &__rule--instagram-follow {
      background-image: url('https://cdn.shopify.com/s/files/1/0088/3163/1415/files/icon-follow-instagram_256x256_crop_center.png');
    }
    &__rule--twitter-follow {
      background-image: url('https://cdn.shopify.com/s/files/1/0088/3163/1415/files/icon-follow-twitter_256x256_crop_center.png');
    }
    &__rule--facebook-like {
      background-image: url('https://cdn.shopify.com/s/files/1/0088/3163/1415/files/icon-like-us-facebook_256x256_crop_center.png');
    }
    &__rule--birthday {
      background-image: url('https://cdn.shopify.com/s/files/1/0088/3163/1415/files/icon-happy-birthday_256x256_crop_center.png');
    }
    &__rule--referral {
      background-image: url('https://cdn.shopify.com/s/files/1/0088/3163/1415/files/icon-refer_256x256_crop_center.png');
    }
  }

  &--authenticated {
    .lion-action-button {
      position: absolute;
      bottom: 15px;
      left: 5%;
      width: 90%;
      height: 60px;
      background-color: transparent;
      font-size: 0;
      // border: 1px solid red;
    }
    .lion-rule-item {
      &__points {
        background-color: $color-primary;
        height: 60px;
        width: 95%;
        padding: 0;
        @include flex($justify: center);
      }
    }
  }
}

.lion-rule-item__completed-forever {
  position: absolute;
  bottom: 15px;
  left: 5%;
  width: 90%;
  height: 60px;
  background-color: $color-white;
  border: 1px solid $color-black;
  font-size: 1rem;
  @include flex($justify: center);

  &::before {
    content: '✓';
    color: $color-white;
    background-color: $color-black;
    width: 25px;
    height: 25px;
    border-radius: 100%;
    margin-right: 0.5rem;
    @include flex($justify: center);
  }

  &::after {
    content: 'Completed';
    font-family: $font-body !important;
    font-weight: 600;
    line-height: initial;
    color: $color-black;
  }
}
</style>