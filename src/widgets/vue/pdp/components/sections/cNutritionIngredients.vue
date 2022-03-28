<template>
  <div class="ingredients__container">
    <p class="c-p2 ingredients__title">{{ this.labels.ingredients }}</p>
    <h5 v-if="!isMobile" class="c-h5 ingredients__highlighted" v-html="formattedHighlight" />
    <p class="c-p2 ingredients__list" v-html="formattedList" />
  </div>
</template>
<script>
export default {
  props: {
    isMobile: {
      type: Boolean,
      required: true
    },
    labels: {
      type: Object,
      required: true
    },
    highlightedIngredients: {
      type: String,
      required: false,
      default: ''
    },
    otherIngredients: {
      type: String
    }
  },
  computed: {
    formattedHighlight() {
      return this.highlightedIngredients.trim().split(',').join('<span>•</span>')
    },
    formattedOther() {
      return this.otherIngredients?.trim()
    },
    formattedList() {
      return this.isMobile
        ? this.highlightedIngredients.trim().concat(',').concat(this.formattedOther)
        : this.formattedOther
    }
  }
}
</script>
<style lang="scss">
.ingredients__container {
  border-bottom: 1px solid $color-white;
  padding-bottom: 27px;

  @include media-tablet-up {
    border-bottom: 1px solid transparent;
    padding-bottom: 50px;
  }
}
.ingredients__title {
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 23px;
}
.ingredients__highlighted {
  font-size: 22px;
  line-height: 33px;
  letter-spacing: -0.02em;

  span {
    padding: 0px 5px;
  }
}
.ingredients__list {
  font-size: 17px;
  line-height: 150%;
}
</style>
