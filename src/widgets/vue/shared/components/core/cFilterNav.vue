<template>
	<nav class="c-plp__body--nav">
		<div class="trigger-filters" @click="triggerFilters">
			<c-svg class="trigger-filters__icon" name="filter" />
			<span class="trigger-filters__copy">Filters</span>
		</div>
		<c-dropdownFull
			:items="items"
			:isOpen="isOpen"
			:totalItems="totalItems"
			@getFilters="addFilter"
			@closeDropdown="trigCloseDrop"
		/>
		<section class="c-plp__collectionList">
			<ul>
				<li
					v-for="(collection, i) in collections"
					@click="collectionSelect(i)"
					:class="selectedCollection === i && 'selected'"
				>
					{{ collection.title }}
				</li>
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
		totalItems: {
			type: Number
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
			isFilterOpen: false,
			selectedCollection: -1
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
		collectionSelect(index) {
			this.$emit('collection', index)
			this.selectedCollection = index
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
