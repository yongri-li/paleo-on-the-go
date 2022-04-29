<template>
  <article class="c-homeFaqs vueComp__portal">
    <h2 class="c-h1">
      <span class="u-highlightText--secondary">
        {{ title.first }}
      </span>
      {{ title.second }}
    </h2>
    <div class="c-homeFaqs__content">
      <section
        v-for="(item, index) in content"
        :key="index"
        class="c-homeFaqs__item"
        ref="faqItem"
      >
        <button class="c-homeFaqs__item-question">
          {{ item.title }}
          <div class="c-homeFaqs__item-icon">
            <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M1.15976 1.14645C0.946747 1.34171 0.946747 1.65829 1.15976 1.85355L6.61431 6.85355C6.82732 7.04881 7.17268 7.04881 7.38569 6.85355L12.8402 1.85355C13.0533 1.65829 13.0533 1.34171 12.8402 1.14645C12.6272 0.951185 12.2819 0.951185 12.0689 1.14645L7 5.79289L1.93115 1.14645C1.71814 0.951185 1.37277 0.951184 1.15976 1.14645Z" fill="#231F20" stroke="#231F20" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </button>
        <div class="panel-answer">
          <div class="panel-answer__block">
            <img :src="item.img_1" :alt="item.text_1" />
            <a class="panel-answer__block-link" :href="item.link_1">
              {{ item.text_1 }}
            </a>
          </div>
          <div class="panel-answer__block">
            <img :src="item.img_2" :alt="item.text_2" />
            <a class="panel-answer__block-link" :href="item.link_2">
              {{ item.text_2 }}
            </a>
          </div>
        </div>
      </section>
    </div>
  </article>
</template>

<script>
export default {
  props: {
    content: {
      type: Array,
      default: () => []
    },
    title: {
      type: Object,
      default: () => {
        return {
          first: 'Our',
          second: 'Providers'
        }
      }
    }
  },
  methods: {
    accordionOpenClose() {
      const clickEvent = new MouseEvent('click', { shiftKey: true })

      const faqItems = this.$refs.faqItem
      faqItems.forEach(item => {
        item.addEventListener('click', function (e) {

          const panel = this.children[1]
          panel.style.maxHeight
            ? (panel.style.maxHeight = null)
            : (panel.style.maxHeight = panel.scrollHeight + 'px')


          const itemActive = document.querySelector('.c-homeFaqs__item.active')
          console.log('itemActive',itemActive)
          console.log('this',this)
          if(this != itemActive && itemActive) {
            itemActive.dispatchEvent(clickEvent)
            // this.classList.add('active')
          }
          else {
            this.classList.toggle('active')
          }

        })
      })

      faqItems[0].dispatchEvent(clickEvent)
    }
  },
  mounted() {
    this.accordionOpenClose()
  }
}
</script>

<style lang="scss" scoped>
.vueComp__portal {
  max-width: 1500px;
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
    &-icon {
      background-color: #EFEDE6;
      width: 30px;
      height: 30px;
      border-radius: 100%;
      margin-right: 10px;
      @include flex($justify: center);
      transition: all .4s;

      svg {
        width: 50%;
        height: auto;
      }

    }

    .panel-answer {
      background-color: transparent;
      padding-left: 0;

      &__block {
        margin-bottom: 2rem;

        &-link {
          font-weight: 500;
          font-size: 1.3rem;
          text-decoration: underline;
          text-transform: capitalize;
          margin-top: 1rem;
          cursor: pointer;
        }
      }
    }
  }

  .c-homeFaqs__item.active {
    .c-homeFaqs__item-icon {
      transform: rotate(180deg);
    }
  }

  .active .icon-closed,
  .icon-opened {
    display: none;
  }

  .active .icon-opened {
    display: block;
  }

  @include media-tablet-up {
    .c-homeFaqs{
      &__content {
        position: relative;
        height: 750px;
      }
      &__item {
        width: 30%;
        margin-left: 0;

        &-icon {
          display: none;
        }
        &-question {
          padding: 1.25rem;
          font-size: 2.5rem;
        }

        .panel-answer {
          // height: 0;
          // max-height: 0;
          position: absolute;
          right: 0;
          top: 0;
          @include flex($justify: space-between, $align: flex-start);
          width: 65%;

          &__block {
            @include flex($direction: column);
            width: 48%;

            img {
              width: 100%;
              height: auto;
            }
          }
        }
      }
      &__item.active {
        .c-homeFaqs__item-question {
          background-color: $color-black;
          color: $color-white;
        }
      }
    }
  }
}
</style>
