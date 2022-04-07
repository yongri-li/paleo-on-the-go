<template>
	<nav :class="['c-dropdown', { 'is-open': isOpen }]" @click="isOpen = !isOpen">
		<header>{{ title }}</header>
		<section class="c-dropdown__wrap">
			<!-- <div @click="isOpen = false">Close</div> -->
			<div>Close</div>
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
			isOpen: false
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
