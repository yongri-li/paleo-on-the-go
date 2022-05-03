<template>
  <div class="fas">
    <div class="fas__filter">
      <div class="fas__filter--icon" @click="toggleContent('showFilters')">
        <svg width="20" height="23" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="11" width="23" height="2" transform="rotate(90 11 0)" fill="#231F20"/>
          <rect x="18" width="23" height="2" transform="rotate(90 18 0)" fill="#231F20"/>
          <rect x="4" width="23" height="2" transform="rotate(90 4 0)" fill="#231F20"/>
          <rect x="12" y="2.5" width="4" height="4" rx="2" transform="rotate(90 12 2.5)" fill="#EFEDE6" stroke="#231F20" stroke-width="2"/>
          <rect x="19" y="10.5" width="4" height="4" rx="2" transform="rotate(90 19 10.5)" fill="#EFEDE6" stroke="#231F20" stroke-width="2"/>
          <rect x="5" y="16.5" width="4" height="4" rx="2" transform="rotate(90 5 16.5)" fill="#EFEDE6" stroke="#231F20" stroke-width="2"/>
        </svg>
      </div>
      <div class="fas__filter--types">
        <div class="fas__filter--types-item" @click="toggleContent('showPreference')">
          <div class="fas__filter--types-text">
            Preference
          </div>
          <div v-if="lengthFilterActive(preferences)"
            class="fas__filter--types-number"
          >
            ({{lengthFilterActive(preferences)}})
          </div>
        </div>
        <div class="fas__filter--types-item" @click="toggleContent('showProductType')">
          <div class="fas__filter--types-text">
            Product Type
          </div>
          <div v-if="lengthFilterActive(productType)"
            class="fas__filter--types-number"
          >
            ({{lengthFilterActive(productType)}})
          </div>
        </div>
      </div>
      <div
        class="fas__filter--content"
        :class="{ show: contents.showFilters }"
      >
        <div
          class="fas__filter--options"
          :class="{ show: contents.showPreference }"
        >
          <div class="fas__filter--title">
            PREFERENCE
          </div>
          <ul class="fas__filter--list">
            <li v-for="item in preferences"
              :key="item.tag"
              class="fas__filter--opt"
              :class="{ active: item.active }"
              @click="addFilter(item)"
            >
              {{ item.title }}
            </li>
          </ul>
        </div>
        <div
          class="fas__filter--options"
          :class="{ show: contents.showProductType }"
        >
          <div class="fas__filter--title">
            PRODUCT TYPE
          </div>
          <ul class="fas__filter--list">
            <li v-for="item in productType"
              :key="item.tag"
              class="fas__filter--opt"
              :class="{ active: item.active }"
              @click="addFilter(item)"
            >
              {{ item.title }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="fas__items">
      {{ lengthProducts }} items
    </div>
    <div class="fas__sort">
      <!-- Sort By -->
      <v-select
        placeholder="Sort By"
        label="label"
        :options="options"
        :searchable="false"
        :clearable="false"
        :value="selected"
        @input="setSorting"
      >
        <template v-slot:option="option">
          {{ option.label }}
          <span class="vs__dropdown-option--radio"></span>
        </template>
      </v-select>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { FILTER_TOGGLE_ACTIVE, CLEAN_ALL_FILTERS } from '../../store/modules/filters/_mutations-type'

export default {
  props: {
    lengthProducts: {
      type: Number
    }
  },
  data() {
    return {
      contents: {
        showFilters: false,
        showPreference: false,
        showProductType: false,
      },
      options: [
        {
          label: 'Best Selling'
        },
        {
          label: 'Newest'
        }
      ],
    }
  },
  computed: {
    ...mapState('filters',[
      'filters'
    ]),
    preferences() {
      return filters.filter(fil => fil.filter_type === 'preference')
    },
    productType() {
      return filters.filter(fil => fil.filter_type === 'product_type')
    },
    selected() {
      const sortRouter = this.$route.query.sort
      return sortRouter ? { label: sortRouter } : { label: 'Best Selling' }
    }
  },
  created() {
    // watch the params of the route to fetch the data again
    this.$watch(
      () => this.$route.params,
      () => {
        this.setFiltersRouter()
      },
      // fetch the data when the view is created and the data is
      // already being observed
      { immediate: true }
    )
  },
  methods: {
    toggleContent(content) {
      if(content === 'showPreference') {
        this.contents.showProductType = false
      }
      if(content === 'showProductType') {
        this.contents.showPreference = false
      }

      this.contents[content] = !this.contents[content]
    },
    addFilter(item) {
      const queryRouter = this.$route.query
      const keys = Object.keys(queryRouter)
      let query = {}
      let val

      if(item.active) {
        // remove filter from router
        const valSplit = queryRouter[item.filter_type].split(',')
        const indexTag = valSplit.indexOf(item.tag)
        valSplit.splice(indexTag, 1)

        val = valSplit.length ? valSplit.join(',') : undefined
        query = {
          ...queryRouter,
          [item.filter_type]: val
        }

        // change active to false
        this.$store.commit(`filters/${FILTER_TOGGLE_ACTIVE}`, {
          tag: item.tag,
          active: false
        })
      }
      else {
        // add filter to router
        const hasOtherParam = keys.includes(item.filter_type) && (queryRouter[item.filter_type] !== undefined)
        val = hasOtherParam
              ? `${queryRouter[item.filter_type]},${item.tag}`
              : item.tag

        query = {
          ...queryRouter,
          [item.filter_type]: val
        }

        // change active to true
        this.$store.commit(`filters/${FILTER_TOGGLE_ACTIVE}`, {
          tag: item.tag,
          active: true
        })
      }

      // change query
      this.$router.push({ query })
    },
    setFiltersRouter() {
      const queryRouter = this.$route.query
      const keys = Object.keys(queryRouter)

      this.$store.commit(`filters/${CLEAN_ALL_FILTERS}`)

      keys.forEach(key => {
        if(key === 'preference' || key === 'product_type') {
          if(queryRouter[key]) {
            const valSplit = queryRouter[key].split(',')
            valSplit.forEach(val => {
              this.$store.commit(`filters/${FILTER_TOGGLE_ACTIVE}`, {
                tag: val,
                active: true
              })
            })
          }
        }
      })
    },
    lengthFilterActive(filters) {
      const filtersActive = filters.filter(item => item.active)
      return filtersActive.length
    },
    setSorting(val) {
      const queryRouter = this.$route.query
      if(queryRouter.sort !== val.label) {
        const query = {
          ...queryRouter,
          sort: val.label
        }
        this.$router.push({ query })
      }
    }
  }
}
</script>

<style lang="scss">

.fas {
  @include flex();
  margin-bottom: 1rem;
  padding: .5rem 0;
  position: relative;

  @include media-tablet-up {
    background-color: $color-white;
    padding: .5rem 1.5rem;
  }

  &__filter {
    width: 10%;

    @include media-tablet-up {
      width: 80%;
      @include flex();

      &--icon {
        pointer-events: none;
      }
    }

    &--types {
      display: none;

      @include media-tablet-up {
        width: 80%;
        @include flex();

        &-item {
          @include flex();
          margin: 0 2rem;
          font-weight: 500;
          cursor: pointer;
        }

        &-number {
          color: #A7A5A6;
          margin-left: .5rem;
        }

      }
    }

    &--content {
      position: absolute;
      top: 100%;
      left: 0;
      background-color: #f3f0e9;
      width: 100%;
      z-index: 1;
      border-top: 1px solid #D3D2D2;
      padding: 1rem;
      transition: all .4s;
      transform: translateX(-110%);

      @include media-tablet-up {
        position: relative;
        top: 8px;
        left: -1.5rem;
        z-index: auto;
        padding: 0;
        border-top: 0;
        transform: initial;
      }

      .fas__filter {
        &--options {
          padding: 1rem 0;

          @include media-tablet-up {
            padding: .5rem 0;
            position: absolute;
            background-color: $color-white;
            border-bottom-right-radius: 15px;
            border-bottom-left-radius: 15px;
            z-index: -1;
            width: auto;
            transform: translateY(-100%);
            transition: all .3s;
          }
        }
        &--options.show {
          z-index: auto;
          transform: translateY(0);
        }

        &--title {
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 0.5rem;

          @include media-tablet-up {
            display: none;
          }
        }

        &--opt {
          text-transform: capitalize;
          padding: 0.5rem 0;
          margin-bottom: 0.5rem;
          @include flex();

          &::before {
            content: '';
            border: 1px solid #A7A5A6;
            width: 15px;
            height: 15px;
            margin-right: 10px;
            border-radius: 5px;
            font-size: 10px;
            @include flex($justify: center);
          }

          @include media-tablet-up {
            background-color: #f3f0e9;
            margin: 0 1rem;
            padding: 0.5rem 1rem;
            font-weight: 500;
            font-size: 1rem;
            border-radius: 15px;
            cursor: pointer;

            &::before {
              display: none;
            }
          }
        }
        &--opt.active {
          font-weight: 500;
          text-decoration: underline;

          &::before {
            content: '✓';
            color: $color-white;
            background-color: $color-black;
          }

          @include media-tablet-up  {

            text-decoration: none;
            color: $color-white;
            background-color: $color-black;

            &::after {
              content: 'x';
              font-family: $font-heading;
              margin-left: 7px;
            }
          }
        }

        &--list {
          @include media-tablet-up {
            @include flex();
          }
        }
      }
    }

    &--content.show {
      transform: translateX(0);

    }
  }

  &__items {
    width: 50%;
    color: #A7A5A6;
    font-size: 1rem;

    @include media-tablet-up {
      width: 5%;
      text-align: right;
    }
  }

  &__sort {
    width: 40%;
    text-align: right;
    font-size: 1rem;
    font-weight: 500;

    @include media-tablet-up {
      width: 15%;
    }

    .v-select {
      .vs__dropdown-toggle {
        border: none;
      }

      .vs__dropdown-option{
        &--highlight {
          background-color: $color-black;
          color: $color-primary;
        }
      }

      .vs__dropdown-menu {
        width: 90%;
        min-width: 90%;
        left: 10%;

        @include media-tablet-up {
          width: 80%;
          min-width: 80%;
          left: 20%;
        }
      }

      .vs__selected-options {
        justify-content: flex-end;
      }

      .vs__search {
        width: 0;
        flex-grow: 0;
        padding: 0;
      }
    }

  }
}

</style>