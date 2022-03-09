<template>
  <div class="c-basketPage c-addOnsStep">
    <c-bundle-nav currentStepTitle="Fresh+ Add-Ons" />
    <div class="u-hideMobile">
      <div class="c-heroShort">
        <div class="o-containerLarge">
          <div class="c-heroShort__inner">
            <h2 class="c-heroShort__heading c-h2">
              {{ addOns.content.title }}
            </h2>
            <div class="c-heroShort__text" v-html="addOns.content.text"></div>
            <button class="c-heroShort__cta c-cta" @click="!account ? $router.push(navigation.links[3].url) : handleActiveStepInc()">
              {{ !account ? addOns.content.cta_text : "No Thanks, Review Your Order" }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="c-sticky u-bgOffWhite">
      <div class="c-infoBar">
       {{ addOnsAvailable }} FRESH+ Items available for {{ currentDate }}
      </div>
      <div class="u-hideDesktop">
        <c-menu
          title="Sort"
          :open="sortOpen"
          :selection="currentSort.title"
          @toggle="sortOpen = !sortOpen"
          @close="sortOpen = false"
        >
          <div v-for="option in sortOptions" class="c-menu__item-wrapper" :key="option.title">
            <div
              :class="['c-menu__item', {
                'c-menu__item--active': option.handle === currentSort.handle
              }]"
              :key="option.title"
              @click="() => handleSort(option.handle)"
            >
              {{ option.title }}
            </div>
          </div>
        </c-menu>
      </div>
    </div>
    <div class="o-containerLarge">
      <div class="c-bundleGrid">
        <div class="c-bundleGrid__meals">
          <div class="u-hideMobile">
            <div class="c-bundleGrid__menu">
              <c-menu
                title="Sort"
                :open="sortOpen"
                :selection="currentSort.title"
                @toggle="sortOpen = !sortOpen"
                @close="sortOpen = false"
              >
                <div v-for="option in sortOptions" class="c-menu__item-wrapper" :key="option.title">
                  <div
                    :class="['c-menu__item', {
                      'c-menu__item--active': option.handle === currentSort.handle
                    }]"
                    :key="option.title"
                    @click="() => handleSort(option.handle)"
                  >
                    {{ option.title }}
                  </div>
                </div>
              </c-menu>
            </div>
          </div>
          <div v-for="collection in addOns.collections" :key="collection.id">
            <header class="c-collectionHeader">
              <h4 class="c-collectionHeader__heading c-h4">{{ collection.title }}</h4>
              <div class="c-collectionHeader__description u-hideMobile" v-html="collection.short_description"></div>
            </header>
            <div class="c-productGrid">
              <div class="c-productGrid__item" v-for="product in sortCollection(collection.products)" :key="product.id">
                <c-product
                  :displayPrice="true"
                  isAddOn
                  tag="Fresh+"
                  :liked="favoritesIds.includes(product.id)"
                  :likable="account"
                  :product="product"
                  :collection="collection"
                  :quantity="getItemQuantityByType(product.id, 'addOns')"
                  @qtyIncrease="() => handleQtyIncrease(product)"
                  @qtyDecrease="() => handleQtyDecrease(product)"
                  @toggleLiked="() => handleToggleFavorited(product, favoritesIds.includes(product.id))"
                  @storeAddOnState="setAddOnItems"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="u-hideMobile">
          <div class="c-basketSticky">
            <div class="c-basket">
              <header class="c-basket__header">
                <h3 class="c-basket__title c-h3">My Meals</h3>
                <p class="c-basket__text">{{ totalMealsSelected }} Items Selected</p>
              </header>
              <div class="c-basket__items">
                <div class="c-basket__accordion">
                  <div :class="['c-basket__accordion-toggle u-pointer', {
                    'c-basket__accordion-toggle--open': showPlanItems
                  }]" @click="showPlanItems = !showPlanItems">
                    <h5 class="c-basket__accordion-title c-h5">{{ bundle.size }} Meal Plan</h5>
                    <div class="c-basket__accordion-info">
                      {{ mealsSelected }} items
                      <c-icon icon="chevron" />
                    </div>
                  </div>
                  <div v-show="showPlanItems" class="c-basket__accordion-items">
                    <div class="c-basket__item" v-for="child in bundle.children" :key="child.id">
                      <c-line-item
                        preventEdit
                        :product="child"
                        :quantity="getItemQuantityByType(child.id, 'children')"
                        @upsellOptIn="upsellId => handleUpsellOptIn(child, upsellId)"
                        @upsellOptOut="() => handleUpsellOptOut(child)"
                      />
                    </div>
                  </div>
                </div>
                <div class="c-basket__accordion">
                  <div class="c-basket__accordion-toggle">
                    <h5 class="c-basket__accordion-title c-h5">Fresh+ Add-Ons</h5>
                    <div class="c-basket__accordion-info">
                      {{ totalAddOns }} items
                    </div>
                  </div>
                  <div class="c-basket__accordion-items">
                    <div v-if="account && !bundle.addOns.length" class="c-basket__message">
                      <button class="c-basket__prefill" v-if="addOnsFavorites.length" @click="handleAddFavorites">
                        Pre-fill with Your Favorites
                      </button>
                    </div>
                    <div class="c-basket__item" v-for="child in bundle.addOns" :key="child.id">
                      <c-line-item
                        isAddOn
                        :product="child"
                        :quantity="getItemQuantityByType(child.id, 'addOns')"
                        @qtyIncrease="() => handleQtyIncrease(child)"
                        @qtyDecrease="() => handleQtyDecrease(child)"
                        @remove="() => handleChildRemove(child)"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="c-basket__price">
                Add-On Items
              </div>
              <div class="c-basket__cta-wrapper">
                <button class="c-cta c-cta--tall" @click="!account ? $router.push(navigation.links[3].url) : handleActiveStepInc()">
                  <span v-if="!account && totalAddOns > 0">
                    Review &amp; Checkout
                  </span>
                  <span v-if="account && totalAddOns > 0">
                    Review &amp; Order
                  </span>
                  <span v-else-if="account">
                    No Thanks, Review Your Order
                  </span>
                  <span v-if="!account && totalAddOns < 1">
                    No Thanks, Continue to Checkout
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="u-hideDesktop">
          <div :class="['c-basketMobile', {
            'c-basketMobile--open': basketOpen
          }]">
            <div class="c-basketMobile__inner">
              <div class="c-basketMobile__info">
                <div>
                  <h4 class="c-basketMobile__heading c-h4">
                    Fresh+ Add-Ons
                  </h4>
                </div>
                <div class="c-basketMobile__text u-colorBroccoli">
                  {{ totalMealsSelected }} Items
                  <div class="c-basketMobile__toggle" @click="() => basketOpen = !basketOpen">
                    <c-icon icon="chevron" />
                  </div>
                </div>
              </div>
              <div class="c-basketMobile__items">
                <div v-if="account && !bundle.addOns.length" class="c-basket__message">
                  <div class="c-basket__message-inner">
                    <h4 class="c-basket__message-title c-h4">
                      You have 0 FRESH+ Add-Ons
                    </h4>
                  </div>
                  <button class="c-basket__prefill" v-if="addOnsFavorites.length" @click="handleAddFavorites">
                    Pre-fill with Your Favorites
                  </button>
                </div>
                <div class="c-basket__item" v-for="child in bundle.addOns" :key="child.id">
                  <c-line-item
                    isAddOn
                    :product="child"
                    :quantity="getItemQuantityByType(child.id, 'addOns')"
                    @qtyIncrease="() => handleQtyIncrease(child)"
                    @qtyDecrease="() => handleQtyDecrease(child)"
                    @remove="() => handleChildRemove(child)"
                  />
                </div>
              </div>
              <div class="c-basket__price">
                Add-On Items
              </div>
              <div class="c-basketMobile__cta">
                <button
                  class="c-cta c-cta--extraTall"
                  @click="!account ? $router.push(navigation.links[3].url) : handleActiveStepInc();
                    showPromoBar();"
                >
                  <span v-if="!account && totalAddOns > 0">
                    Review &amp; Checkout
                  </span>
                  <span v-if="account && totalAddOns > 0">
                    Review &amp; Order
                  </span>
                  <span v-if="account && totalAddOns < 1">
                    No Thanks, Review Your Order
                  </span>
                  <span v-if="!account && totalAddOns < 1">
                    No Thanks, Continue to Checkout
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
  import { handleize } from '../../utils';
  import moment from 'moment';
  import cBundleNav from '../parts/cBundleNav.vue';
  import cFilter from '../parts/cFilter.vue';
  import cMenu from '../parts/cMenu.vue';
  import cProgressBar from '../parts/cProgressBar.vue';
  import cProduct from '@shared/components/core/cProduct.vue';
  import cIcon from '@shared/components/core/cIcon.vue';
  import cLineItem from '@shared/components/core/cLineItem.vue';
  import { apiService } from '@shared/services'

  export default {
    data() {
      return {
        sort: 'best-seller',
        sortOpen: false,
        sortOptions: [],
        basketOpen: false,
        showPlanItems: true
      }
    },
    created() {
      this.sortOptions = this.account ? this.sortOptionsExistingCustomer : this.sortOptionsNewCustomer;
    },
    computed: {
      ...mapState([
        'bundle',
        'children',
        'addOns',
        'navigation',
        'account',
        'sortOptionsNewCustomer',
        'sortOptionsExistingCustomer',
        'customer',
        'activeStep'
      ]),
      ...mapGetters([
        'addOnsAvailable',
        'mealsSelected',
        'totalMealsSelected',
        'totalAddOns',
        'favoritesIds',
        'allAddOns'
      ]),
      currentDate() {
        const date = moment().format('dddd, MMMM Do');
        return date;
      },
      currentSort() {
        return this.sortOptions.find(option => option.handle === this.sort);
      },
      addOnsFavorites() {
        return this.allAddOns.filter(product => this.favoritesIds.includes(product.id));
      },
      lastPage() {
        return document.referrer;
      }      
    },
    methods: {
      ...mapMutations([
        'BUNDLE_ADD_ADDON',
        'BUNDLE_SELECT_PLAN',
        'BUNDLE_REMOVE_ADDON',
        'BUNDLE_UPSELL_OPTIN',
        'BUNDLE_UPSELL_OPTOUT',
        'BUNDLE_CHANGE_ACTIVE_STEP'
      ]),
      ...mapActions('customer', ['customerUpdateAddressItems','customerCreateSubscriptions']),
      handleActiveStepInc() {
        this.BUNDLE_CHANGE_ACTIVE_STEP([null, 'inc']);
      },
      showPromoBar() {
        const $promoBar = document.querySelector('.c-header');
        if (!$promoBar) return;
        $promoBar.style.display = '';
      },
      handleFilter(handle) {
        this.filter = handle;
      },
      handleSort(sort) {
        this.sort = sort;
        this.sortOpen = false;
      },
      handleQtyIncrease(item) {
        const newItem = this.bundle.addOns.find(child => child.id === item.id)
        if (!newItem) {
          item.quantity = 1;
          this.BUNDLE_ADD_ADDON(item);
        } else {
          newItem.quantity++;
          this.BUNDLE_ADD_ADDON(newItem);
        }
       // this.setAddOnsItems();
      },
      handleQtyDecrease(item) {
        const newItem = this.bundle.addOns.find(child => child.id === item.id);
        newItem.quantity--;
        if (newItem.quantity < 1) {
          this.BUNDLE_REMOVE_ADDON(newItem);
        } else {
          this.BUNDLE_ADD_ADDON(newItem);
        }
        //this.setAddOnsItems();
      },
      handleChildRemove(item) {
        const newItem = this.bundle.addOns.find(oldItem => oldItem.id === item.id);
        this.BUNDLE_REMOVE_ADDON(newItem);
        //this.setAddOnsItems();
      },
      handleUpsellOptIn(item, upsellId) {
        this.BUNDLE_UPSELL_OPTIN({
          item,
          upsellId,
        });
      },
      handleUpsellOptOut(item) {
        delete item.upsellId;
        this.BUNDLE_UPSELL_OPTOUT(item);
      },
      getItemQuantityByType(id, type) {
        const item = this.bundle[type].find(item => item.id === id);
        return item ? item.quantity : 0;
      },
      sortCollection(products) {
        const sortedProducts = [...products]
        sortedProducts.sort(product => {
          return handleize(product.flag) === this.sort ? -1 : 0;
        });
        return sortedProducts;
      },
      async handleToggleFavorited(product) {
        const tag = `favorite::${product.id}`;
        const customerTags = this.customer.tags;
        const tagIndex = customerTags.findIndex(customerTag => customerTag === tag);

        if (tagIndex === -1) {
          customerTags.push(tag);
        } else {
          customerTags.splice(tagIndex, 1);
        }
        await this.customer.handleFavorites({
          updates: {
            tags: customerTags
          }
        })
      },
      handleAddFavorites() {
        this.addOnsFavorites.forEach(favorite => {
          this.BUNDLE_ADD_ADDON(favorite)
        })
      },
      setAddOnItems() {
        sessionStorage.setItem(
          "addon_content",
          JSON.stringify(this.bundle.addOns)
        );
      },
      async reinstateCartAfterPDP() {
        const getAddons = sessionStorage.getItem("addon_content");
        if (getAddons) {
          const makeJsonn = JSON.parse(getAddons);
          this.bundle.addOns = makeJsonn;
        }
      },      
      async addItemToCartFromPDP() {
        const getItemm = sessionStorage.getItem("addcart_item");
        const isAddOnPdp = sessionStorage.getItem("is_addOn");
        if (getItemm && isAddOnPdp === 'true') {
          const makeJson = JSON.parse(getItemm);
          if (this.lastPage.includes("/products/")) {
            this.BUNDLE_ADD_ADDON(makeJson);     
          }
          setTimeout(() => {
            sessionStorage.removeItem("addcart_item");
            sessionStorage.removeItem("is_addOn");
          }, 1250);
        }
      }    
    },
    async mounted(){
      await this.reinstateCartAfterPDP();
      this.addItemToCartFromPDP();
    },
    updated() {      
      this.setAddOnItems();
    },    
    components: {
      cBundleNav,
      cProduct,
      cLineItem,
      cIcon,
      cFilter,
      cMenu,
      cProgressBar
    }
  }
</script>
