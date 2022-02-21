<template>
  <div>
   <nav class="c-mobileNav" style="z-index: 6;">
      <div class="o-container">
        <button class="c-mobileNav__back u-btnUnset" @click="goBack"> <!-- @click="handleClose" -->
          <cIcon icon="chevron" />
        </button>
        Dietary Preferences
      </div>
    </nav>
    <div class="c-heroShort">
      <div class="o-containerLarge">
        <div class="c-heroShort__inner">
          <h4 class="c-heroShort__smallHeading">
            {{ dietaryPreferences.content.small_heading }}
          </h4>
          <h2 class="c-heroShort__heading c-h2">
            {{ dietaryPreferences.content.heading }}
          </h2>
          <div class="c-heroShort__text" v-html="dietaryPreferences.content.text "></div>
        </div>
      </div>
    </div>
    <div class="o-containerLarge">
      <div class="c-preferencesPage u-textCenter">
        <ul class="c-foodsGrid">
          <li v-for="(food, index) in dietaryPreferences.food" :key="index">
            <div class="c-foodsGrid__food">
              <div :class="['c-preference', {
                'c-preference--like': checkLike(food.name),
                'c-preference--dislike': checkDislike(food.name),
              }]">
                <div class="c-preference__top"><!-- v-if="disliked.length > 0" -->
                  <div class="u-hideDesktop c-product__dislike">
                     <c-icon icon="exclamation" />
                  </div>  
                  <img class="c-preference__image" :src="food.image" />
                  <h4 class="c-preference__title c-h4">
                    {{ food.name }}
                  </h4>
                </div>
                <div class="c-preference__actions">
                  <button class="c-preference__action u-btnUnset" @click="() => handleToggleLike(food.name, true)">
                    <div class="c-preference__radio">
                      <span class="c-preference__radioCircle" v-if="checkLike(food.name)"></span>
                    </div>
                    Like
                  </button>
                  <button class="c-preference__action u-btnUnset" @click="() => handleToggleLike(food.name, false)">
                    <div class="c-preference__radio">
                      <span class="c-preference__radioCircle" v-if="checkDislike(food.name)"></span>
                    </div>
                    Dislike
                  </button>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <button
          class="c-preferencesPage__cta c-cta"
          @click="handleSavePreferences"
          :disabled="submitting"
        >
          <template v-if="!message.visibility">
            Save Preferences
          </template>
          <template v-else>
            {{ message.text }}
          </template>
        </button>
        <button class="c-capsLink u-btnUnset" @click="goBack">
          Finish Later
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import { handleize } from '@shared/utils';
import cIcon from '@shared/components/core/cIcon.vue';

export default {
  data() {
    return {
      preferences: [],
      submitting: false,
      message: {
        text: 'Preferences Updated',
        visibility: false
      }
    }
  },
  computed: {
    ...mapState('ui', ['dietaryPreferences']),
    ...mapGetters('customer', ['customerShopify']),
    nonLikesTags() {
      return this.customerShopify.tags.filter(tag => tag.indexOf('like::') === -1 && tag.indexOf('dislike::') === -1);
    }
  },
  mounted() {
    const likes = this.customerShopify.tags.filter(tag => tag.indexOf('like::') === 0);
    const dislikes = this.customerShopify.tags.filter(tag => tag.indexOf('dislike::') === 0);
    this.preferences = [
      ...likes,
      ...dislikes
    ]
  },
  methods: {
    ...mapActions('customer', ['customerUpdateProfile']),
    handleToggleLike(name, like) {
      const likeTag = `like::${handleize(name)}`;
      const dislikeTag = `dislike::${handleize(name)}`;
      const dislikesIndex = this.preferences.indexOf(dislikeTag);
      const likesIndex = this.preferences.indexOf(likeTag);
      
      if (like) {
        if (dislikesIndex > -1) {
          this.preferences.splice(dislikesIndex, 1);
        }
        if (likesIndex > -1) {
          this.preferences.splice(likesIndex, 1);
        } else {
          this.preferences.push(likeTag);
        }
      } else {
        if (likesIndex > -1) {
          this.preferences.splice(likesIndex, 1);
        }
        if (dislikesIndex > -1) {
          this.preferences.splice(dislikesIndex, 1);
        } else {
          this.preferences.push(dislikeTag);
        }
      }
    },
    checkLike(name) {
      return this.preferences.includes(`like::${handleize(name)}`)
    },
    checkDislike(name) {
      return this.preferences.includes(`dislike::${handleize(name)}`)
    },
    goBack() {
      this.message.visibility = false;      
      window.history.back();
    },
    async handleSavePreferences() {
      this.submitting = true;
      const preferences = await this.customerUpdateProfile({
        updates: {
          tags: [
            ...this.nonLikesTags,
            ...this.preferences.filter(preference => preference.indexOf('like::') === 0),
            ...this.preferences.filter(preference => preference.indexOf('dislike::') > -1)
          ]
        }
      })

      this.message.visibility = true

      setTimeout(() => {
        this.message.visibility = false;
        this.submitting = false;
      }, 5500);
    }
  },
  components: {
    cIcon
  }
}
</script>

<style lang="scss">
  .c-preferencesPage {
    max-width: 865px;
    margin: 0 auto auto;
  }
  .c-preferencesPage__cta {
    width: 333px;
    margin: 0 auto 30px;
  }
  .c-mobileNav {
    position: sticky;
    top: 0;
  }
  .c-foodsGrid {
    display: grid;
    grid-gap: 20px;
    margin: 40px 0;
    @include media-desktop-up {
      grid-template-columns: repeat(4, 1fr);
      grid-gap: 27px;
    }
  }
  .c-preference {
    text-align: center;
    background-color: $color-ecru;
    border-radius: 12px;
    border: 1px solid $color-paleo;
    overflow: hidden;
    &.c-preference--like {
      background-color: $color-evergreen-light;
      border-color: $color-broccoli;
    }
    &.c-preference--dislike {
      background-color: $color-citrus-light;
      border-color: $color-citrus;
    }
  }
  .c-preference__image {
    height: 85px;
  }
  .c-preference__top {
    padding: 16px;
  }
  .c-preference__actions {
    display: flex;
    border-top: 1px solid $color-paleo;
    .c-preference--like & {
      border-color: $color-broccoli;
    }
    .c-preference--dislike & {
      border-color: $color-citrus;
    }
  }
  .c-preference__action {
    font-size: 12px;
    font-weight: 600;
    flex-basis: 0;
    flex-grow: 1;
    text-transform: uppercase;
    color: $color-off-black;
    padding: 7px;
    &:first-child {
      border-right: 1px solid $color-paleo;
    }
    .c-preference--like &:first-child {
      border-color: $color-broccoli;
    }
    .c-preference--dislike &:first-child {
      border-color: $color-citrus;
    }
  }
  .c-preference__radio {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 31px;
    height: 31px;
    border-radius: 100%;
    background-color: $color-off-white;
    border: 1px solid $color-grey;
    margin: 0 auto 12px;
    @include media-desktop-up {
      width: 23px;
      height: 23px;
    }
    .c-preference--like & {
      border-color: $color-broccoli;
    }
    .c-preference--dislike & {
      border-color: $color-citrus;
    }
  }
  .c-preference__radioCircle {
    width: 17px;
    height: 17px;
    border-radius: 100%;
    background-color: $color-off-black;
    @include media-desktop-up {
      width: 13px;
      height: 13px;
    }
    .c-preference--like & {
      background-color: $color-broccoli;
    }
    .c-preference--dislike & {
      background-color: $color-citrus;
    }
  }
  .c-preference__title {
    font-size: 24px;
    margin: 0;
    @include media-desktop-up {
      font-size: 20px;
    }
    .c-preference--like & {
      color: $color-broccoli;
    }
    .c-preference--dislike & {
      color: $color-citrus;
    }
  }

  .c-preference {
    position: relative;

    .c-product__dislike .c-icon {
      display: none;
    }
  }

  .c-preference--dislike {
    .c-product__dislike {      
      position: absolute;
      top: 10px;
      right: 10px;

      .c-icon {
        display: block;
      }

      svg {
        width: 32px;
      }
    }
  }

</style>