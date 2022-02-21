<template>
  <div class="u-bgSpringWood c-basketPage default__menu">
    <section v-if="!noDFMenuReturnedFromApp">
      <!--       <button @click="TESTfuncManullySetDfMenu">create a new default menu</button>
      <section> -->
      <nav class="c-mobileNav">
        <div class="o-container">
          <button class="c-mobileNav__back u-btnUnset" @click="handleClose">
            <cIcon icon="chevron" />
          </button>
          Default Menu
        </div>
        <div>
          {{ masterCollections }}
        </div>
      </nav>
      <div class="o-containerLarge">
        <div class="c-textHero u-textCenter">
          <h2 class="c-textHero__heading c-h2">
            Select Your Default Meals
          </h2>
          <div class="c-textHero__copy">
            Choose your default meals from the list below - we'll send you these in case you ever forget to
            make your selections! Please note that your pricing may change as you add or remove from this
            list!
          </div>
        </div>
        <div class="c-bundleGrid">
          <div class="c-bundleGrid__meals">
            <div v-for="collection in children" :key="collection.id">
              <header class="c-collectionHeader">
                <h4 class="c-collectionHeader__heading c-h4">{{ collection.title }}</h4>
                <div
                  class="c-collectionHeader__description u-hideMobile"
                  v-html="collection.short_description"
                ></div>
              </header>
              <div class="c-productGrid">
                <div
                  class="c-productGrid__item"
                  v-for="product in collection.firstTimeProducts"
                  :key="product.id"
                >
                  <c-product
                    :product="product"
                    :quantity="getItemQuantity(product.id)"
                    @qtyIncrease="() => handleQtyIncrease(product)"
                    @qtyDecrease="() => handleQtyDecrease(product)"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="u-hideMobile">
            <div class="c-basketSticky">
              <div class="c-basket">
                <header class="c-basket__header">
                  <h3 class="c-basket__title c-h3">My Default Meals</h3>
                  <p class="c-basket__text">
                    <span>{{ totalMenuItems }} Meals Selected</span>
                  </p>
                </header>
                <div class="c-basket__items">
                  <div>
                    <div class="c-basket__item" v-for="child in defaultMenu.favorites" :key="child.id">
                      <c-line-item
                        :product="getProductObject(child.shopify_product_id)"
                        :quantity="child.quantity"
                        :dfmUpsell="child.shopify_variant_id"
                        :upsellVarId="upselled"
                        :showUpsell="true"
                        @qtyIncrease="() => handleQtyIncrease(getProductObject(child.shopify_product_id))"
                        @qtyDecrease="() => handleQtyDecrease(getProductObject(child.shopify_product_id))"
                        @remove="() => handleRemove(child.shopify_product_id)"
                        @upsellOptIn="upsellId => handleUpsellOptIn(child.shopify_product_id, upsellId)"
                        @upsellOptOut="() => handleUpsellOptOut(child.shopify_product_id)"
                        @upsellOptOut2="upsellId => handleUpsellOptOut(child.shopify_product_id, upsellId)"
                      />
                    </div>
                  </div>
                </div>
                <div class="c-basket__cta-wrapper">
                  <div v-if="underMealThreshold" class="c-notification-wrapper">
                    <div class="c-notification">
                      You must select at least 6 meals to save
                    </div>
                  </div>
                  <ul class="c-basket__ctas">
                    <li>
                      <button class="c-cta c-cta--inverse" @click="handleClose">
                        Cancel
                      </button>
                    </li>
                    <li>
                      <c-button
                        class="c-cta"
                        :disabled="submitting || underMealThreshold || !hasMealChanges"
                        :loading="btnloading"
                        @click="handleSaveDefaultMenu"
                        :text="!saveCta.successMessageVisibility ? saveCta.default : saveCta.success"
                        :modifiers="['isDefault', 'hideTextLoading']"
                      />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="u-hideDesktop">
            <div
              :class="[
                'c-basketMobile',
                {
                  'c-basketMobile--open': basketOpen
                }
              ]"
            >
              <div class="c-basketMobile__inner">
                <div class="c-basketMobile__info">
                  <div>
                    <h4 class="c-basketMobile__heading c-h4">
                      My Default Meals
                    </h4>
                  </div>
                  <div class="c-basketMobile__text u-colorBroccoli">
                    {{ totalMenuItems }} Meals
                    <div class="c-basketMobile__toggle" @click="() => (basketOpen = !basketOpen)">
                      <c-icon icon="chevron" />
                    </div>
                  </div>
                </div>
                <div class="c-basketMobile__items">
                  <div class="c-basketMobile__item" v-for="child in defaultMenu.favorites" :key="child.id">
                    <!-- :product="getProductObject(child.shopify_product_id)"
                      :quantity="child.quantity"
                      @qtyIncrease="() => handleQtyIncrease(getProductObject(child.shopify_product_id))"
                      @qtyDecrease="() => handleQtyDecrease(getProductObject(child.shopify_product_id))"
                      @remove="() => handleRemove(child.shopify_product_id)" -->
                    <c-line-item
                      :product="getProductObject(child.shopify_product_id)"
                      :quantity="child.quantity"
                      :dfmUpsell="child.shopify_variant_id"
                      :upsellVarId="upselled"
                      :showUpsell="true"
                      @qtyIncrease="() => handleQtyIncrease(getProductObject(child.shopify_product_id))"
                      @qtyDecrease="() => handleQtyDecrease(getProductObject(child.shopify_product_id))"
                      @remove="() => handleRemove(child.shopify_product_id)"
                      @upsellOptIn="upsellId => handleUpsellOptIn(child.shopify_product_id, upsellId)"
                      @upsellOptOut="() => handleUpsellOptOut(child.shopify_product_id)"
                      @upsellOptOut2="upsellId => handleUpsellOptOut(child.shopify_product_id, upsellId)"
                    />
                  </div>
                </div>
                <div>
                  <div class="c-basketMobile__cta">
                    <div v-if="underMealThreshold" class="c-notification-wrapper">
                      <div class="c-notification">
                        You must select at least 6 meals to save
                      </div>
                    </div>
                    <ul class="c-basket__ctas">
                      <li>
                        <button class="c-cta c-cta--inverse" @click="handleClose">
                          Cancel
                        </button>
                      </li>
                      <li>
                        <button
                          class="c-cta"
                          :disabled="submitting || underMealThreshold || !hasMealChanges"
                          @click="handleSaveDefaultMenu"
                        >
                          <span v-if="!saveCta.successMessageVisibility">
                            {{ saveCta.default }}
                          </span>
                          <span v-else class="c-cta--small">
                            {{ saveCta.success }}
                          </span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section v-else>
      <nav class="c-mobileNav">
        <div class="o-container">
          <button class="c-mobileNav__back u-btnUnset" @click="handleClose">
            <cIcon icon="chevron" />
          </button>
          Default Menu
        </div>
        <div>
          {{ masterCollections }}
        </div>
      </nav>
      <div class="o-container">
        <div class="c-ctaBlock u-textCenter c-shipmentsBox mg-top__md">
          <h2 class="c-ctaBlock__heading c-h2">
            We're So Sorry!
          </h2>
          <p>
            This is awkward, but it seems we're experiencing technical difficulties.
            <br />
            <br />
            Please check back later and we apologize for the inconvenience!
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapMutations, mapState, mapGetters, mapActions } from 'vuex'
import cIcon from '@shared/components/core/cIcon.vue'
import cButton from '@shared/components/core/cButton.vue'
import cProduct from '@shared/components/core/cProduct.vue'
import cLineItem from '@shared/components/core/cLineItem.vue'
// import cShipmentsNoFmpAppReturn from '@portal/components/shipments/cShipmentsNoFmpAppReturn.vue'
import { format } from 'date-fns'
import { delay, warningPop, stillProcessingWarningPopup, removeReloadWarning } from '@shared/utils'

export default {
  data() {
    return {
      submitting: false,
      btnloading: false,
      basketOpen: false,
      upselled: '',
      storedDefaultMenu: null,
      isDefaultMenu: false,
      newDfSet: false,
      newDfMenuArr: [],
      saveCta: {
        successMessageVisibility: false,
        success: 'Saved!',
        default: 'Save Changes'
      }
    }
  },
  computed: {
    ...mapState('products', ['children', 'defaultCollection', 'defaultMenu', 'defaultMenuItems']),
    ...mapState('ui', ['noDFMenuReturnedFromApp', 'pastCutoffEST']),
    ...mapState('masterCollections'),
    ...mapState('customer', ['isNextSkipped']),
    ...mapGetters('products', ['allProducts', 'groupChildren', 'testDfCollection']),
    ...mapGetters('customer', [
      'customerRecharge',
      'isNewSelected',
      'customerUpcomingCharge',
      'customerUpcomingCharges'
    ]),
    addressId() {
      return this.customerUpcomingCharges[0].addressId
    },
    nextUpcomingCharge() {
      return this.customerUpcomingCharges.filter(chrg => chrg.status !== 'REFUNDED')
    },
    totalMenuItems() {
      return this.defaultMenu.favorites.reduce((accumulator, favorite) => accumulator + favorite.quantity, 0)
    },
    underMealThreshold() {
      return this.totalMenuItems < 6
    },
    subscriptions() {
      return this.$store.getters['customer/customerSubscriptionsByAddress'](this.addressId)
    },
    subscriptionIds() {
      return this.subscriptions.map(subscription => subscription.id)
    },
    dfVariantIds() {
      return this.defaultMenuItems.map(variant => {
        return variant.upsellId ? variant.upsellId : variant.variants[0].id
      })
    },
    subsUpdateFromDfMenu() {
      return this.defaultMenuItems.map(child => {
        return {
          shopify_variant_id: child.upsellId || child.variants[0].id,
          quantity: child.quantity,
          price: (child.variants[0].price / 100).toFixed(2),
          hash: child.price_hashes[0],
          tags: child.tags,
          product_type: child.type,
          charge_interval_frequency: 1,
          order_interval_frequency: 1,
          order_interval_unit: 'week',
          upsell_id: child.upsellId ? child.upsellId : null,
          upsell_price: child.upsellId ? (child.variants[1].price / 100).toFixed(2) : null,
          next_charge_scheduled_at:
            format(this.nextUpcomingCharge[0].scheduled_at, 'YYYY-MM-DD') + 'T00:00:00'
        }
      })
    },
    hasMealChanges() {
      if (this.defaultMenuItems.length !== this.defaultMenu.favorites.length) return true
      for (var i = 0; i < this.dfVariantIds.length; i++) {
        if (this.dfVariantIds[i] !== this.defaultMenu.favorites[i].shopify_variant_id) return true
      }
      for (var i = 0; i < this.defaultMenu.favorites.length; i++) {
        if (this.defaultMenuItems[i].quantity !== this.defaultMenu.favorites[i].quantity) return true
      }
      return false
    }
  },
  methods: {
    ...mapActions('products', ['customerSetDefaultMenu']),
    ...mapActions('customer', ['customerUpdatePlanToDFMenu', 'customerSetResources', 'customerChargesSkip']),
    ...mapMutations('ui', ['UI_TOGGLE_DEFAULT_MENU']),
    ...mapMutations('customer', ['CUSTOMER_SET_NEWSELECTEDMENU']),
    ...mapMutations('products', ['SET_DEFAULT_MENU_ITEMS']),
    handleClose() {
      this.UI_TOGGLE_DEFAULT_MENU(false)
      this.defaultMenu.favorites = this.storedDefaultMenu
    },
    getItemQuantity(id) {
      const item = this.defaultMenu.favorites.find(item => item.shopify_product_id === id)
      return item ? item.quantity : 0
    },
    getProductObject(id) {
      return this.allProducts.find(product => product.id === id)
    },
    handleQtyIncrease(product) {
      const item = this.defaultMenu.favorites.find(item => item.shopify_product_id === product.id)
      return item
        ? item.quantity++
        : this.defaultMenu.favorites.push({
            shopify_product_id: product.id,
            shopify_variant_id: product.variants[0].id,
            quantity: product.quantity || 1
          })
    },
    handleQtyDecrease(product) {
      const item = this.defaultMenu.favorites.find(item => item.shopify_product_id === product.id)
      const itemIndex = this.defaultMenu.favorites.findIndex(item => item.shopify_product_id === product.id)
      return item.quantity > 1 ? item.quantity-- : this.defaultMenu.favorites.splice(itemIndex, 1)
    },
    handleRemove(id) {
      const itemIndex = this.defaultMenu.favorites.findIndex(item => item.shopify_product_id === id)
      this.defaultMenu.favorites.splice(itemIndex, 1)
    },
    getProdObject(id) {
      return this.allProducts.find(product => product.variants.find(varn => varn.id === id))
    },
    async setNewDfMenu() {
      this.newDfMenuArr = []
      const arrSet = await this.defaultMenu.favorites.map(async prod => {
        const product = await this.getProdObject(prod.shopify_variant_id)
        let qty = prod.quantity
        let newMeal = { ...product }

        if (newMeal) {
          newMeal.quantity = qty
          if (newMeal.variants.length > 1) {
            prod.shopify_variant_id === newMeal.variants[1].id
              ? (newMeal.upsellId = prod.shopify_variant_id)
              : delete newMeal.upsellId
          } else {
            delete newMeal.upsellId
          }
          this.newDfMenuArr.push(newMeal)
        }
      })
      if (arrSet) this.SET_DEFAULT_MENU_ITEMS(this.newDfMenuArr)
    },
    async newSaveFromDefaultMenu() {
      stillProcessingWarningPopup()
      try {
        const update = await this.customerUpdatePlanToDFMenu({
          addressId: this.addressId,
          updates: [...this.subsUpdateFromDfMenu],
          deletes: [...this.subscriptionIds]
        })

        if (update && this.isNextSkipped) {
          await delay(101)
          await this.resetResources()
          await delay(101)
          await this.reskipCharge()
        }
        this.btnloading = false
        this.saveCta.successMessageVisibility = true
        // await this.resetResources()
        // await delay(250)
        // if(update) this.UI_TOGGLE_DEFAULT_MENU(false)
        if (update) {
          removeReloadWarning()
          setTimeout(() => {
            location.reload()
          }, 375)
        }
      } catch (error) {
        console.error(error)
      }
    },
    async reskipCharge() {
      console.log(this.subscriptionIds)
      const res = await this.customerChargesSkip({
        addressId: this.addressId,
        updates: [
          {
            id: this.nextUpcomingCharge[0].id,
            subscription_ids: this.subscriptionIds
          }
        ]
      })
    },
    async handleSaveDefaultMenu() {
      this.submitting = true
      this.btnloading = true
      const defaultMenu = await this.customerSetDefaultMenu({
        email: this.customerRecharge.email,
        favorites: this.defaultMenu.favorites
      })
      if (defaultMenu) this.newDfSet = true
      await this.setNewDfMenu()
      sessionStorage.setItem('default_menu', JSON.stringify(this.defaultMenu.favorites))
      this.CUSTOMER_SET_NEWSELECTEDMENU(true)
      this.saveCta.successMessageVisibility = true
      const storedDFMJson = sessionStorage.getItem('default_menu')
      this.storedDefaultMenu = JSON.parse(storedDFMJson)

      // if(this.isDefaultMenu && defaultMenu) {
      //   setTimeout(async()=>{
      //     this.newSaveFromDefaultMenu();
      //   },1500)
      // } else {
      //   this.submitting = false;
      //   this.btnloading = false;
      //   setTimeout(() => {
      //     this.saveCta.successMessageVisibility = false
      //   }, 1500);
      // }
    },
    async resetResources() {
      const { success, error } = await this.customerSetResources({
        resources: ['charges', 'subscriptions', 'addresses']
      })
    },
    handleUpsellOptIn(item, upsellId) {
      const itemm = this.defaultMenu.favorites.find(itm => itm.shopify_product_id === item)
      itemm.shopify_variant_id = upsellId
      this.upselled = upsellId
    },
    handleUpsellOptOut(item, upsellId) {
      const itemm = this.defaultMenu.favorites.find(itm => itm.shopify_product_id === item)
      itemm.shopify_variant_id = upsellId
      this.upselled = ''
    }
    // TESTfuncManullySetDfMenu(){
    //   this.customerUpcomingCharges[0]?.lineItems.map(product => { //ideally change this to be first order/checkout
    //     return this.defaultMenu.favorites.push({
    //       shopify_product_id: product.productId,
    //       shopify_variant_id: product.variantId,
    //       quantity: product.quantity || 1
    //     });
    //   })
    // }
  },
  beforeDestroy() {
    document.getElementsByTagName('body')[0].classList.remove('o-body--noScroll')
  },
  created() {
    // remove non-existing products from favorites
    this.defaultMenu.favorites = this.defaultMenu.favorites.filter(item => {
      return this.getProductObject(item.shopify_product_id)
    })

    sessionStorage.setItem('default_menu', JSON.stringify(this.defaultMenu.favorites))
    const isDefault = sessionStorage.getItem('isDefaultMenu')
    if (isDefault) this.isDefaultMenu = true
  },
  async mounted() {
    document.getElementsByTagName('body')[0].classList.add('o-body--noScroll')
    const storedDFMJson = sessionStorage.getItem('default_menu')
    this.storedDefaultMenu = JSON.parse(storedDFMJson)
    await this.resetResources()

    // const { success, error } = await this.customerSetResources({
    //   resources: ['charges', 'subscriptions']
    // })
  },
  watch: {
    defaultMenuItems() {
      if (this.isDefaultMenu && this.newDfSet && !this.pastCutoffEST) {
        setTimeout(async () => {
          this.newSaveFromDefaultMenu()
          this.newDfSet = false
        }, 1000)
      } else {
        this.submitting = false
        this.btnloading = false
        setTimeout(() => {
          this.saveCta.successMessageVisibility = false
          this.newDfSet = false
        }, 1850)
      }
    }
  },
  components: {
    cIcon,
    cButton,
    cProduct,
    cLineItem
    // cShipmentsNoFmpAppReturn
  }
}
</script>

<style lang="scss">
.c-textHero {
  padding: 43px 0;
  border-bottom: 1px solid $color-paleo;
}
.c-textHero__heading {
  font-size: 32px;
  margin-bottom: 16px;
}
.c-textHero__copy {
  line-height: 1.5;
  max-width: 585px;
  margin: 0 auto;
}
.c-cta--small {
  font-size: 12px;
}
.c-basket__ctas {
  .c-loading__wheel {
    animation: 1.25s linear infinite spin;
    border: 4px dashed;
  }
}
</style>
