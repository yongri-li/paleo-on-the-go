<template>
	<header class="c-blogCategories">
		<button class="c-blogCategories__filter u-hideTabletUp" @click="toggleFilters">
			Filter by Category <span :style="filterOpen && openedCss[1]">&#9662;</span>
		</button>
		<div class="c-blogCategories__inner" :style="filterOpen && openedCss[0]">
			<span
				v-for="category in categories"
				:category="category.tag_link"
				@click="categorySelect"
				:class="activeCategory === category.tag_link && 'active'"
			>
				{{ category.tag_link }}
			</span>
		</div>
		<h2 class="c-h2 c-blogCategories__subHead">{{ heading }}</h2>
		<hr class="o-containerLarge u-hideMobileDown" />
	</header>
</template>

<script>
export default {
	name: 'Categories',
	props: {
		activeCategory: {
			type: String
		}
	},
	components: {},
	data() {
		return {
			...window.Scoutside.blog,
			filterOpen: false
		}
	},
	computed: {
		openedCss() {
			const height = this.categories.length * 65
			return [`height: ${height}px; padding-top: 84px`, 'transform: rotateZ(180deg)']
		}
	},
	methods: {
		categorySelect(e) {
			const category = e.target.getAttribute('category')
			this.$emit('setActiveCategory', category)
		},
		toggleFilters() {
			this.filterOpen = !this.filterOpen
		}
	}
}
</script>

<style lang="scss">
.c-blogCategories {
	text-align: center;

	&__inner {
		background-color: $color-ecru;
		display: flex;
		align-items: center;
		justify-content: center;
		grid-gap: clamp(1rem, 4vw, 4rem);
		padding: 1.5rem 4vw 0;
		overflow-y: scroll;

		span {
			border-bottom: 2px solid $color-ecru;
			cursor: pointer;
			font-size: 1rem;
			padding-bottom: 1.25rem;
		}

		span.active {
			border-bottom: 3px solid $color-black;
		}
	}

	&__subHead {
		max-width: 998px;
		margin: 2.5rem auto;
	}

	hr {
		margin-bottom: 2rem;
	}

	@include media-mobile-down {
		&__inner {
			flex-direction: column;
			height: 66px;
			transition: all 200ms;

			span {
				padding-bottom: 0.5rem;
				margin-bottom: 0.75rem;
			}
		}

		&__filter {
			position: absolute;
			left: 0;
			width: 100%;
			height: 66px;
			border: none;
			background-color: $color-ecru;
			box-shadow: 0px 2px 5px rgb(0 0 0 / 10%);
			color: $color-black;
			font-family: $font-body;
			font-size: 1rem;

			span {
				position: absolute;
				right: 1.25rem;
				font-size: 1.5rem;
				line-height: 0.85;
				opacity: 0.6;
				transition: transform 200ms;
			}
		}

		&__subHead {
			padding: 0 1rem;
		}
	}
}
</style>
