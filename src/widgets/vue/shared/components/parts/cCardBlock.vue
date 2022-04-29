<template>
  <div class="card-block">
    <img
      :src="imgCard"
      :alt="header"
      class="card-block__img"
    />
    <c-rich-text
      :header="header"
      :header-class="headerClass"
      :body="body"
      class="card-block__rich-text"
    />
  </div>
</template>

<script>
import cRichText from '../core/cRichText.vue'

export default {
  components: {
    cRichText
  },
  props: {
    imgCard: {
      type: String,
      required: true
    },
    header: {
      type: String,
      required: true
    },
    headerClass: {
      type: String,
      default: 'c-h1'
    },
    body: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.card-block {
  &__rich-text {
    padding: 1rem .5rem;
  }
}
</style>