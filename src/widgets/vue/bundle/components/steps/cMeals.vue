<template>
  <div class="c-basketPage c-mealsStep u-relative" v-if="account || userSelectedPlan">
    <div class="nav__wrapper">
      <c-bundle-nav
        :currentStepTitle="`Choose at Least ${ userSelectedPlan.minimum } Meals`"
      />
      <div class="u-hideMobile">
        <div v-if="!account" class="c-heroShort">
          <div class="o-containerLarge">
            <h2 class="c-heroShort__heading c-h2">
              Choose {{
                userSelectedPlan.minimum
              }} Meals
            </h2>
          </div>
        </div>
      </div>
    </div>
    <div class="c-sticky u-bgOffWhite" ref="filter">
      <div class="c-infoBar">
        <div class="o-containerLarge">
          {{ mealsAvailableText }}
          <button class="c-infoBar__btn" @click="handleScrollToTop">
            Back to Top &nbsp;&nbsp;↑
          </button>
        </div>
      </div>
      <div class="c-filters">
        <div class="c-filters__label">
          <c-icon icon="filters" />
          Filter By:
        </div>
        <div v-if="!account" class="c-filters__scroll">
          <ul class="c-filters__list">
            <li class="c-filters__list-item">
              <c-filter
                title="All Meals"
                :active="!mealTypes.length"
                @filtered="handleClearFilters"
              />
            </li>
            <li v-for="collection in availableCollections" class="c-filters__list-item"
              :key="collection.id"
            >
              <c-filter
                :title="collection.custom_title || collection.title"
                :active="!!mealTypes.find(type => type.handle === collection.handle)"
                @filtered="() => handleFilter(collection, 'mealTypes', false)"
              />
            </li>
          </ul>
        </div>
        <div v-else class="c-filters__menus-grid">
          <div class="u-hideMobile">
            <div :class="['c-filters__filters', {
              'c-filters__filters--clear': hasFilter
            }]">
              <div class="c-filters__filters-group">
                <!-- :selection="`(${mealTypes.length})`" -->
                <c-menu
                  title="Meal Type"
                  :open="mealTypesOpen"
                  :selectedOptions="mealTypes"
                  :selection="mealTypes.length ? mealTypes.length : null"
                  @toggle="mealTypesOpen = !mealTypesOpen"
                  @close="mealTypesOpen = false"
                >
                  <div class="c-menu__item-wrapper">
                    <div class="c-menu__checkboxes">
                      <div v-for="collection in availableCollections"
                        class="c-menu__checkbox"
                        :key="collection.id"
                      >
                        <c-checkbox
                          :title="collection.custom_title || collection.title"
                          :checked="!!pendingMealTypes.find(type => type.handle === collection.handle)"
                          @checked="() => handleFilter(collection, 'pendingMealTypes')"
                        />
                      </div>
                    </div>
                    <div class="c-menu__cta">
                      <button class="c-cta" @click.stop="() => handleApplyFilter('mealTypes', 'pendingMealTypes')">
                        Apply
                      </button>
                    </div>
                  </div>
                </c-menu>
                <c-menu
                  title="Protein"
                  :open="proteinsOpen"
                  :selectedOptions="proteins"
                  :selection="proteins.length ? proteins.length : null"
                  @toggle="proteinsOpen = !proteinsOpen"
                  @close="proteinsOpen = false"
                >
                  <div class="c-menu__item-wrapper">
                    <div class="c-menu__checkboxes">
                      <div v-for="type in types"
                        class="c-menu__checkbox"
                        :key="type"
                      >
                        <c-checkbox
                          :title="type"
                          :checked="pendingProteinsDowncase.includes(type.toLowerCase())"
                          @checked="() => handleFilter(type, 'pendingProteins')"
                        />
                      </div>
                    </div>
                    <div class="c-menu__cta">
                      <button class="c-cta" @click.stop="() => handleApplyFilter('proteins', 'pendingProteins')">
                        Apply
                      </button>
                    </div>
                  </div>
                </c-menu>
                <div>
                  <c-menu
                    title="Preference"
                    :open="preferencesOpen"
                    :removeDislikes="removeDislikes"
                    :showLikes="showLikes"
                    @toggle="preferencesOpen = !preferencesOpen"
                    @close="preferencesOpen = false"
                  >
                    <div class="c-menu__item-wrapper">
                      <div class="c-menu__checkboxes">
                        <div class="c-menu__checkbox">
                          <c-checkbox
                            title="Show Things I Like"
                            :checked="showLikes"
                            @checked="showLikes = !showLikes"
                          />
                        </div>
                        <div class="c-menu__checkbox">
                          <c-checkbox title="Remove Things I Dislike"
                            :checked="removeDislikes"
                            @checked="removeDislikes = !removeDislikes"
                          />
                        </div>
                      </div>
                      <div class="c-menu__cta">
                        <button class="c-cta" type="submit">
                          Apply
                        </button>
                      </div>
                    </div>
                  </c-menu>
                  <button v-if="hasFilter" class="c-filters__clear" @click="handleClearFilters">
                    Clear All
                  </button>
                </div>
              </div>
              <div>
                <c-menu
                  title="Sort"
                  :open="sortOpen"
                  :selection="currentSort ? currentSort.title : null"
                  @toggle="sortOpen = !sortOpen"
                  @close="sortOpen = false"
                >
                  <div v-for="option in sortOptions" class="c-menu__item-wrapper" :key="option.title">
                    <div
                      :class="['c-menu__item u-textCenter', {
                        'c-menu__item--active': currentSort && option.handle === currentSort.handle
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
          </div>
          <div class="u-hideDesktop">
            <div class="c-filters__wrapper">
              <div :class="['c-filters__toggle', {
                  'c-filters__toggle--open': filtersOpen
                }]"
                @click="() => {
                  sortMobileOpen = false;
                  filtersOpen = !filtersOpen;
                }"
              >
                Filter: <c-icon icon="chevron" />
              </div>
              <div :class="['c-filters__toggle', {
                  'c-filters__toggle--open': sortMobileOpen
                }]"
                @click="() => {
                  filtersOpen = false;
                  sortMobileOpen = !sortMobileOpen;
                }"
              >
                {{ currentSort ? currentSort.title : 'Sort:' }} <c-icon icon="chevron" />
              </div>
            </div>
            <div v-if="filtersOpen" class="c-filters__menus">
              <div class="c-filters__menu">
                <h4 class="c-filters__menu-title c-h4">
                  Meal Type
                </h4>
                <div v-for="collection in availableCollections"
                  class="c-menu__checkbox"
                  :key="collection.id"
                >
                  <c-checkbox
                    :title="collection.custom_title || collection.title"
                    :checked="!!pendingMealTypes.find(type => type.handle === collection.handle)"
                    @checked="() => handleFilter(collection, 'pendingMealTypes')"
                  />
                </div>
              </div>
              <div class="c-filters__menu">
                <h4 class="c-filters__menu-title c-h4">
                  Protein
                </h4>
                <div v-for="type in types"
                  class="c-menu__checkbox"
                  :key="type"
                >
                  <c-checkbox
                    :title="type"
                    :checked="pendingProteinsDowncase.includes(type.toLowerCase())"
                    @checked="() => handleFilter(type, 'pendingProteins')"
                  />
                </div>
              </div>
              <div class="c-filters__menu">
                <div class="c-filters__menu-line">
                  <h4 class="c-filters__menu-title c-h4">
                    Preference
                  </h4>
                  <!-- <button class="u-btnUnset c-filters__menu-btn">
                    Edit
                  </button> -->
                </div>
                <div class="c-menu__checkbox">
                  <c-checkbox :checked="showLikes" @checked="showLikes = !showLikes" title="Show Things I Like" />
                </div>
                <div class="c-menu__checkbox">
                  <c-checkbox title="Remove Things I Dislike"
                    :checked="removeDislikes"
                    @checked="removeDislikes = !removeDislikes"
                  />
                </div>
              </div>
              <div class="c-filters__menu-controls">
                <div class="c-filters__menu-control">
                  <button class="c-cta c-cta--secondary" @click="handleClearFilters">
                    Clear Filters
                  </button>
                </div>
                <div class="c-filters__menu-control">
                  <button class="c-cta" @click="handleApplyFilterMobile">
                    Apply
                  </button>
                </div>
              </div>
            </div>
            <div v-if="sortMobileOpen" class="c-menu-wrapper">
              <div class="c-menu-overlay" @click="sortMobileOpen = false"></div>
              <div class="c-menu c-menu--open">
                <div v-for="option in sortOptions" class="c-menu__item-wrapper" :key="option.title">
                  <div
                    :class="['c-menu__item', {
                      'c-menu__item--active': currentSort && option.handle === currentSort.handle
                    }]"
                    :key="option.title"
                    @click="() => handleSort(option.handle)"
                  >
                    {{ option.title }}
                    <c-icon icon="checkmark" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="u-hideDesktop" v-if="!account">
        <c-menu
          title="Sort"
          :open="sortOpen"
          :selection="currentSort ? currentSort.title : null"
          @toggle="sortOpen = !sortOpen"
          @close="sortOpen = false"
        >
          <div v-for="option in sortOptions" class="c-menu__item-wrapper" :key="option.title">
            <div
              :class="['c-menu__item', {
                'c-menu__item--active': currentSort && option.handle === currentSort.handle
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
      <div :class="['c-bundleGrid', {
        'c-bundleGrid--favorites': showFavoritesCarousel
      }]">
        <div class="c-bundleGrid__meals">
          <div v-if="!account" class="u-hideMobile">
            <div class="c-bundleGrid__menu">
              <c-menu
                title="Sort"
                :open="sortOpen"
                :selection="currentSort ? currentSort.title : null"
                @toggle="sortOpen = !sortOpen"
                @close="sortOpen = false"
              >
                <div v-for="option in sortOptions" class="c-menu__item-wrapper" :key="option.title">
                  <div
                    :class="['c-menu__item', {
                      'c-menu__item--active': currentSort && option.handle === currentSort.handle
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
          <div v-if="account && hasFilter">
            <header class="c-collectionHeader">
              <h4 class="c-collectionHeader__heading c-h4">Showing {{ filteredProducts.length }} Results</h4>
            </header>
            <div class="c-productGrid">
              <div class="c-productGrid__item qwee" v-for="product in filteredProducts" :key="product.id">
                <c-product
                  :product="product"
                  :likable="true"
                  :liked="favoritesIds.includes(product.id)"
                  :quantity="getItemQuantity(product.id)"
                  :dislikes="customerDislikes"
                  :mealspage="true"
                  @qtyIncrease="() => handleQtyIncrease(product)"
                  @qtyDecrease="() => handleQtyDecrease(product)"
                  @toggleLiked="() => handleToggleFavorited(product)"
                />
              </div>
            </div>
          </div>
          <div v-else>
            <div v-for="collection in filteredCollections" :key="collection.id">
              <header v-if="mealTypes.length === 0" class="c-collectionHeader">
                <h4 class="c-collectionHeader__heading c-h4">{{ collection.custom_title || collection.title }}</h4>
                <div class="c-collectionHeader__description u-hideMobile" v-html="collection.short_description"></div>
              </header>
              <header v-else class="c-collectionHeader c-collectionHeader--filter">
                <h4 class="c-collectionHeader__heading c-h4">
                  Showing <span class="u-colorBroccoli">{{ mealTypes[0].title }}</span>
                </h4>
              </header>
              <div class="c-productGrid">
                <div class="c-productGrid__item" v-for="product in sortProducts(collection.products)" :key="product.id">
                  <c-product
                    :product="product"
                    :likable="account"
                    :liked="favoritesIds.includes(product.id)"
                    :dislikes="customerDislikes"
                    :mealspage="true"
                    :quantity="getItemQuantity(product.id)"
                    @qtyIncrease="() => handleQtyIncrease(product)"
                    @qtyDecrease="() => handleQtyDecrease(product)"
                    @toggleLiked="() => handleToggleFavorited(product)"
                    @storeBundleState="setBundleItems"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="u-hideMobile">
          <div class="c-basketSticky">
            <div class="c-basket">
              <header class="c-basket__header">
                <h3 class="c-basket__title c-h3">My Meals</h3>
                <p class="c-basket__text">
                  <span v-if="basketQty < userSelectedPlan.minimum">
                    {{ basketQty }}/{{ userSelectedPlan.minimum }} Meals Selected
                  </span>
                  <span v-else>{{ basketQty }} Meals Selected</span>
                </p>
              </header>
              <div class="c-basket__items">
                <div v-if="account && !bundle.children.length" class="c-basket__message">
                  <div class="c-basket__message-inner">
                    <h4 class="c-basket__message-title c-h4">
                      Your meal plan is empty!
                    </h4>
                    <template v-if="minimumMeals !== 1">
                      {{ `Add at least ${minimumMeals} meals to continue` }}
                    </template>
                    <template v-else>
                      {{ `Add at least ${minimumMeals} meal to continue` }}
                    </template>
                  </div>
                  <button class="c-basket__prefill" v-if="storedDefaultMenu.length" @click="handleAddDefaultMenu">
                    Pre-fill with Default Menu
                  </button>
                </div>
                <div v-else>
                  <div class="c-basket__item" v-for="child in bundle.children" :key="child.id">
                    <c-line-item
                      :product="child"
                      :quantity="getItemQuantity(child.id)"
                      :showUpsell="account"
                      @qtyIncrease="() => handleQtyIncrease(child)"
                      @qtyDecrease="() => handleQtyDecrease(child)"
                      @remove="() => handleChildRemove(child)"
                      @upsellOptIn="upsellId => handleUpsellOptIn(child, upsellId)"
                      @upsellOptOut="() => handleUpsellOptOut(child)"
                    />
                  </div>
                </div>
              </div>
              <div class="c-basket__price">
                {{ planPrice }} Per Meal
                <!-- {{ userSelectedPlanPrice }} -->
                <div v-if="showNotification" class="c-notification-wrapper">
                  <div class="c-notification">
                    <p class="c-notification__title">
                      Upgraded to {{ selectedPlan.minimum }} Meal Plan!
                    </p>
                    You saved an additional {{ planSavings }} per meal!
                  </div>
                </div>
              </div>
              <div class="c-basket__cta-wrapper">
                <button class="c-cta c-cta--tall" :disabled="!userSelectedPlan.subscription && !bundleComplete || !bundleCompleteMinMeals" @click="handleNextStep">
                  <span
                    v-if="
                      !userSelectedPlan.subscription && bundleComplete
                      || userSelectedPlan.subscription && bundleCompleteMinMeals"
                    >
                      Continue to Add-Ons
                  </span>
                  <span v-else>Add {{
                      userSelectedPlan.subscription ? remainingMealsMinM : remainingMeals
                    }} More<template v-if="remainingMealsMinM !== 1"> Meals </template><template v-else> Meal </template>to Continue
                  </span>
                  </span>
                </button>
                <div class="c-basket__progress" v-show="showProgressBar">
                  <c-progress-bar :percentComplete="percentBundleComplete" />
                  <div class="c-basket__upsell-text" v-if="nextPlan">
                      Add {{ nextPlanDifference }} More<template v-if="nextPlanDifference !== 1"> Meals </template><template v-else> Meal </template>Save 10% Off
                  </div>
                </div>
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
                    My Meals
                  </h4>
                </div>
                <div class="c-basketMobile__text u-colorBroccoli">
                  {{ basketQty < userSelectedPlan.minimum
                    ? `${basketQty}/${userSelectedPlan.minimum}`
                    : basketQty }} Meals
                  <div class="c-basketMobile__toggle" @click="() => basketOpen = !basketOpen">
                    <c-icon icon="chevron" />
                  </div>
                </div>
              </div>
              <div class="c-basketMobile__items">
                <div v-if="account && !bundle.children.length" class="c-basket__message">
                  <div class="c-basket__message-inner">
                    <h4 class="c-basket__message-title c-h4">
                      Your meal plan is empty!
                    </h4>
                    {{ `Add at least ${remainingMealsMinM} meals to continue` }}
                  </div>
                  <button class="c-basket__prefill" v-if="storedDefaultMenu.length" @click="handleAddDefaultMenu">
                    Pre-fill with Default Menu
                  </button>
                </div>
                <div class="c-basketMobile__item" v-for="child in bundle.children" :key="child.id">
                  <c-line-item
                    :product="child"
                    :quantity="getItemQuantity(child.id)"
                    :showUpsell="account"
                    @qtyIncrease="() => handleQtyIncrease(child)"
                    @qtyDecrease="() => handleQtyDecrease(child)"
                    @remove="() => handleChildRemove(child)"
                    @upsellOptIn="upsellId => handleUpsellOptIn(child, upsellId)"
                    @upsellOptOut="() => handleUpsellOptOut(child)"
                  />
                </div>
              </div>
              <div>
                <div class="c-basket__price">
                  {{ planPrice }} Per Meal
                 <!--   Once plans become dynamic vs hardcoded, we can update these formulas
                  {{this.plans.products[0].minimum}}     -->
                  <div v-if="showNotification && basketOpen" class="c-notification-wrapper">
                    <div class="c-notification">
                      <p class="c-notification__title">
                        Upgraded to {{ selectedPlan.minimum }} Meal Plan!
                      </p>
                      You saved an additional {{ planSavings }} per meal!
                    </div>
                  </div>
                </div>
                <div class="c-basketMobile__cta">
                  <div v-if="showNotification && !basketOpen" class="c-notification-wrapper">
                    <div class="c-notification">
                      <p class="c-notification__title">
                        Upgraded to {{ selectedPlan.minimum }} Meal Plan!
                      </p>
                      You saved an additional {{ planSavings }} per meal!
                    </div>
                  </div>
                  <button class="c-cta c-cta--extraTall tree" :disabled="!bundleCompleteMinMeals" @click="handleNextStep">
                    <span v-if="bundleCompleteMinMeals">Continue to Add-Ons</span>
                    <span v-else>Add {{
                      userSelectedPlan.subscription ? remainingMealsMinM : remainingMeals
                    }} More Meals to Continue</span>
                  </button>
                </div>
                <div class="c-basketMobile__progress" v-show="showProgressBar">
                  <c-progress-bar :percentComplete="percentBundleComplete" />
                  <div class="c-basket__upsell-text" v-if="nextPlan">
                    Add {{ nextPlanDifference }} More Meals to Save 10% Off
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="c-productSlider u-bgPearl" v-if="account && showFavoritesCarousel">
      <div class="o-containerLarge">
        <div class="c-productSlider__grid">
          <div>
            <header class="c-collectionHeader">
              <h4 class="c-collectionHeader__heading c-h4">Your Favorites</h4>
            </header>
            <div class="c-productSlider__wrapper">
              <button class="c-productSlider__arrow c-productSlider__arrow--prev" @click="handleSlidePrev">
                <c-icon icon="chevron" />
              </button>
              <button class="c-productSlider__arrow c-productSlider__arrow--next" @click="handleSlideNext">
                <c-icon icon="chevron" />
              </button>
              <hooper ref="carousel" :settings="hooperSettings">
                <slide v-for="product in favorites" :key="product.id">
                  <c-product
                    :product="product"
                    :likable="account"
                    :liked="favoritesIds.includes(product.id)"
                    :quantity="getItemQuantity(product.id)"
                    @qtyIncrease="() => handleQtyIncrease(product)"
                    @qtyDecrease="() => handleQtyDecrease(product)"
                    @toggleLiked="() => handleToggleFavorited(product)"
                  />
                </slide>
              </hooper>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="o-container u-hideDesktop">
      <div class="c-scrollMessage">
        <h4 class="c-h4 c-scrollMessage__title">
          Clever Message Goes Here
        </h4>
        <button class="u-btnUnset c-scrollMessage__cta" @click="handleScrollToTop">
          Back to Top
        </button>
      </div>
    </div>

<!--       <div class="c-productGrid">
        <div class="c-productGrid__item ttty" v-for="product in wildcardz" :key="product.id">
          <c-product
            :product="product"
            :likable="account"
            :liked="favoritesIds.includes(product.id)"
            :quantity="getItemQuantity(product.id)"
            @qtyIncrease="() => handleQtyIncrease(product)"
            @qtyDecrease="() => handleQtyDecrease(product)"
            @toggleLiked="() => handleToggleFavorited(product)"
            @storeBundleState="setBundleItems"
          />
        </div>
      </div>  -->

    <div v-if="this.wildcard.content.display" class="u-relative wildcard-slider o-containerLarge">
      <header class="c-collectionHeader">
        <h4 class="c-collectionHeader__heading c-h4">Wildcard Carousel</h4>
      </header>
      <div class="c-menuControls__container">
          <div class="c-menuControls__control c-menuControl__prev" data-menu-prev> <c-icon icon="chevron" /></div>
          <div class="c-menuControls__control c-menuControl__next" data-menu-next> <c-icon icon="chevron" /></div>
      </div>
      <div class="c-menuSlider slider" data-menu-slider> <!-- data-menu-slider -->
           <!--  <div class="c-menuSlider__grid"> --> <!-- c-productGrid -->
              <div class="c-menuSlider__grid-item" v-for="product in wildcardz" :key="product.id">
                <c-product
                  :product="product"
                  :likable="account"
                  :liked="favoritesIds.includes(product.id)"
                  :quantity="getItemQuantity(product.id)"
                  @qtyIncrease="() => handleQtyIncrease(product)"
                  @qtyDecrease="() => handleQtyDecrease(product)"
                  @toggleLiked="() => handleToggleFavorited(product)"
                  @storeBundleState="setBundleItems"
                />
              </div>
           <!--  </div>  -->
      </div>
    </div>
  </div>
</template>


<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { formatPrice, handleize, scrollToTop } from "../../utils";
import moment from "moment";
import { Hooper, Slide, Navigation as HooperNavigation } from "hooper";
import cBundleNav from "../parts/cBundleNav.vue";
import cFilter from "../parts/cFilter.vue";
import cMenu from "../parts/cMenu.vue";
import cProgressBar from "../parts/cProgressBar.vue";
import cCheckbox from "../parts/cCheckbox.vue";
import cProduct from "@shared/components/core/cProduct.vue";
import cLineItem from "@shared/components/core/cLineItem.vue";
import cIcon from "@shared/components/core/cIcon.vue";
import { tns } from "tiny-slider/src/tiny-slider";

import "hooper/dist/hooper.css";

export default {
  name: "Meals",
  data() {
    return {
      mealTypes: [],
      pendingMealTypes: [],
      proteins: [],
      pendingProteins: [],
      filtersOpen: false,
      sort: "best-seller",
      sortOpen: false,
      sortMobileOpen: false,
      sortOptions: [],
      proteinsOpen: false,
      mealTypesOpen: false,
      preferencesOpen: false,
      basketOpen: false,
      showNotification: false,
      showLikes: false,
      removeDislikes: false,
      originalSelectedPlan: {},
      storedDefaultMenu: [],
      defaultMenuArray: [],
      hooperSettings: {
        itemsToShow: 1,
        pagination: false,
        wheelControl: false,
        mouseDrag: false,
        breakpoints: {
          768: {
            itemsToShow: 2,
          },
          1200: {
            itemsToShow: 3,
          },
        },
      },
      ...window.Scoutside.shop,
    };
  },
  created() {
    this.sortOptions = this.account
      ? this.sortOptionsExistingCustomer
      : this.sortOptionsNewCustomer;
  },
  mounted() {
    this.handleStickyFilters();
  },
  watch: {
    basketQty: function (newQty, oldQty) {
      if (this.userSelectedPlan.subscription) {        
        if (this.nextPlan) {
          if (newQty >= this.nextPlan.minimum) {
            this.BUNDLE_SELECT_PLAN(this.nextPlan)
            this.showNotification = true;
            setTimeout(() => {
              this.showNotification = false;
            }, 3000); 
          }         
        }

        if (newQty < this.selectedPlan.minimum) {            
          this.BUNDLE_SELECT_PLAN(this.sessionSelectedPlan)
        }

        if (newQty < 1) {
          this.setDefMenu();
        }
      }
    },
  },
  computed: {
    ...mapState([
      "account",
      "children",
      "bundle",
      "navigation",
      "plans",
      "selectedPlan",
      "types",
      "sortOptionsNewCustomer",
      "sortOptionsExistingCustomer",
      "customer",
      "activeStep",
      "masterCollections",
      "wildcard",
    ]),
    ...mapGetters([
      "mealsAvailable",
      "allProducts",
      "allWildcard",
      "favoritesIds",
      "groupChildren",
    ]),
    sessionSelectedPlan() {
      return JSON.parse(sessionStorage.getItem("selected_plan"));
    },
    userSelectedPlan() {
      if(this.selectedPlan) {                  
        return this.selectedPlan
      } else {
        return this.sessionSelectedPlan
      }        
    },

      //     selPlan() {
      //   if(this.userSelectedPlan) {                  
      //     return this.userSelectedPlan
      //   } else {
      //     const selectPlan = sessionStorage.getItem('selected_plan') 
      //     return selectPlan 
      //   }
      // }, 
    // userSelectedPlan() {
    //   return this.userSelectedPlan ? this.userSelectedPlan : this.sessionSelectedPlan;
    // },
    mealsAvailableText() {
      if (!this.sort) {
        const mealsCount = this.filteredCollections.reduce(
          (accumulator, collection) => accumulator + collection.products.length,
          0
        );
        return `Showing ${
          mealsCount === this.mealsAvailable ? "All" : mealsCount
        } ${mealsCount > 1 ? "Meals" : "Meal"} for ${this.currentDate}`;
      }
      const productsCount = this.filteredProducts.length;
      return `Showing ${
        productsCount === this.mealsAvailable ? "All" : productsCount
      } ${productsCount > 1 ? "Meals" : "Meal"} for ${this.currentDate}`;
    },
    minimumMeals() {
      return this.userSelectedPlan.minimum;
    },
    wildcardz() {
      return this.allWildcard;
    },
    planPrice() {
      return this.userSelectedPlan ? formatPrice(this.userSelectedPlan.price) : null;
    },
    userSelectedPlanPrice() {
      return formatPrice(this.userSelectedPlan.price);
    },
    currentDate() {
      const date = moment().format("dddd, MMMM Do");
      return date;
    },
    basketQty() {
      return this.bundle.children.reduce(
        (accumulator, item) => accumulator + item.quantity,
        0
      );
    },
    remainingMeals() {
      return this.userSelectedPlan.minimum - this.basketQty;
    },
    remainingMealsMinM() {
      //return this.userSelectedPlan.minimum - this.basketQty;
      return this.minimumMeals - this.basketQty;
    },
    availableCollections: {
      get() {
        if (this.account) {
          return this.groupChildren.filter(
            (collection) => collection.products.length > 0
          );
        }
        return this.children.filter(
          (collection) => collection.products.length > 0
        );
      },
      set(value) {
        if (this.account) {
          return (this.groupChildren = value);
        }
        return (this.children = value);
      },
    },
    filteredCollections: {
      get() {
        if (!this.mealTypes.length) {
          return this.availableCollections;
        }
        return this.availableCollections.filter((collection) =>
          this.mealTypes.find((type) => type.handle === collection.handle)
        );
      },
      set(value) {
        this.availableCollections = value;
      },
    },
    filteredProducts() {
      return this.sortProducts(this.allProducts);
    },
    sortedPlans() {
      let plans = [...this.plans.products];
      plans = plans.filter((plan) => plan.subscription);
      return plans.sort((a, b) => {
        return a.minimum - b.minimum;
      });
    },
    currentPlanIndex() {
      return this.sortedPlans.findIndex(
        (plan) => plan.minimum === this.userSelectedPlan.minimum
      );
    },
    prevPlan() {
      return this.currentPlanIndex > 0
        ? this.sortedPlans[this.currentPlanIndex - 1]
        : this.sortedPlans[0];
    },
    nextPlan() {
      return this.sortedPlans[this.currentPlanIndex + 1];
    },
    nextPlanDifference() {
      return this.nextPlan ? this.nextPlan.minimum - this.basketQty : 0;
    },
    planSavings() {
      return formatPrice(this.prevPlan.price - this.userSelectedPlan.price);
    },
    showProgressBar() {
      if (!this.userSelectedPlan.subscription) return;
      if (this.userSelectedPlan.minimum === 14) return false;
      if (this.nextPlanDifference <= 0) return false;
      if (!this.nextPlan) return false;
      if (this.userSelectedPlan.minimum === this.nextPlan.minimum) return false;
      if (this.basketQty <= this.userSelectedPlan.minimum) return false;
      return this.nextPlan && this.nextPlanDifference < 3;
    },
    percentBundleComplete() {
      return ((3 - this.nextPlanDifference) / 3) * 100;
    },
    bundleComplete() {
      return this.basketQty >= this.userSelectedPlan.minimum;
    },
    bundleCompleteMinMeals() {
      return this.basketQty >= this.minimumMeals;
    },
    currentSort() {
      return this.sortOptions.find((option) => option.handle === this.sort);
    },
    hasFilter() {
      return (
        this.mealTypes.length ||
        this.proteins.length ||
        this.showLikes ||
        this.removeDislikes
      );
    },
    pendingProteinsDowncase() {
      return this.pendingProteins.map((protein) => protein.toLowerCase());
    },
    favorites() {
      return this.allProducts.filter((product) =>
        this.favoritesIds.includes(product.id)
      );
    },
    showFavoritesCarousel() {
      return this.favorites.length;
    },
    customerLikes() {
      return this.account && this.customer
        ? this.customer.likes.map((tag) => tag.split("::")[1])
        : null;
    },
    customerDislikes() {
      return this.account && this.customer
        ? this.customer.dislikes.map((tag) => tag.split("::")[1])
        : null;
    },
    lastPage() {
      return document.referrer;
    }
  },
  methods: {
    ...mapMutations([
      "BUNDLE_ADD_CHILD",
      "BUNDLE_ADD_ADDON",
      "BUNDLE_REMOVE_CHILD",
      "BUNDLE_SELECT_PLAN",
      "BUNDLE_UPSELL_OPTIN",
      "BUNDLE_UPSELL_OPTOUT",
      "BUNDLE_CHANGE_ACTIVE_STEP"
    ]),
    async setDefMenu() {
      if (this.account) {
        const arry = this.storedDefaultMenu.map(async (prod) => {
          let idd = prod.shopify_variant_id;
          let qty = prod.quantity;
          let meall = await this.allProducts.find((product) =>
            product.variants.find((varn) => varn.id === idd)
          );
          if (meall) {
            meall.quantity = qty;
            if (meall.variants[1] && prod.shopify_variant_id === meall.variants[1].id) {
              meall.upsellId = prod.shopify_variant_id
            } else {
              delete meall.upsellId
            }
            this.defaultMenuArray.push(meall);
          }
        });
      }
    },
    handleNextStep() {
      if (this.account) {
        this.BUNDLE_CHANGE_ACTIVE_STEP([null, "inc"]);
      } else {
        this.$router.push(navigation.links[2].url);
      }
    },
    handleFilter(filter, filterArray, allowMultiple = true) {
      const filterIsObject = typeof filter === "object";
      const index = (() => {
        if (filterIsObject) {
          return this[filterArray].findIndex(
            (item) => item.handle === filter.handle
          );
        }
        return this[filterArray].indexOf(filter);
      })();

      if (index > -1) {
        this[filterArray].splice(index, 1);
      } else {
        if (!allowMultiple) {
          this[filterArray] = [];
        }
        this[filterArray].push(filter);
      }
    },
    handleApplyFilter(pendingArray, filterArray) {
      this[pendingArray] = [...this[filterArray]];
    },
    handleApplyFilterMobile() {
      this.handleApplyFilter("proteins", "pendingProteins");
      this.handleApplyFilter("mealTypes", "pendingMealTypes");
      this.filtersOpen = false;
    },
    handleClearFilters() {
      this.mealTypes = [];
      this.pendingMealTypes = [];
      this.proteins = [];
      this.pendingProteins = [];
      this.removeDislikes = false;
      this.showLikes = false;
    },
    handleSort(sortBy) {
      if (!sortBy) return;

      this.sort = sortBy;
      this.sortOpen = false;
      this.sortMobileOpen = false;

      const isProtein = sortBy === "protein";
      const isCarbohydrates = sortBy === "carbohydrates";
      const isCalories = sortBy === "calories";

      if (isProtein || isCarbohydrates || isCalories) {
        this.filteredCollections = this.filteredCollections.map((element) => {
          return element.products.sort((a, b) => {
            const { nutritional_info: aNutritionalInfo } = a;
            const { nutritional_info: bNutritionalInfo } = b;

            const capitalizeSortBy =
              sortBy.charAt(0).toUpperCase() + sortBy.slice(1);

            const aInfo = aNutritionalInfo[sortBy]
              ? aNutritionalInfo[sortBy]
              : aNutritionalInfo[capitalizeSortBy];
            const bInfo = bNutritionalInfo[sortBy]
              ? bNutritionalInfo[sortBy]
              : bNutritionalInfo[capitalizeSortBy];

            const x = parseInt(aInfo, 10);
            const y = parseInt(bInfo, 10);

            return sortBy === "protein" ? y - x : x - y;
          });
        });
      }

      if (sortBy === "my-favorites") {
        this.filteredCollections = this.filteredCollections.map((element) => {
          return element.products.sort((a, b) => {
            const x = this.favoritesIds.includes(a.id);
            const y = this.favoritesIds.includes(b.id);

            return y - x;
          });
        });
      }
    },
    handleQtyIncrease(item) {
      const newItem = this.bundle.children.find(
        (child) => child.id === item.id
      );
      if (!newItem) {
        item.quantity = 1;
        this.BUNDLE_ADD_CHILD(item);
      } else {
        newItem.quantity++;
        this.BUNDLE_ADD_CHILD(newItem);
      }
    },
    handleChildRemove(item) {
      const newItem = this.bundle.children.find(
        (oldItem) => oldItem.id === item.id
      );
      this.BUNDLE_REMOVE_CHILD(newItem);
    },
    handleQtyDecrease(item) {
      const newItem = this.bundle.children.find(
        (child) => child.id === item.id
      );
      newItem.quantity--;
      if (newItem.quantity < 1) {
        this.BUNDLE_REMOVE_CHILD(newItem);
      } else {
        this.BUNDLE_ADD_CHILD(newItem);
      }
    },
    handleScrollToTop() {
      if (!this.account) {
        scrollToTop(window);
        return;
      }
      const $drawer = document.querySelector(".c-drawer");
      scrollToTop($drawer);
    },
    handleStickyFilters() {
      const observer = new IntersectionObserver(
        ([e]) => {
          e.target.classList.toggle(
            "c-sticky--active",
            e.intersectionRatio < 1
          );
        },
        { threshold: [1] }
      );
      if (this.userSelectedPlan) {
        observer.observe(this.$refs.filter);
      }
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
    handleSlidePrev() {
      this.$refs.carousel.slidePrev();
    },
    handleSlideNext() {
      this.$refs.carousel.slideNext();
    },
    handleFavoritesFilter() {
      const data = new FormData(this.$refs.favoritesFilter);
      for (const [name, value] of data) {
        this[name] = JSON.parse(value);
      }
    },
    checkFilterActive(filter) {
      return !!this[filter].find((item) => item.handle === collection.handle);
    },
    getItemQuantity(id) {
      const item = this.bundle.children.find((item) => item.id === id);
      return item ? item.quantity : 0;
    },
    sortProducts(products) {
      let sortedProducts = [...products];
      if (this.mealTypes.length) {
        sortedProducts = sortedProducts.filter((product) => {
          const typeHandles = this.mealTypes.map((type) => type.handle);
          return typeHandles.includes(product.collection.handle);
        });
      }

      if (this.proteins.length) {
        sortedProducts = sortedProducts.filter((product) => {
          return product.tags.find((tag) => this.proteins.includes(tag));
        });
      }

      if (this.showLikes) {
        sortedProducts = sortedProducts.filter((product) => {
          const handleizedTags = product.tags.map((tag) => handleize(tag));
          for (let i = 0; i < this.customerLikes.length; i++) {
            if (handleizedTags.includes(this.customerLikes[i])) {
              return product;
            }
          }
        });
      }

      if (this.removeDislikes) {
        sortedProducts = sortedProducts.filter((product) => {
          const handleizedTags = product.tags.map((tag) => handleize(tag));
          const sharedTags = handleizedTags.filter((tag) =>
            this.customerDislikes.includes(tag)
          );
          if (!sharedTags.length) {
            return product;
          }
        });
      }

      switch (this.sort) {
        case "protein":
          sortedProducts.sort((a, b) => {
            return (
              Number(b.nutritional_info.protein) -
              Number(a.nutritional_info.protein)
            );
          });
          break;
        case "carbohydrates":
          sortedProducts.sort((a, b) => {
            return (
              Number(a.nutritional_info.carbohydrates) -
              Number(b.nutritional_info.carbohydrates)
            );
          });
          break;
        case "calories":
          sortedProducts.sort((a, b) => {
            return (
              Number(a.nutritional_info.calories) -
              Number(b.nutritional_info.calories)
            );
          });
          break;
        default:
          sortedProducts.sort((product) => {
            return handleize(product.flag) === this.sort ? -1 : 0;
          });
      }
      return sortedProducts;
    },
    async handleToggleFavorited(product) {
      const tag = `favorite::${product.id}`;
      const customerTags = this.customer.tags;
      const tagIndex = customerTags.findIndex(
        (customerTag) => customerTag === tag
      );

      if (tagIndex === -1) {
        customerTags.push(tag);
      } else {
        customerTags.splice(tagIndex, 1);
      }
      await this.customer.handleFavorites({
        updates: {
          tags: customerTags,
        },
      });
    },
    handleAddDefaultMenu() {
      this.defaultMenuArray.forEach((item) => {
        this.BUNDLE_ADD_CHILD(item);
      });
    },
    setBundleItems() {
      sessionStorage.setItem(
        "bundle_content",
        JSON.stringify(this.bundle.children)
      );
    },
    reinstateCartAfterPDP() {
      const getBundle = sessionStorage.getItem("bundle_content");
      const makeJsonn = JSON.parse(getBundle);
      const fromPdp = sessionStorage.getItem('from_pdp');

      if (this.lastPage.includes("/products/") && fromPdp) {
        this.bundle.children = makeJsonn;
        setTimeout(()=>{sessionStorage.removeItem('from_pdp')},500)
      }
    },
    addItemToCartFromPDP() {
      const getItemm = sessionStorage.getItem("addcart_item");
      const isAddOnPdp = sessionStorage.getItem("is_addOn");
      if (getItemm) {
        const makeJson = JSON.parse(getItemm);

        if (this.lastPage.includes("/products/")) {
          if (isAddOnPdp === 'true') {
            this.BUNDLE_ADD_ADDON(makeJson);
          }
          if (isAddOnPdp === 'false') {
            this.BUNDLE_ADD_CHILD(makeJson); 
          }          
        }
        setTimeout(() => {
          sessionStorage.removeItem("addcart_item");
          sessionStorage.removeItem("is_addOn");
        }, 1250);
      }
    },
    async runTns() {
      var slider = tns({
        container: ".slider",
        nextButton: "[data-menu-next]",
        prevButton: "[data-menu-prev]",
        items: 1,
        slideBy: "page",
        nav: false,
        responsive: {
          900: {
            items: 3,
          },
          1200: {
            controls: true,
            items: 4,
          },
        },
      });
    },
  },
  mounted() {
    //  this.handleStickyFilters();
    this.reinstateCartAfterPDP();
    this.addItemToCartFromPDP();
    sessionStorage.setItem("hit_meal_page", "true");
    this.$nextTick(() =>
      setTimeout(() => {
        this.runTns();
      }, 500)
    );

    const storedDFMJson = sessionStorage.getItem("default_menu");
    if (this.account) this.storedDefaultMenu = JSON.parse(storedDFMJson);
  },
  updated() {
    sessionStorage.setItem(
      "bundle_content",
      JSON.stringify(this.bundle.children)
    );
  },
  // watch: {
  //   storedDefaultMenu: {
  //     handler: 'setDefMenu'
  //   }
  // },
  components: {
    cBundleNav,
    cProduct,
    cLineItem,
    cIcon,
    cFilter,
    cMenu,
    cProgressBar,
    cCheckbox,
    Hooper,
    Slide,
    HooperNavigation,
  },
};
</script>

<style>
.wildcard-slider {
  position: relative;
}

.wildcard-slider .c-menuSlider {
  display: flex;
}

.wildcard-slider .c-menuSlider .c-product {
  height: 100%;
}

.wildcard-slider .c-menuControls__container {
  display: flex;
  justify-content: space-between;
  top: 60%;
  z-index: 1;
  position: absolute;
  width: 100%;
}
.wildcard-slider .c-menuControls__container .c-menuControls__control {
  position: relative;
  cursor: pointer;
  width: 30px;
  height: 30px;
  background: #519864;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.wildcard-slider .c-menuControls__container .c-menuControls__control:hover {
  background: #1f5940;
}

.wildcard-slider .c-menuControls__container .c-menuControls__control svg path {
  stroke: #fffefa;
  fill: #fffefa;
}
.wildcard-slider .c-menuControls__container .c-menuControl__prev {
  transform: rotate(90deg);
  margin-left: -10px;
}

.wildcard-slider .c-menuControls__container .c-menuControl__next {
  transform: rotate(270deg);
  margin-right: -10px;
}

@media only screen and (min-width: 900px) {
  .wildcard-slider .c-menuSlider {
    gap: 10px;
  }
}

@media only screen and (max-width: 767px) {
  .tns-controls [data-controls="prev"] {
    left: 10px;
  }

  .tns-controls [data-controls="next"] {
    right: 10px;
  }

  .c-basketPage.c-mealsStep > .o-containerLarge {
    overflow-y: auto;
    height: 100vh;
    padding-bottom: 300px;
    margin-top: 41px;
  }
}
</style>