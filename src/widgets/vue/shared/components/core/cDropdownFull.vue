<template>
	<nav :class="['c-dropdownFull', { 'is-open': isOpen }]">
		<section class="c-dropdownFull__wrap">
			<section class="inner-flexwrap">
				<div @click="closeDropdown">Close &#10005;</div>
				<div>
					<div class="item-tabs" v-for="tab in filters" :data-val="tab">
						{{ tab }} <span @click="handleFilter('cut', $event)"> &#10005;</span>
					</div>
				</div>
			</section>
			<hr />
			<section class="inner-flexwrap">
				<div>&nbsp;</div>
				<div>
					<div
						class="select-items"
						v-for="item in items"
						:data-val="item"
						@click="handleFilter('add', $event)"
					>
						{{ item }}
					</div>
				</div>
			</section>
		</section>
	</nav>
</template>

<script>
import { handleize } from '../../utils'

export default {
	name: 'DropdownFull',
	props: {
		items: {
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
			filters: []
		}
	},
	methods: {
		handleFilter(action, e) {
			const filters = this.filters
			if (action === 'add') {
				const filter = e.target.dataset.val
				!filters.some(itm => itm === filter) ? filters.push(filter) : null
			} else {
				const filter = e.target.parentElement.dataset.val
				const newArr = filters.filter(itm => itm !== filter)
				this.filters = newArr
			}
			const filterHandles = this.filters.map(filter => handleize(filter))
			this.$emit('getFilters', filterHandles)
		},
		closeDropdown() {
			this.$emit('closeDropdown')
		}
	}
}
</script>

<style lang="scss">
.c-dropdownFull__wrap {
	.inner-flexwrap,
	.inner-flexwrap > div {
		display: flex;
		flex: 1;
		grid-gap: 1.25rem;
	}

	.inner-flexwrap {
		min-height: 3.125rem;
		align-items: center;
	}

	.inner-flexwrap > div:last-child {
		flex: 4.25;
	}

	.item-tabs {
		background-color: $color-black;
		border-radius: 25px;
		color: $color-white;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 500;
		letter-spacing: 0.25px;
		padding: 0.5rem 1rem;

		span {
			padding: 0 0.5rem;
			margin-right: -0.5rem;
			font-weight: 900;
		}
	}
}
</style>
