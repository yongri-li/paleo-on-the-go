<template>
	<article class="c-blogMain">
		<cBlogFeatured :activeCategory="activeCategory" />
		<cBlogCategories @setActiveCategory="activate" :activeCategory="activeCategory" />
	</article>
</template>

<script>
import cBlogFeatured from './components/cBlogFeatured.vue'
import cBlogCategories from './components/cBlogCategories.vue'

export default {
	name: 'Blog',
	components: { cBlogFeatured, cBlogCategories },
	data() {
		return {
			activeCategory: 'All',
			currentUrl: location.pathname,
			isCategory: location.pathname.includes('tagged'),
			handle: Scoutside.blog.type
		}
	},
	methods: {
		activate(val) {
			if (val === 'All') {
				location.pathname = `/blogs/${this.handle}`
				return
			}
			const newUrl = this.isCategory
				? (this.currentUrl.split('/tagged')[0] += `/tagged/${val}`)
				: `${this.currentUrl}/tagged/${val}`
			location.pathname = newUrl
		}
	},
	mounted() {
		if (this.isCategory) this.activeCategory = this.currentUrl.split('/tagged/')[1]
	}
}
</script>
