<template>
  <article class="c-homeFaqs vueComp__portal">
    <h2 class="c-h1"><span class="u-highlightText--secondary">Common</span> Questions</h2>
    <section v-for="(faq, index) in content" class="c-homeFaqs__item" ref="faqItem">
      <button>
        {{ faq.box_question }}
        <c-svg class="icon-opened" name="minusIcon" />
        <c-svg class="icon-closed" name="plusIcon" />
      </button>
      <div class="panel-answer">
        <p>{{ faq.box_answer }}</p>
      </div>
    </section>
  </article>
</template>

<script>
import cSvg from '@shared/components/core/cSvg.vue'

export default {
  props: {
    content: {
      type: Array,
      default: () => []
    }
  },
  components: { cSvg },
  methods: {
    accordionOpenClose() {
      const faqItems = this.$refs.faqItem
      faqItems.forEach(item => {
        item.addEventListener('click', function (e) {
          const panel = this.children[1]
          this.classList.toggle('active')

          panel.style.maxHeight
            ? (panel.style.maxHeight = null)
            : (panel.style.maxHeight = panel.scrollHeight + 'px')
        })
      })
    }
  },
  mounted() {
    this.accordionOpenClose()
  }
}
</script>

<style lang="scss">
.vueComp__portal {
  max-width: 1240px;
  padding: 5rem 1rem;
  margin: 0 auto;

  @include media-desktop-up {
    padding: 3rem 0 5rem;
  }

  .c-homeFaqs__item {
    width: 100%;

    button {
      background-color: transparent;
    }

    .panel-answer {
      background-color: transparent;
      padding-left: 1rem;
    }
  }

  .active .icon-closed,
  .icon-opened {
    display: none;
  }

  .active .icon-opened {
    display: block;
  }
}
</style>
