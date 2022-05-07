<template>
  <section class="l-hero">
    <c-title-highlight
      ecru-text="potg"
      black-text="rewards"
    />
    <div v-if="hasLoggin" class="l-hero__content">
      <div class="l-hero__text">
        Member Tier: <strong data-lion-membership></strong><br/>
        Points: <strong><span data-lion-points="approved">0</span></strong>
      </div>
      <div class="l-hero__buttons">
        <a
          href="#earn-points"
          class="l-hero__buttons--item"
          data-scroll-links
        >
          Earn Points
        </a>
        <a
          href="#rewards"
          class="l-hero__buttons--item l-hero__buttons--primary"
          data-scroll-links
        >
          Redeem Rewards
        </a>
      </div>
    </div>
    <div v-else class="l-hero__content">
      <p class="l-hero__text">
        {{ subtext }}
      </p>
      <div class="l-hero__buttons">
        <a
          href="/account/login"
          class="l-hero__buttons--item"
        >
          Login
        </a>
        <a
          href="/account/register"
          class="l-hero__buttons--item l-hero__buttons--primary"
        >
          Join Now
        </a>
      </div>
    </div>
  </section>
</template>

<script>
import cTitleHighlight from './cTitleHighlight.vue'

export default {
  components: {
    cTitleHighlight
  },
  props: {
    hasLoggin: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      subtext: window.Scoutside.rewards.heroRewards.content.subtext_logged_out
    }
  }
}
</script>

<style lang="scss" scoped>
.l-hero {
  &__text {
    text-align: center;
    margin-bottom: 2rem;

    @include media-tablet-up {
      font-size: 1.2rem;
    }
  }

  &__buttons {
    @include flex($direction: column);
    width: 80%;
    margin: 0 auto;

    @include media-tablet-up {
      flex-direction: row;
      justify-content: space-between;
      width: 60%;
    }

    &--item {
      @include flex($justify: center);
      border: 1px solid $color-black;
      width: 100%;
      padding: 1.2rem 0;
      margin-bottom: 1rem;
      font-weight: 500;

      @include media-tablet-up {
        width: 46%;
      }
    }

    &--primary {
      border: none;
      background-color: $color-primary;
    }
  }

  @include media-tablet-up {
    &__content {
      width: 50%;
      margin: auto;
    }
  }
}
</style>