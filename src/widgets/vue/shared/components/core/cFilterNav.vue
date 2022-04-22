<template>
	<nav class="c-plp__body--nav">
		<div class="trigger-filters" @click="triggerFilters">
			<c-svg class="trigger-filters__icon" name="filter" />
			<span class="trigger-filters__copy">Filters</span>
		</div>
		<c-dropdownFull :items="items" :isOpen="isOpen" @getFilters="addFilter" @closeDropdown="trigCloseDrop" />
		<section class="c-plp__collectionList">
			<ul>
				<li v-for="(collection, i) in collections" @click="$emit('collection', i)">{{ collection.title }}</li>
			</ul>
		</section>
	</nav>
</template>

<script>
import { handleize } from '../../utils'
import cSvg from '@shared/components/core/cSvg.vue'
import cDropdownFull from '@shared/components/core/cDropdownFull.vue'

export default {
	name: 'FilterNav',
	props: {
		items: {
			type: Array,
			required: true
		},
		collections: {
			type: Array,
			required: true
		},
		isOpen: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			filters: [],
			isFilterOpen: false
		}
	},
	components: {
		cSvg,
		cDropdownFull
	},
	methods: {
		addFilter(filters) {
			console.log('asad', filters)
			this.$emit('getFilters', filters)
		},
		trigCloseDrop() {
			this.isFilterOpen = false
			this.$emit('trigger', this.isFilterOpen)
		},
		triggerFilters() {
			this.isFilterOpen = !this.isFilterOpen
			this.$emit('trigger', this.isFilterOpen)
		}
	}
}
</script>
