<template>
  <div :class="_buildModifiers('c-sidebarPayment', modifiers)" v-if="customerRecharge">
    <c-overlay class="c-sidebar__overlay" :show="show" @click.native="UI_CLOSE_SIDEBAR" />
    <div :class="_buildModifiers('c-sidebar__drawer', drawerModifiers)" @close="UI_CLOSE_SIDEBAR">
      <div class="c-sidebar__container o-container">
        <button class="c-sidebar__back" v-if="backText" @click="UI_CLOSE_SIDEBAR">
          <c-svg class="c-sidebar__backIcon" name="chevron" />
          <span class="c-sidebar__backText" v-html="backText" />
        </button>
        <c-h class="c-sidebar__heading" v-if="heading" tag="h1" level="1" :text="heading" />
        <c-loading />
        <iframe
          id="paymentIframe"
          class="c-sidebar__iframe"
          v-if="src"
          :src="src"
          frameborder="0"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import cOverlay from '@shared/components/core/cOverlay.vue'
import cSvg from '@shared/components/core/cSvg.vue'
import cH from '@shared/components/core/cH.vue'
import cLoading from '@shared/components/core/cLoading.vue'
import { format } from 'date-fns'
import { nextChrgAndDelvDateBasedOnDelvDay, delay } from '@shared/utils'

export default {
  props: {
    modifiers: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      counter: 0,
      iframeLoadCount: 0,
      cardUpdatePending: false
    }
  },
  components: { cOverlay, cSvg, cH, cLoading },
  computed: {
    ...mapGetters('customer', ['customerRecharge', 'customerCharges', 'customerChargeError']),
    show() {
      return this.sidebar.component === 'cSidebarPayment'
    },
    content() {
      return this.$store.getters['customize/customizeSidebarByPrefix']('payment_')
    },
    sidebar() {
      return this.$store.getters['ui/uiByKey']('sidebar')
    },
    backText() {
      const backKey = Object.keys(this.content).find(key => key.endsWith('_back'))
      return backKey ? this.content[backKey] : false
    },
    heading() {
      const headingKey = Object.keys(this.content).find(key => key.endsWith('_heading'))
      return headingKey ? this.content[headingKey] : false
    },
    shipDay() {
      return this.customerCharges[this.customerCharges.length - 1].note_attributes[0].value
    },
    nextChrgDate() {
      const dates = nextChrgAndDelvDateBasedOnDelvDay(this.shipDay)
      return dates[0]
      //  format((this.chargeDateFormat), 'YYYY-MM-DD')+'T00:00:00'
    },
    nextDelvDate() {
      const dates = nextChrgAndDelvDateBasedOnDelvDay(this.shipDay)
      return dates[1]
    },
    src() {
      const { customerRecharge } = this
      if (customerRecharge) {
        return `https://shopifysubscriptions.com/customer_portal_forms/${customerRecharge.hash}/customer_card/`
      }
    },
    drawerModifiers() {
      let modifiers = [...this.modifiers]
      if (this.show) modifiers.push('isOpen')
      return modifiers
    }
  },
  methods: {
    ...mapMutations('ui', ['UI_CLOSE_SIDEBAR', 'UI_SET_MODAL', 'UI_CLOSE_MODAL']),
    ...mapActions('customer', [
      'customerSetResources',
      'customerUpdateAddress',
      'customerUpdateChargesDate'
    ]),
    async getCharges() {
      this.counter++
      const { success, error } = await this.customerSetResources({
        resources: ['charges']
      })
      console.log(this.counter)
    },
    checkForCardUpdate() {
      const check = setInterval(() => {
        this.getCharges()

        if (!this.show || this.cardUpdatePending) clearInterval(check)
        if (this.counter > 69) {
          clearInterval(check)
          this.$router.push({ path: '/shipments' })
        }
      }, 4000)
    },
    triggerConfirmModal() {
      this.UI_SET_MODAL({
        component: 'cModalChangesProcessing',
        settings: {
          closable: true,
          newChargeDate: format(this.nextChrgDate, 'dddd, MMMM D'),
          newShipDate: format(this.nextDelvDate, 'dddd, MMMM D'),
          isConfirmNewCC: true
        }
      })

      this.handleActivate()
    },
    async handleActivate() {
      if (this.customerChargeError) {
        await delay(101)
        const nextCharge = await this.customerChargeError

        await this.customerUpdateChargesDate({
          addressId: nextCharge.addressId,
          updates: [
            {
              id: nextCharge.id,
              next_charge_date: format(this.nextChrgDate, 'YYYY-MM-DD') + 'T00:00:00'
            }
          ]
        })

        await delay(101)

        const { address } = await this.customerUpdateAddress({
          updates: {
            id: nextCharge.addressId,
            note_attributes: [
              {
                name: 'Delivery Day',
                value: nextCharge.note_attributes[0].value
              },
              {
                name: 'Delivery Date',
                value: format(this.nextDelvDate, 'MM-DD-YYYY')
              }
            ]
          }
        })

        await delay(500)
        this.UI_CLOSE_SIDEBAR()

        await delay(5000)
        this.UI_CLOSE_MODAL()
        this.$router.push({ path: '/shipments' })
      } else {
        return
      }
    }
  },
  watch: {
    customerChargeError: {
      immediate: true,
      handler(val) {
        if (val) {
          if (this.customerChargeError.error_type === 'CARD_UPDATED_NOW_PENDING_NEXT_ATTEMPT')
            this.cardUpdatePending = true
        }
      }
    },
    cardUpdatePending() {
      if (this.cardUpdatePending && this.counter > 0) {
        this.triggerConfirmModal()
      }
    },
    show() {
      if (this.show) this.checkForCardUpdate()
    },
    counter() {
      if (this.counter > 70) {
        this.checkForCardUpdate()
      }
    }
  },
  mounted() {
    setTimeout(() => {
      document.querySelector('.c-loading__wheel').style.opacity = 0
      document.querySelector('.c-sidebar__iframe').style.opacity = 1
    }, 2000)

    // if(!this.cardUpdatePending) this.checkForCardUpdate()
  }
}
</script>

<style lang="scss">
.c-sidebarPayment {
  .c-sidebar__drawer {
    position: fixed;
    width: 580px;
    max-width: 100%;
    top: 0;
    right: 0;
    height: 100vh;
    overflow-y: scroll;
    transform: translateX(100%);
    transition-duration: 0.3s;
    transition-timing-function: ease-in-out;
    z-index: $z-index-drawer;
    &.c-sidebar__drawer--isOpen {
      transform: translateX(0);

      @include media-tablet-down {
        z-index: 11;
      }
    }

    .c-loading__wheel {
      border-color: #000;
      border-top-color: #fff;
      opacity: 1;
      position: absolute;
      z-index: 1;
      top: calc(50% - 60px);
      left: calc(50% - 30px);
    }

    .c-sidebar__iframe {
      background-color: #f3f0e9;
      opacity: 0;
      position: relative;
      z-index: 2;
    }
  }
  .c-sidebar__iframe {
    width: 100%;
    height: 750px;
    padding-bottom: 30px;
    overflow: hidden;
  }
}
</style>
