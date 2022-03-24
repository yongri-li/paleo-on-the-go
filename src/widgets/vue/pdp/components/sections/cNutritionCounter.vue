<template>
    <div class="c-nutritionCounter__container">
        <div :key="key" v-for="(value, key) in nutrientInfo" class="c-nutritionCounter__block">
            <p class="c-p1 c-nutritionCounter__label">{{ key }}</p>
            <p class="c-p1 c-nutritionCounter__value">{{ value }}<span v-if="key != 'calories'">g</span></p>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        content: {
            type: Object,
            required: true
        }
    },
    data: () => ({
        displayNutrients: ['calories', 'carbohydrates', 'protein'],
        nutrientInfo: {}
    }),
    beforeMount() {
        Object.entries(this.content).forEach(([key, value]) => {
            if (this.displayNutrients.includes(key)) {
                const label = key == 'net_carbs' ? 'carbs' : key
                this.nutrientInfo[label] = value
            }
        })
    }
}
</script>
<style lang="scss">
.c-nutritionCounter__container {
    display: flex;
    flex-flow: row;
    justify-content: center;
    padding-top: 10px;

    @include media-tablet-up {
        justify-content: flex-start;
    }
}
.c-nutritionCounter__block {
    padding: 0px 20px;
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    align-items: flex-start;

    @include media-tablet-up {
        padding: 0px 30px;
    }

    &:first-child {
        padding-left: 0px;
    }
}
.c-nutritionCounter__label {
    font-size: 13px;
    font-weight: 600;
    color: $color-grey;
    text-transform: capitalize;
    margin-bottom: 0px;
    opacity: 0.8;

    @include media-tablet-up {
        font-size: 15px;
    }
}
.c-nutritionCounter__value {
    font-size: 24px;
    font-weight: 700;
    color: $color-black;
    letter-spacing: -0.02em;
}
</style>
