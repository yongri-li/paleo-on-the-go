<template>
	<article class="c-blogFeatured__main c-topHero c-plp__hero">
		<section class="c-topHero__ctaWrap">
			<div class="c-topHero__ctaWrap--inner">
				<h4>small heading</h4>
				<h1 class="c-h1">{{ title }}</h1>
				<p>{{ published }}</p>
				<div class="u-spacer--md u-hideTabletDown"></div>
				<a href="/" class="c-button c-button--isDefault c-button--isPrimary c-button--lrg"> button </a>
			</div>
		</section>
		<section class="c-topHero__imgWrap" :style="bgImage"></section>
	</article>
</template>

<script>
export default {
	name: 'Blog',
	components: {},
	data() {
		return {
			...window.Scoutside.blog
		}
	},
	computed: {
		bgImage() {
			return `background-image: url(${this.image})`
		}
	}
}
</script>

<style lang="scss">
.c-blogFeatured__main {
	.c-topHero__ctaWrap {
		padding: 0;

		&--inner {
			padding: 3rem;
		}
	}

	.c-topHero__imgWrap {
		flex: 1;
	}
}
</style>
