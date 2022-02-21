<template>
  <c-radioGroup
    :class="_buildModifiers('c-cancelRadios', modifiers)"
    v-if="content"
    v-model="cancelModel"
    :modifiers="modifiers"
  >    <!-- test -->
    <div
      class="c-cancelRadios__item"
      v-for="(reason, index) in cancelReasons"
      :key="`reason-${index}`"
    >
      <c-radio
        class="c-cancelRadios__radio"
        :active="activeReason"
        :uncheck="false"
        :modifiers="['isBlack']"
        :text="reason"
        :attributes="{
          name: 'cancellation_parent_reason',
          value: reason,
        }"
        @input="handleOuterRadioInput"
      />
      <hr
        v-if="activeReason === reason && specificReason[reason]"
        class="c-cancelRadios__hr"
      />
      <div
        class="c-cancelRadios__specifics"
        v-if="specificReason[reason] && activeReason === reason"
      >
        <c-p
          class="c-cancelRadios__specific-heading"
          tag="p"
          level="1"
          v-html="content.specific_reason_heading"
        />
        <div
          class="c-cancelRadios__specific"
          v-for="(item, index2) in specificReason[reason]"
          :key="index2"
        >
          <c-radio
            class="c-cancelRadios__radio"
            :active="cancelModel"
            :uncheck="false"
            :modifiers="['isBlack']"
            :text="item"
            :attributes="{
              name: 'cancellation_reason',
              value: item,
            }"
            @input="handleInnerRadioInput"
          />
        </div>
      </div>

      <!-- <div class="c-cancelRadios__delay"
        v-if="delay && content && cancelModel === reason"
      >
          <c-h class="c-cancelRadios__delayHeading"
            v-if="content.delay_heading"
            tag="h4"
            level="4"
            :text="content.delay_heading"
          />
          <c-button class="c-cancelRadios__delayButton"
            v-if="content.delay_button"
            @click="$emit('delay')"
            :loading="loading.delay"
            :text="content.delay_button"
            :modifiers="['isDefault', 'isSecondary', 'hideTextLoading']"
            :attributes="{ disabled: !cancelModel || loading.cancel || loading.delay }"
          />
        </div> -->
    </div>
  </c-radioGroup>
</template>

<script>
import { mapGetters } from 'vuex'
import cRadioGroup from '@shared/components/core/cRadioGroup.vue'
import cRadio from '@shared/components/core/cRadio.vue'
import cH from '@shared/components/core/cH.vue'
import cP from '@shared/components/core/cP.vue'
import cButton from '@shared/components/core/cButton.vue'

export default {
  props: {
    delay: {
      type: Boolean,
      default: true,
    },
    loading: {
      type: Object,
      default: () => ({}),
    },
    content: {
      type: Object,
      required: false,
    },
    modifiers: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    cRadioGroup,
    cRadio,
    cH,
    cP,
    cButton,
  },
  data: () => ({ cancelModel: false, specificReason: {}, activeReason: '' }),
  computed: {
    cancelReasons() {
      const reasonKeys = Array.from({ length: 10 }, (v, i) => `reason_${i}`)
      const reasons = reasonKeys.reduce((acc, cur) => {
        if (this.content[cur]) {
          acc.push(this.content[cur])
        }

        return acc
      }, [])

      if (this.content.reason_other) {
        reasons.push(this.content.reason_other)
      }

      return reasons
    },
  },
  mounted() {
    const { specific_reasons = [] } = this.content
    const specificReason = specific_reasons.reduce((acc, cur) => {
      const { key, title } = cur
      if (key && title) {
        acc[key] = acc[key] || []
        acc[key].push(title)
      }

      return acc
    }, {})

    this.specificReason = specificReason
  },
  methods: {
    handleOuterRadioInput(value) {
      this.activeReason = value

      if (!this.specificReason[value]) {
        this.$emit('select', value)
      }
    },
    handleInnerRadioInput(value) {
      this.$emit('select', value)
    }
  },
  watch: {
    cancelModel: {
      immediate: true,
      handler(val) {
        this.$emit('input', val)
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.c-cancelRadios__delay {
  margin: 15px 0 30px;
  padding: 10px 15px 15px;
  background-color: $color-white;
  border: 1px solid $color-hr;
}
.c-cancelRadios__delayHeading {
  margin-bottom: 15px;
  text-align: left;
}

.c-cancelRadios__item {
  background-color: $color-ecru;
  border: 1px solid $color-paleo;
  border-radius: 8px;
  padding: 18px;

  &:not(:last-child) {
    margin-bottom: 10px;
  }
}

.c-cancelRadios__hr {
  margin-top: 12px;
  margin-bottom: 12px;
  border: 0;
  border-top: 1px solid $color-paleo;
}

.c-cancelRadios__specific-heading {
  font-weight: 600;
  font-size: 15px;
  color: $color-pebble;
  margin-bottom: 10px;
  margin-top: 12px;
}

.c-cancelRadios__specific {
  padding-left: 20px;
  padding-right: 20px;

  &:not(:last-child) {
    margin-bottom: 20px;
  }
}
</style>
