<template>
  <c-radioGroup
    :class="_buildModifiers('c-cancelRadios', modifiers)"
    v-if="content"
    v-model="cancelModel"
    :modifiers="modifiers"
  >
    <div class="c-cancelRadios__item" v-for="(reason, index) in cancelReasons" :key="`reason-${index}`">
      <c-radio
        class="c-cancelRadios__radio"
        :active="cancelModel"
        :uncheck="true"
        :modifiers="['isBlack']"
        :attributes="{
          name: 'cancellation_reason',
          value: reason
        }"
      />
      <div class="c-cancelRadios__delay" v-if="delay && content && cancelModel === reason">
        <c-h
          class="c-cancelRadios__delayHeading"
          v-if="content.delay_heading"
          tag="h5"
          level="5"
          :text="content.delay_heading"
        />
        <c-button
          class="c-cancelRadios__delayButton"
          v-if="content.delay_button"
          @click="$emit('delay')"
          :loading="loading.delay"
          :text="content.delay_button"
          :modifiers="['isDefault', 'isBlack', 'hideTextLoading']"
          :attributes="{ disabled: !cancelModel || loading.cancel || loading.delay }"
        />
      </div>
    </div>
  </c-radioGroup>
</template>

<script>
import { mapGetters } from 'vuex'
import cRadioGroup from '@shared/components/core/cRadioGroup.vue'
import cRadio from '@shared/components/core/cRadio.vue'
import cH from '@shared/components/core/cH.vue'
import cButton from '@shared/components/core/cButton.vue'

export default {
  props: {
    delay: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Object,
      default: () => ({})
    },
    content: {
      type: Object,
      required: false
    },
    modifiers: {
      type: Array,
      default: () => []
    }
  },
  components: {
    cRadioGroup,
    cRadio,
    cH,
    cButton
  },
  data: () => ({ cancelModel: false }),
  computed: {
    cancelReasons() {
      return ['reason_1', 'reason_2', 'reason_3', 'reason_4', 'reason_5'].map(reason => {
        if (!this._stringEmpty(this.content[reason])) return this.content[reason]
      })
    }
  },
  watch: {
    cancelModel: {
      immediate: true,
      handler(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>

<style lang="scss">
.c-cancelRadios {
  @include media-tablet-down {
    max-width: calc(100vw - 4.5rem);
  }
}

.c-cancelRadios__delay {
  display: flex;
  align-items: center;
  background-color: $color-ecru;
  margin: 1.25rem 0;
  padding: 1rem 2.25rem;
  border: 1px solid $color-hr;

  > * {
    flex: 1;
  }

  .c-cancelRadios__delayHeading {
    text-align: left;
    max-width: clamp(280px, 50%, 600px);
    margin: 0;
  }

  @include media-mobile-down {
    flex-direction: column;
    align-items: flex-start;

    .c-cancelRadios__delayHeading {
      margin-bottom: 1rem;
    }
  }
}
</style>
