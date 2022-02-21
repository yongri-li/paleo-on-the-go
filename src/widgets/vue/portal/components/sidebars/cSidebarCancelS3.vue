<template>
  <div :class="_buildModifiers('c-sidebarCancel', modifiers)" v-if="content && address">
    <c-h class="c-sidebar__heading" tag="h1" level="1" :text="content.cancel_heading" />
    <c-p
      class="c-sidebarCancel__address"
      tag="address"
      level="1"
      v-html="
        _buildAddress({
          address: address,
          options: {
            hiddenFields: ['name', 'country', 'company'],
            provinceName: 'short',
            flatten: true
          }
        })
      "
    />
    <article class="c-sidebarCancel__article">
      <img
        v-if="content.cancel_image_s3"
        class="c-sidebarCancel__article-image"
        :src="content.cancel_image_s3"
        :alt="content.cancel_image_alt_s3"
      />

      <div class="c-sidebarCancel__article-body">
        <template v-if="discountSuccess">
          <c-h
            class="c-sidebarCancel__article-heading"
            tag="h3"
            level="3"
            :text="content.cancel_discount_success"
          />
        </template>
        <template v-else>
          <c-h
            class="c-sidebarCancel__article-heading"
            tag="h3"
            level="3"
            :text="content.cancel_heading_s3"
          />

          <c-p
            class="c-sidebarCancel__article-subheading"
            tag="p"
            level="1"
            :text="content.cancel_subheading_s3"
          />

          <c-p
            class="c-sidebarCancel__article-paragraph"
            tag="p"
            level="2"
            :text="content.cancel_text_s3"
          />
        </template>
      </div>

      <template v-if="!discountSuccess">
        <c-button
          class="c-cta c-cta--inverse"
          :loading="loading"
          :attributes="{ disabled: discountCodeApplied }"
          :text="discountCodeApplied ? codeApplied : content.cancel_accept_btn_s3"
          :modifiers="['isSecondary', 'hideTextLoading']"
          @click="handleAccept"
        />
        <button class="c-cta c-button--isDefault" @click="handleConfirmCancel">
          {{ content.cancel_reject_btn_s3 }}
        </button>
      </template>
    </article>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'
import cP from '@shared/components/core/cP.vue'
import cH from '@shared/components/core/cH.vue'
import cButton from '@shared/components/core/cButton.vue'

export default {
  data() {
    return {
      discountSuccess: false,
      loading: false,
      codeApplied: 'Discount Code Applied'
    }
  },
  components: { cP, cH, cButton },
  props: {
    content: {
      type: Object,
      required: true
    },
    settings: {
      type: Object,
      required: true
    },
    modifiers: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapGetters('customer', ['customerUpcomingCharges']),
    address() {
      return this.$store.getters['customer/customerAddressById'](this.settings.addressId)
    },
    nextUpcomingCharge() {
      return this.customerUpcomingCharges.filter((chrg) => chrg.status !== 'REFUNDED')
    },
    discountCode() {
      return this.nextUpcomingCharge[0].discount_codes.length > 0
        ? this.nextUpcomingCharge[0].discount_codes[0].code
        : false
    },
    discountCodeApplied() {
      if (this.discountCode) {
        return this.discountCode === this.content.cancel_promo_code ? true : false
      } else {
        return false
      }
    }
  },
  methods: {
    ...mapMutations('ui', ['UI_SET_SIDEBAR', 'UI_CLOSE_SIDEBAR']),
    ...mapActions('customer', ['customerUpdateAddressDiscount']),
    async handleAccept() {
      try {
        this.loading = true

        await this.customerUpdateAddressDiscount({
          addressId: this.address.id,
          discountCode: this.content.cancel_promo_code
        })

        this.discountSuccess = true
        this.loading = false
      } catch (error) {
        console.error(error)
      }
    },
    handleConfirmCancel() {
      this.UI_SET_SIDEBAR({
        component: 'cSidebarCancelS4',
        content: this.content,
        settings: this.settings
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.c-sidebarCancel__article {
  background-color: $color-ecru;
  border-radius: 12px;
  padding: 14px;
  padding-bottom: 18px;
}

.c-sidebarCancel__article-image {
  display: block;
  width: 100%;
  margin-bottom: 24px;
  border-radius: 12px;
}

.c-sidebarCancel__article-body {
  max-width: 361px;
  margin: 0 auto;
  text-align: center;
}

.c-sidebarCancel__article-heading {
  font-size: 22px;
  letter-spacing: -0.02em;
}

.c-sidebarCancel__article-subheading {
  color: $color-broccoli;
  font-weight: 600;
  font-size: 20px;
  margin-bottom: 12px;
}

.c-sidebarCancel__article-paragraph {
  font-size: 16px;
  letter-spacing: 0.01em;
  margin-bottom: 20px;
  line-height: 1.2;
}

.c-cta--inverse {
  margin-bottom: 15px;
}
</style>
