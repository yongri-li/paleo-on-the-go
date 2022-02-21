<template>
  <section class="o-container">
    <div v-if="!reactivated" class="c-ctaBlock u-textCenter c-shipmentsBox mg-top__md">
      <h2 class="c-ctaBlock__heading c-h2">
         Hang Tight
      </h2>
      <p>
        We're cooking up something good. Please check back in later.
      </p>
    </div>
  </section>
</template>

<script>
  export default {
    data: () => ({
      //
    }),
    computed: {
      //
    },
    methods: {
      //
    }
  }
</script>

<style lang="scss">
  .o-container {
    .mg-top__md {
      margin-top: 3rem;
    }
  }
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
    margin-bottom: 1rem;
    @include media-desktop-up {
      font-size: 34px;
    }
  }
  .c-ctaBlock__cta {
    width: 260px;
    max-width: 100%;
    margin: 1.5rem auto;

    .c-loading__wheel {
      border-style: inset;
    }
  }
</style>