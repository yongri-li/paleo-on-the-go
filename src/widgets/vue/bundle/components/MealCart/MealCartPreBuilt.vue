<template>
  <div class="prebuilt" v-if="options.length">
    <div class="prebuilt__info">
      <div class="prebuilt__info--title">
        {{ prebuilt.content.title }}
      </div>
      <div class="prebuilt__info--subtitle">
        {{ prebuilt.content.subtitle }}
      </div>
    </div>
    <div class="prebuilt__select">
      <v-select
        placeholder="Select a Bundle"
        label="label"
        :options="options"
        :searchable="false"
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
import { mapGetters, mapState } from 'vuex'

export default {
  computed: {
    ...mapState([
      'prebuilt'
    ]),
    ...mapGetters([
      'getSizeSelected',
      'getPrebuiltByBox'
    ]),
    options() {
      const sizeSelected = this.getSizeSelected
      const sizeNumber = sizeSelected.val === 'onetime' ? 0 : sizeSelected.number_size
      const options = this.getPrebuiltByBox(sizeNumber)
      return options.map(option => {
        return {
          label: option.bundlename,
          size: sizeNumber
        }
      })
    }
  }
}
</script>

<style lang="scss">

.prebuilt {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #EFEDE6;
  border-bottom: 1px solid #EFEDE6;
  padding: 1rem 0.5rem;
  margin-top: .5rem;

  &__info {
    width: 40%;

    &--title {
      font-family: 'Knockout';
      text-transform: uppercase;
      font-size: 1.2rem;
    }
    &--subtitle {
      font-size: .8rem;
    }
  }

  &__select {
    width: 55%;
    font-weight: 500;
    text-transform: capitalize;
    font-size: 1rem;

    .vs__search {
      margin-top: 0;
      font-weight: 500;
      font-family: 'Roboto';
    }

    .vs__dropdown-toggle {
      border-radius: 10px;
      padding: .3rem .3rem .5rem;
    }

    .vs__dropdown-menu {
      border-bottom-right-radius: 10px;
      border-bottom-left-radius: 10px;
      padding: 0;
      top: 80%;
      box-shadow: none;
    }

    .vs__dropdown-option{
      padding: .3rem calc(.5rem + 7px);
      border-top: 1px solid #D3D2D2;
      display: flex;
      align-items: center;
      justify-content: space-between;

      &--radio {
        display: inline-block;
        vertical-align: bottom;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        border: 1px solid #231F20;
      }

      &--highlight {
        background-color: #231F20;
        color: #FCD32B;

        .vs__dropdown-option--radio {
          border-color: #FEFEFE;
          background: radial-gradient(#FCD32B 0%, #FCD32B 35%, transparent 45%, transparent);
        }
      }
    }
  }
}

</style>