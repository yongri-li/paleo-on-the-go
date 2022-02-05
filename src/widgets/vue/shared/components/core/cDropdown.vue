<template>
	<nav :class="['c-dropdown', { 'is-open': isOpen }]" @click="isOpen = !isOpen">
		<header>{{ title }}</header>
		<section class="c-dropdown--wrap">
			<div v-for="item in items" @click="handleSelect">
				{{ item }}
			</div>
		</section>
	</nav>
</template>

<script>
export default {
	name: 'Dropdown',
	props: {
		title: {
			type: String,
			default: 'Dropdown Title'
		},
		items: {
			type: Array,
			required: true
		}
	},
	data() {
		return {
			isOpen: false,
			textt: 'This is the top'
		}
	},
	methods: {
		handleSelect(e) {
			this.title = e.target.textContent
		}
	}
}
</script>

<style></style>
