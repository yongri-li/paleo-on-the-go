<template>
	<article class="c-blogFeatured__main">
		<section class="c-topHero__ctaWrap">
			<div class="c-topHero__ctaWrap--inner">
				<h3 class="post-title">Featured Post</h3>
				<h1 class="c-h1">{{ title }}</h1>
				<p v-html="excerpt"></p>
				<div class="u-spacer--md u-hideTabletDown"></div>
				<a :href="article_url" class="c-button c-button--isDefault c-button--isPrimary c-button--lrg"
					>Read More</a
				>
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
	height: clamp(480px, 50vh, 600px);
	display: flex;
	background-color: $color-black;
	color: $color-white;

	.c-topHero__ctaWrap {
		padding: 0;

		&--inner {
			padding: 3rem;

			.post-title {
				letter-spacing: 1px;
				text-transform: uppercase;
			}

			.c-h1 {
				color: $color-primary;
			}
		}
	}

	.c-topHero__imgWrap {
		flex: 1;
	}

	@include media-mobile-down {
		height: 100%;
	}
}
</style>
