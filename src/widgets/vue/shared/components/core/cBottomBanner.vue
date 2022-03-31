<template>
  <article class="c-homeBtm__banner">
    <section>
      <h2 class="c-h2">{{ content.tagline }}</h2>
      <div>
        <!-- Klayvio Embed here -->
        <input type="text" placeholder="Email Address" />
        <button class="c-button c-button--isDefault c-button--isPrimary">Submit</button>
      </div>
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
  }
}
</script>
