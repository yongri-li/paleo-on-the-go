<template>
	<article class="c-blogFeatured">
		<section class="c-topHero__ctaWrap">
			<div class="c-topHero__ctaWrap--inner">
				<h3 class="post-title">Featured Post</h3>
				<h1 class="c-h1">{{ !isAll && hasFeatured ? featured.title : all_featured.title }}</h1>
				<p v-html="!isAll && hasFeatured ? featured.excerpt : all_featured.excerpt"></p>
				<div class="u-spacer--md u-hideTabletDown"></div>
				<a
					:href="!isAll && hasFeatured ? featured.article_url : all_featured.article_url"
					class="c-button c-button--isDefault c-button--isPrimary c-button--lrg"
					>Read More</a
				>
			</div>
		</section>
		<section class="c-topHero__imgWrap" :style="bgImage"></section>
	</article>
</template>

<script>
export default {
	name: 'Featured',
	props: {
		activeCategory: {
			type: String
		}
	},
	components: {},
	data() {
		return {
			...window.Scoutside.blog
		}
	},
	computed: {
		isAll() {
			return this.activeCategory === 'All' ? true : false
		},
		hasFeatured() {
			return !!this.featured
		},
		bgImage() {
			const bgImg =
				this.isAll || !this.hasFeatured
					? `background-image: url(${this.all_featured.image})`
					: `background-image: url(${this.featured.image})`
			return bgImg
		}
	}
}
</script>

<style lang="scss">
.c-blogFeatured {
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
		background-position: center;
	}

	@include media-mobile-down {
		height: 100%;
	}
}
</style>
