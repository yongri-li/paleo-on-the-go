<template>
  <article>
    <section class="c-hero__imgBg" :style="bgImage">
      <div
        class="c-hero__imgBg--copy"
        :class="{ 'show-whiteBg': content.show_white_bg, 'show-overlayBg': content.show_overlay_bg }"
      >
        <svg width="77" height="6" viewBox="0 0 77 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M77 0H0V6H77V0Z" fill="#231F20" />
        </svg>
        <h2 class="c-h1">{{ content.title }}</h2>
        <svg width="83" height="45" viewBox="0 0 83 45" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M83 22.5193L39.9507 0L20.4626 19.6129H0V25.3871H20.4626L39.9507 45L83 22.5193ZM41.081 7.12149L64.8176 19.5359H28.706L41.081 7.12149ZM64.8176 25.3486L41.081 37.7631L28.706 25.4256L64.8176 25.3486Z"
            fill="#231F20"
          />
        </svg>
      </div>

      <a :href="content.button_url" class="c-button c-button--isDefault c-button--isPrimary">
        {{ content.button_text }}
      </a>
    </section>
  </article>
</template>

<script>
export default {
  props: {
    content: {
      type: Object,
      required: true
    }
  },
  computed: {
    bgImage() {
      return `background-image: url(${this.content.bg_image})`
    }
  }
}
</script>
