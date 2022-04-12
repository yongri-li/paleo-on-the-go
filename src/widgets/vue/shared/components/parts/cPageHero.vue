<template>
	<article class="c-topHero">
		<section class="c-topHero__ctaWrap">
			<div class="c-topHero__ctaWrap--inner">
				<h4>{{ content.small_heading }}</h4>
				<h1 class="c-h1">{{ content.heading }}</h1>
				<p>{{ content.main_copy }}</p>
				<div class="u-spacer--md u-hideTabletDown"></div>
				<a :href="content.btn_url" class="c-button c-button--isDefault c-button--isPrimary c-button--lrg">
					{{ content.btn_cta }}
				</a>
			</div>
		</section>

		<section class="c-topHero__imgWrap" :style="bgImage"></section>
	</article>
</template>

<script>
export default {
	props: {
		content: {
			type: Object
		}
	},
	computed: {
		bgImage() {
			return `background-image: url(${this.content.bg_image})`
		}
	}
}
</script>

<style lang="scss">
/*///*/
</style>
