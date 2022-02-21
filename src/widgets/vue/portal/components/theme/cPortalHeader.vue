<template>
  <div>
    <header class="c-portalHeader u-hideMobile">
      <div class="o-containerLarge">
        <div class="c-portalHeader__inner">
          <div class="c-portalHeader__menu">
            <component class="c-portalHeader__link"
              v-for="(link, index) in navigation"
              :key="index"
              :is="link.tag"              
              v-bind="link.attributes"
            >
            <!-- :class="[{'hide-this': !customerRecharge && customerShopify.orderCount < 1 && link.text.includes('History')}]" -->
              {{ link.text }}
            </component>
            <router-link
              v-if="!customerRecharge"
              to="/profile"
              class="c-portalHeader__link"
            >
              My Profile
            </router-link>            
          </div>
          <div class="c-portalHeader__logo">
            <a href="/">
              <c-icon icon="logo" />
            </a>
          </div>
          <div class="c-portalHeader__menu c-portalHeader__menu--utility">
            <a class="c-portalHeader__link" href="/pages/refer-a-friend">
              Get $40
            </a>
            <a class="c-portalHeader__link" href="https://freshmealplan.zendesk.com/hc/en-us">
              FAQs
            </a>
            <div :class="['c-portalHeader__dropdown', {
              'c-portalHeader__dropdown--open': utilMenuOpen
            }]">
              <div :class="['c-dropdown', {
                  'c-dropdown--open': utilMenuOpen
              }]">
                <div class="c-dropdown__inner">
                  <div class="c-dropdown__toggle u-relative u-pointer" @click.stop="utilMenuOpen = !utilMenuOpen">
                    Hi, {{ customerShopify.firstName }}

                    <div class="c-dropdown__icons">
                      <c-icon icon="profile" />
                      <span class="c-dropdown__arrow">
                        <c-icon icon="chevron" />
                      </span>
                    </div>
                  </div>
                  <router-link to="/profile" class="c-dropdown__item">
                    My Profile
                  </router-link>  <!-- && !pastCutoffEST -->
                  <button v-if="customerRecharge && hasActive" class="c-dropdown__item u-btnUnset" @click="handleEditDefaultMenu">
                    Edit Default Menu
                  </button>
                  <router-link v-if="customerRecharge" to="/dietary-preferences" class="c-dropdown__item">
                    Dietary Preferences
                  </router-link>
                  <a href="/account/logout" class="c-dropdown__item">
                    Logout
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    <header class="c-portalHeader u-hideDesktop">
      <button
        class="c-portalHeader__toggle u-btnUnset"
        @click="handleToggleMenuClick()"
      >
        <span v-show="!open">
          <c-icon icon="hamburger" />
        </span>
        <span v-show="open">
          <c-icon icon="close" />
        </span>
      </button>
      <div class="c-portalHeader__logo">
        <a href="/">
          <c-icon icon="logo" />
        </a>
      </div>
      <div class="c-portalHeader__mobileMenu" v-if="open">
        <div>
          <span class="c-portalHeader__welcome">
            Welcome back, {{ customerShopify.firstName }}!
          </span>
          <ul class="c-portalHeader__linklist">
            <li class="c-portalHeader__linklistItem">
              <button class="u-btnUnset" @click="() => handleRouterPush('/shipments')">
                Upcoming Deliveries
              </button>
            </li>
            <li class="c-portalHeader__linklistItem">
              <button class="u-btnUnset" @click="() => handleRouterPush('/orders')">
                Order History
              </button>
            </li>
            <li class="c-portalHeader__linklistItem">
              <button class="u-btnUnset" @click="() => handleRouterPush('/profile')">
                My Profile
              </button>
            </li>
            <li class="c-portalHeader__linklistItem">
              <button
                v-if="customerRecharge"
                class="u-btnUnset"
                @click="() => handleRouterPush('/details')"
              >
                Manage Subscription
              </button>
            </li>
            <li class="c-portalHeader__linklistItem">
              <a href="https://fresh-meal-plan.myshopify.com/pages/refer-a-friend">
                Refer a Friend
              </a>
            </li>
            <li class="c-portalHeader__linklistItem">
              <a href="https://freshmealplan.zendesk.com/hc/en-us">
                FAQ
              </a>
            </li>
          </ul>
          <ul class="c-portalHeader__linklistSecondary">
            <li v-if="hasActive && !pastCutoffEST">
              <button class="u-btnUnset" @click="handleEditDefaultMenu">
                Edit Default Menu
              </button>
            </li>
            <li>
              <button class="u-btnUnset" @click="() => handleRouterPush('/dietary-preferences')">
                Dietary Preferences
              </button>
            </li>
            <li>
              <a href="mailto:hello@freshmealplan.com">
                Contact Us
              </a>
            </li>
          </ul>
        </div>
        <a class="c-cta c-cta--inverse" href="/account/logout">
          Log Out
        </a>
      </div>
    </header>
  </div>
</template>

<script>
import cSvg from '@shared/components/core/cSvg.vue';
import cIcon from '@shared/components/core/cIcon.vue';
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';

export default {
  props: {
    modifiers: {
      type: Array,
      default: () => ([])
    }  
  },
  data: () => ({
    open: false,
    utilMenuOpen: false,
    hasActive: true
  }),
  computed: {
    ...mapGetters('customer', ['customerShopify', 'customerRecharge', 'customerSubscriptions']), 
    ...mapState('ui', ['pastCutoffEST']),          
    subs(){
      return this.customerSubscriptions;
    },
    activeSubs() {           
      return this.subs?.some(sub => sub.status === 'ACTIVE') 
    }, 
    navigation() {
      let links = this.$store.getters['customize/customizePartByKey']('navigation');
      if(links) {
        links = links.filter(link => link.visibility === "shopify_users"
            ? this.customerShopify : link.visibility === "recharge_users"
              ? this.customerRecharge : true
        )
        return links.map(link => {
          if(link.page === 'external') {
            link = { ...link, tag: 'a', attributes: { href: link.url }}
          } else if (link.page === 'signout') {
            link = { ...link, tag: 'a', attributes: { href: '/account/logout' }}
          } else {
            link = { ...link, tag: 'router-link', attributes: { to: {'name': link.page }} }
            if(link.page === 'shipment') link.attributes.exact = true
          }
          return link
        })
      }
    },
    toggleIcon() {
      return this.open ? 'close' : 'hamburger';
    },
    activeLink() {
      return this.navigation.find(link => link.page === this.$route.name)
    },
    mobileModifiers() {
      let modifiers = []
      if(this.open) modifiers.push('isOpen')
      return modifiers
    },    
    testname() {
      return customer.first_name;
    }
  },
  methods: {
    ...mapMutations('ui', ['UI_TOGGLE_DEFAULT_MENU']),
    ...mapActions('customer', ['customerSetResources']),    
    handleRouterPush(path) {
      this.$router.push(path);
      this.open = false;
      const { body: $body } = document;
      $body.style.overflow = 'auto'      
    },
    handleCloseUtilMenu() {
      this.utilMenuOpen = false;
    },
    handleEditDefaultMenu() {
      this.UI_TOGGLE_DEFAULT_MENU(true);
      this.open = false;
      this.utilMenuOpen = false;
      const { body: $body } = document;
      $body.style.overflow = 'auto'      
    },
    handleToggleMenuClick() {
      const { body: $body } = document;

      this.open = !this.open;

      return this.open
        ? $body.style.overflow = 'hidden'
        : $body.style.overflow = 'auto';
    }
  },
  async created(){
    const { success, error } = await this.customerSetResources({
      resources: ['subscriptions']
    })
  },
  mounted() {
    document.body.addEventListener('click', this.handleCloseUtilMenu);
  },
  beforeDestroy() {
    document.body.removeEventListener('click', this.handleCloseUtilMenu);
  },
  watch: {
    utilMenuOpen(){
      if(!this.activeSubs) {
        this.hasActive = false;
      }
    }
  },
  components: { cSvg, cIcon },
}
</script>

<style lang="scss">
  .c-portalHeader {
    background-color: $color-off-white;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 70px;
    z-index: 7;
    padding: 12px 0;
    @include media-desktop-up {
      position: relative;
    }
    &.u-hideDesktop {
      @include media-tablet-down {
        position: relative;
      }
    }    
  }
  .c-portalHeader__mobileMenu {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    top: 70px;
    left: 0;
    right: 0;
    width: 100%;
    height: calc(100vh - 70px);
    background-color: $color-off-white;
    border-top: 1px solid $color-paleo;
    overflow-y: auto;
    padding: 24px 22px 50px;
    /*margin-top: 67px;*/
    position: fixed;
    top: 103px;
    bottom: 0;
    height: auto;
    .c-cta {
      margin-top: 22px;
    }    
  }
  .c-portalHeader__welcome {
    color: $color-evergreen;
    font-size: 15px;
    letter-spacing: .04em;
    text-transform: uppercase;
    font-weight: 600;
  }
  .c-portalHeader__linklist {
    margin: 18px 0 33px;
  }
  .c-portalHeader__linklistItem {
    font-family: $font-heading;
    font-weight: 600;
    font-size: 24px;
    color: $color-off-black;
    margin-bottom: 16px;
    button, a {
      font-family: inherit;
      font-weight: inherit;
      font-size: inherit;
    }
  }
  .c-portalHeader__linklistSecondary {
    display: grid;
    grid-gap: 18px;
    font-size: 20px;
    font-weight: 600;
    button, a {
      font-size: inherit;
      font-weight: inherit;
      font-size: inherit;
    }
  }
  .c-portalHeader__linklistItem {
    a {
      color: #000;
    }

    a:active {
      color: rgba(0,0,0,0.9125);
    }
  }
  .c-portalHeader__menu {
    display: flex;
    align-items: center;
    &.c-portalHeader__menu--utility {
      justify-content: flex-end;
    }
  }
  .c-portalHeader__link {
    color: $color-off-black;
    font-size: 16px;
    font-weight: 600;
    &:not(:last-child) {
      margin-right: 20px;
    }
    &.router-link-active {
      color: $color-broccoli;
    }
  }
  .c-portalHeader__inner {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
  }
  .c-portalHeader__logo {
    text-align: center;
/*    position: sticky;
    top: 0;
    z-index: 100;*/
/*    padding: 11px 0;
    margin-top: 0;
    border-bottom: 1px solid #e2dfd7;  */

    svg {
      height: 42px;
      @include media-desktop-up {
        height: 45px;
      }
    }
  }
  .c-portalHeader__dropdown {
    /*width: 150px;*/
    width: auto;
    &.c-portalHeader__dropdown--open {
      /*width: 180px;*/
      width: auto;
    }
  }
  .c-portalHeader__toggle {
    position: absolute;
    top: 50%;
    left: 25px;
    transform: translateY(-50%);
  }
  .c-portalHeader {
    /*z-index: 100;*/
    z-index: 7;
  }

  .hide-this {
    display: none;
  }

/*  .c-portalHeader.u-hideDesktop {
    height: 100vh;
    overflow-y: scroll;
    padding: 0;
  }*/
</style>