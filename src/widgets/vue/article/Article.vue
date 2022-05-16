<template>
  <div class="page">
    <hero-article :content="heroContent" :tags="data.tags"/>
    <div class="content">
      <content-article :content="data.body_html" />
      <pagination-article :link-prev="data.previous_article" :link-next="data.next_article"/>
      <share-article />
    </div>
  </div>
</template>

<script>
import HeroArticle from './components/HeroArticle.vue'
import ContentArticle from './components/ContentArticle.vue'
import PaginationArticle from './components/PaginationArticle.vue'
import ShareArticle from './components/ShareArticle.vue'

export default {
  components: {
    HeroArticle,
    ContentArticle,
    PaginationArticle,
    ShareArticle
  },
  data() {
    return {
      data: window.Scoutside.article
    }
  },
  computed: {
    heroContent() {
      return {
        title: this.data.title,
        bg_image: this.data.image.src
      }
    }
  }
}
</script>

<style lang="scss">
.content {
  width: 96vw;
  max-width: 840px;
  margin: 1rem auto;
  @include media-tablet-up {
    width: 50vw;
    margin: 4rem auto;
  }

  .link-article {
    color: $color-secondary;
    display: block;
    text-decoration: underline;
    margin: 1rem 0;
    font-weight: 500;

    @include media-tablet-up {
      font-size: 1.4rem;
    }
  }
}
</style>