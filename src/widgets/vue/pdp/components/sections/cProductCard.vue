<template>
  <div id="asdd"
    :class="[`c-product c-product--${modifier} c-product--cta`, {
      'c-product--selected': selected
    }]"
  >
    <div class="c-product__inner">
      <div class="c-product__image-side">
        <a :href="product.url" class="c-product__image-frame">
          <span v-if="flag" :class="`c-product__flag c-product__flag--${ flagHandle }`">
            {{ flag }}
          </span>
          <div class="c-product__image-wrapper">
            <img class="c-product__image" :src="product.images[0]" />
          </div>
        </a>
      </div>
      <div class="c-product__info">
        <div>
          <span class="c-tag">
            {{ tagText }}
          </span>
          <div class="c-product__title-wrapper">
            <a :href="product.url">
              <h4 class="c-product__title c-h4">
                {{ title }}
              </h4>
            </a>
            <span v-if="productSecondaryTitle" class="c-product__subtitle">
              {{ productSecondaryTitle }}
            </span>
          </div>
        </div>

      </div>
    </div>
    <ul v-if="nutritionalInfo" class="c-product__details">
      <li v-if="nutritionalInfo.calories" class="c-product__detail">
        {{ nutritionalInfo.calories }} Cal
      </li>
      <li v-if="nutritionalInfo.carbohydrates" class="c-product__detail">
        {{ nutritionalInfo.carbohydrates }}g Carb
      </li>
      <li v-if="nutritionalInfo.protein" class="c-product__detail">
        {{ nutritionalInfo.protein }}g Protein
      </li>
 <!--      <li class="c-product__detail">
        {{ nutritionalInfo.fat }}g Fat
      </li> -->
    </ul>
  </div>
</template>

<script>
  import { formatPrice, handleize } from '../../utils';

  export default {
    props: {
      product: {
        type: Object
      },
      quantity: {
        type: Number
      },
      isAddOn: {
        type: Boolean
      },
      tag: {
        type: String
      },
      likable: {
        type: Boolean
      }
    },
    computed: {
      selected() {
        return this.quantity > 0;
      },
      title() {
        return this.product.title;
      },
      modifier() {
        return this.isAddOn ? 'addOn' : this.productTypeHandle;
      },
      productTypeHandle() {
        return handleize(this.product.type);
      },
      productSecondaryTitle() {
        return this.product.subtitle;
      },
      downcaseTags() {
        return this.product.tags.map(tag => tag.toLowerCase());
      },
      isNew() {
        return this.downcaseTags.includes('new');
      },
      isBestSeller() {
        return this.downcaseTags.includes('best seller');
      },
      nutritionalInfo() {
        return this.product.nutritional_info;
      },
      tagText() {
        return this.tag ? this.tag : this.product.type;
      },
      flag() {
        return this.product.flag;
      },
      flagHandle() {
        return handleize(this.flag);
      }
    }
  };
</script>
<style lang="scss" scoped>
.c-product{
    cursor: pointer;
}
.c-product__subtitle{
    color: $color-grey;
    font-size: 15px;
}
</style>
