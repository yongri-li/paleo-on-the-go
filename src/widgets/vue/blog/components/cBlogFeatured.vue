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
					class="c-button c-button--isDefault c-button--isPrimary c-button--lrg c-button--fixWidthMd"
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
			/*padding: 3rem 33% 3rem 3rem;*/
			padding: 3rem 12vw 3rem 6vw;

			.post-title {
				letter-spacing: 1px;
				text-transform: uppercase;
			}

			.c-h1 {
				color: $color-primary;
			}

			p {
				letter-spacing: 0.5px;
				line-height: 1.7;
			}
		}
	}

	.c-topHero__imgWrap {
		flex: 1;
		background-position: center;
	}

	@include media-mobile-down {
		height: auto;
		min-height: 100%;
		flex-direction: column-reverse;

		.c-topHero__ctaWrap {
			justify-content: flex-start;

			&--inner {
				padding: 2rem 1rem 3rem;
				text-align: left;

				p {
					padding: 0;
				}
			}
		}

		.c-topHero__imgWrap {
			min-height: 62vh;
		}
	}
}
</style>
