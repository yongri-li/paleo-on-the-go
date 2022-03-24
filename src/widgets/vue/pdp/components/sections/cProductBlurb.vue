<template>
    <div class="productForm__productBlurb">
        <img class="productBlurb__icon" :src="this.icon" />
        <p class="c-p1 productBlurb__label" v-html="this.label"></p>
    </div>
</template>
<script>
export default {
    props: {
        content: {
            type: Object,
            required: true
        },
        isFreshPlus: {
            type: Boolean,
            required: true
        }
    },
    computed: {
        label() {
            return this.isFreshPlus ? this.content.fresh_text : this.content.regular_text
        },
        icon() {
            return this.isFreshPlus ? this.content.fresh_icon : this.content.regular_icon
        }
    }
}
</script>
<style lang="scss">
.productForm__productBlurb {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid $color-white;

    @include media-tablet-up {
        padding-bottom: 0px;
        justify-content: flex-start;
        min-height: 55px;
        padding-left: 30px;
        margin-bottom: 0px;
        border-bottom: 0px;
        border-left: 1px solid $color-white;
    }
}
.productBlurb__label {
    text-transform: uppercase;
    text-align: left;
    color: $color-black;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1px;
    margin-bottom: 0px;
}
.productBlurb__icon {
    width: 48px;
    margin-right: 20px;
}
</style>
