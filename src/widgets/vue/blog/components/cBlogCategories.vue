<template>
	<header class="c-blogCategories">
		<div class="c-blogCategories__inner">
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
		<hr class="o-containerLarge" />
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
			...window.Scoutside.blog
		}
	},
	methods: {
		categorySelect(e) {
			const category = e.target.getAttribute('category')
			this.$emit('setActiveCategory', category)
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
		padding: 1.5rem 4vw;

		span {
			font-size: 1rem;
			cursor: pointer;
		}
	}

	&__subHead {
		max-width: 998px;
		margin: 2rem auto;
	}

	hr {
		margin-bottom: 2rem;
	}
}
</style>
