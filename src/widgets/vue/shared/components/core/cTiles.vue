<template>
  <section class="c-tilesSection o-containerLarge u-textCenter">
    <div class="u-hideMobileDown">
      <ul class="c-tilesSection__tiles">
        <li
          v-for="(tile, index) in tiles"
          :key="index"
          class="c-tilesSection__tile"
        >
          <c-tile :tile="tile"/>
        </li>
      </ul>
    </div>

    <div class="c-tilesSection__slider u-relative u-hideDesktopUp">
      <div data-tile-slider>
        <div
          v-for="(tile, index) in tiles"
          :key="index"
          class="c-tilesSection__tile"
        >
          <c-tile :tile="tile"/>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import cTile from './cTile.vue'

export default {
  components: {
    cTile
  },
  props: {
    tiles: {
      type: Array,
      required: true
    }
  }
}
</script>