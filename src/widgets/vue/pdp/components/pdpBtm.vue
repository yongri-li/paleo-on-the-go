<template>
  <div class="pdp__faq--wrap">
    <c-faqAccordion v-if="product_faq" :faqs="product_faq" :title="faqTitle" />
    <c-bottomHero :content="content[0]" />
    <!--     <c-BottomBanner :content="content[1]" /> -->
  </div>
</template>

<script>
import cFaqAccordion from '@shared/components/core/cFaqAccordion.vue'
import cBottomHero from '@shared/components/core/cBottomHero.vue'
// import cBottomBanner from '@shared/components/core/cBottomBanner.vue'

export default {
  data: () => ({
    ...window.Scoutside.pdp
  }),
  components: {
    cFaqAccordion,
    cBottomHero
    // cBottomBanner
  },
  computed: {
    content() {
      const getContent = label => {
        let obj = {}
        Object.entries(this.$data).map(([key, val]) => {
          if (key.startsWith(label)) {
            const name = key.replace(label, '')
            obj[name] = val
          }
        })
        return obj
      }
      const hero = getContent('btm_')
      const banner = getContent('banner_')
      return [hero, banner]
    },
    faqTitle() {
      const titleArr = this.content[0].faq_title.split(' ')
      const firstWord = titleArr.shift()
      const rest = titleArr.join(' ')
      return [firstWord, rest]
    }
  }
}
</script>

<style lang="scss">
.pdp__faq--wrap {
  position: relative;

  @include media-mobile-down {
    .c-homeFaq {
      padding: 0 1rem;
    }
  }
}
</style>
