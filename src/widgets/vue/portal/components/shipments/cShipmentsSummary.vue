<template>
  <c-accordion :class="_buildModifiers('c-shipmentsSummary', modifiers)" v-if="shipment && content">
    <c-accordionItem class="c-shipmentsSummary__item">
      <div class="c-shipmentsSummary__trigger" slot="trigger" @click="emitBoxHeight">
        <div
          class="c-shipmentsSummary__triggerLabel"
          v-if="content.label_order"
          v-html="content.label_order"
        />
        <div
          class="c-shipmentsSummary__triggerValue"
          v-if="shipment.total"
          v-html="`${currencySymbol}${_formatMoney({ amount: shipment.total })}`"
        />
        <div class="c-shipmentsSummary__triggerCircle">
          <c-svg class="c-shipmentsSummary__triggerIcon" name="chevron" />
        </div>
      </div>
      <div class="c-shipmentsSummary__content" slot="content">
        <div
          class="c-shipmentsSumary__contentLine"
          v-for="(line, index) in summaryLines"
          :key="`summaryLine-${index}`"
          :class="index == summaryLines.length - 1 ? 'c-shipmentsSumary__contentLine--isTotal' : ''"
        >
          <div class="c-shipmentsSummary__contentLabel" v-if="line.label" v-html="line.label" />
          <div
            class="c-shipmentsSummary__contentValue"
            :class="line.label === 'Discount' ? 'summary__isDiscount' : null"
            v-if="line.value"
            v-html="line.value"
          />
        </div>
      </div>
    </c-accordionItem>
  </c-accordion>
</template>

<script>
import cAccordion from '@shared/components/core/cAccordion.vue'
import cAccordionItem from '@shared/components/core/cAccordionItem.vue'
import cSvg from '@shared/components/core/cSvg.vue'

export default {
  props: {
    shipment: {
      type: Object,
      required: true
    },
    content: {
      type: Object,
      required: true
    },
    modifiers: {
      type: Array,
      default: () => []
    }
  },
  components: {
    cAccordion,
    cAccordionItem,
    cSvg
  },
  computed: {
    currencySymbol() {
      return this.$store.getters['customize/customizeShopByKey']('currency_symbol')
    },
    summaryLines() {
      const { label_subtotal, label_discount, label_shipping, label_tax, label_total } = this.content
      const { subtotal, discount, shipping, tax, total, total_line_items_price } = this.shipment
      let lines = [
        { label: label_subtotal, value: total_line_items_price },
        { label: label_discount, value: discount },
        { label: label_shipping, value: shipping },
        { label: label_tax, value: tax },
        { label: label_total, value: total }
      ]
      return lines.map((line, index) => {
        let value = `${this.currencySymbol}${this._formatMoney({ amount: line.value })}`
        if (index == 1) value = `-${value}`
        return { label: line.label, value }
      })
    }
  },
  methods: {
    emitBoxHeight() {
      this.$emit('summaryAccOpen')
    }
  }
}
</script>

<style lang="scss">
.c-shipmentsSummary__item {
  width: 100%;
  border: 1px solid $color-ecru;
}
.c-shipmentsSummary__trigger {
  height: 4rem;
  padding: 1rem;
  width: 100%;
  transition: all 175ms;
  @include flex($justify: space-between, $wrap: nowrap);
  @include media-mobile-down {
    padding-right: 10px;
  }
}
.c-shipmentsSummary__triggerLabel,
.c-shipmentsSummary__triggerValue {
  font-size: 18px;
  font-weight: 600;
  padding-right: 10px;
}
.c-shipmentsSummary__triggerLabel {
  flex-grow: 1;
}
.c-shipmentsSummary__triggerCircle {
  border: 2px solid $color-black;
  border-radius: 50%;
  @include flex($justify: center);
  margin-left: 10px;
  @include media-mobile-down {
    margin-left: 0;
  }
  .c-accordionItem__trigger--isOpen & {
    border-color: $color-primary;
    svg path {
      fill: $color-primary;
    }
  }
}
.c-shipments__box .c-shipmentsSummary__item {
  .c-accordionItem__trigger--isOpen {
    .c-shipmentsSummary__trigger {
      background-color: $color-black;
      color: #fff;
    }
  }
  .c-shipmentsSummary__triggerCircle {
    min-width: 2.25rem;
    width: 2.25rem;
    height: 2.25rem;
    margin-left: 0.25rem;
    @include media-mobile-down {
      margin-left: 0;
      min-width: 1.85rem;
      width: 1.85rem;
      height: 1.85rem;
    }
  }

  @include media-mobile-down {
    .c-shipmentsSummary__trigger {
      padding: 1rem;
    }
  }
}
.c-shipmentsSummary__triggerIcon {
  color: $color-primary;
  width: 12px;
  height: auto;
  transition: transform 0.35s ease-in-out;
  transform-origin: 50%;
  .c-accordionItem__trigger--isOpen & {
    transform: rotate(180deg);
  }
}
.c-shipmentsSummary__content {
  color: $color-grey;
  width: 100%;
  padding: 1rem;
}
.c-shipmentsSumary__contentLine {
  padding-right: 33px;
  @include flex($justify: space-between);
  color: $color-grey;
  font-size: 16px;
  margin-bottom: 7px;
  @include media-desktop-up {
    padding-right: 50px;
  }
  &.c-shipmentsSumary__contentLine--isTotal {
    color: $color-black;
    font-size: 1.5rem;
    font-weight: 500;
    margin-bottom: 0;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #dbd9d4;
    @include media-mobile-down {
      font-size: 18px;
    }
  }
  .c-shipmentsSummary__contentValue {
    &.summary__isDiscount {
      color: $color-secondary;
    }
  }
}
</style>
