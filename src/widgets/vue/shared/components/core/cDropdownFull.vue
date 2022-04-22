<template>
	<nav :class="['c-dropdownFull', { 'is-open': isOpen, 'is-shrink': isShrink }]">
		<section class="c-dropdownFull__wrap">
			<section class="inner-flexwrap trigger-filters">
				<div @click="handleDropdown">
					<c-svg class="trigger-filters__icon" name="filter" />
					<span class="trigger-filters__copy">{{ isShrink ? 'Filters' : 'Close' }}</span>
				</div>
				<div>
					<section>
						<div class="item-tabs" v-for="tab in filters" :data-val="tab">
							{{ tab }} <span @click="handleFilter('cut', $event)"> &#10005;</span>
						</div>
						<strong v-if="filters.length > 0" @click="clearFilters">Clear Filters</strong>
					</section>
				</div>
			</section>
			<hr />
			<section class="inner-flexwrap">
				<div>&nbsp;</div>
				<div class="inner-flexwrap--col">
					<h4 class="inner-flexwrap__title">Preferences</h4>
					<section class="inner-flexwrap">
						<div class="select-items" v-for="item in items" @click="handleFilter('toggle', $event)">
							<label :for="item.name" class="inner-flexwrap">
								<input type="checkbox" :id="item.name" :name="item.name" :data-val="item.name" />
								<span class="checkmark"></span>
								<c-svg class="" :name="item.icon" />{{ item.name }}
							</label>
						</div>
					</section>
				</div>
			</section>
		</section>
	</nav>
</template>

<script>
import { handleize } from '../../utils'
import cSvg from '@shared/components/core/cSvg.vue'

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
			filters: [],
			isShrink: false
		}
	},
	components: {
		cSvg
	},
	methods: {
		handleFilter(action, e) {
			const filters = this.filters
			const filter = e.target.dataset.val
			if (filter && action === 'toggle') {
				if (filters.some(itm => itm === filter)) {
					const newArr = filters.filter(itm => itm !== filter)
					this.filters = newArr
				} else {
					filters.push(filter)
				}
			} else if (action === 'cut') {
				const filter = e.target.parentElement.dataset.val
				const newArr = filters.filter(itm => itm !== filter)
				const currentCheck = document.getElementById(filter)
				if (currentCheck?.id === filter) currentCheck.checked = false
				this.filters = newArr
			} else return
			const filterHandles = this.filters.map(filter => handleize(filter))
			this.$emit('getFilters', filterHandles)
		},
		clearFilters() {
			this.filters = []
			this.$emit('getFilters', this.filters)
			const checkboxes = document.querySelectorAll('.select-items input')
			checkboxes.forEach(box => (box.checked = false))
		},
		handleDropdown() {
			this.filters.length ? (this.isShrink = !this.isShrink) : this.$emit('closeDropdown')
		}
	},
	watch: {
		filters() {
			if (!this.filters.length && this.isShrink) {
				this.$emit('closeDropdown')
				setTimeout(() => (this.isShrink = false), 250)
			}
		}
	}
}
</script>

<style lang="scss">
.c-dropdownFull__wrap {
	.inner-flexwrap,
	.inner-flexwrap > div {
		display: flex;
		align-items: center;
		flex: 1;
		grid-gap: 1.125rem;
	}

	.inner-flexwrap > div {
		overflow-y: scroll;
	}

	.inner-flexwrap > div section {
		display: flex;
		align-items: center;
		grid-gap: 1rem;
	}

	/*.inner-flexwrap > div section .inner-flexwrap {*/
	.inner-flexwrap {
		min-height: 3rem;
		align-items: center;

		strong {
			font-size: 1rem;
			text-decoration: underline;
		}

		&__title {
			text-transform: uppercase;
			letter-spacing: 1px;
			margin-bottom: 0;
		}
	}

	div.inner-flexwrap--col {
		flex-direction: column;
		align-items: flex-start;
		grid-gap: 0.5rem;

		.inner-flexwrap {
			width: 100%;
		}

		@include media-mobile-down {
			& > .inner-flexwrap {
				flex-direction: column;
				align-items: flex-start;
			}
		}
	}

	.inner-flexwrap.trigger-filters {
		div {
			grid-gap: 0.75rem;
		}
	}

	@include media-mobile-down {
		.inner-flexwrap.trigger-filters {
			margin-bottom: 0;

			div:nth-child(2) {
				flex: 10;
			}
		}

		hr + .inner-flexwrap > div:first-child {
			flex: 0;
			width: 0;
		}
	}

	.inner-flexwrap > div:last-child {
		flex: 4.25;
	}

	.inner-flexwrap > div.select-items:last-child {
		flex: 2.25;
	}

	.select-items {
		cursor: pointer;
		input,
		label {
			cursor: pointer;
		}

		label {
			position: relative;
			padding-left: 2rem;
			user-select: none;
		}

		input {
			position: absolute;
			opacity: 0;
			height: 0;
			width: 0;
		}

		/* Create a custom checkbox */
		.checkmark {
			position: absolute;
			border: 1px solid $color-black;
			border-radius: 3px;
			left: 0;
			height: 1.25rem;
			width: 1.25rem;
		}

		input:checked ~ .checkmark {
			background-color: $color-black;
		}

		.checkmark:after {
			content: '';
			position: absolute;
			display: none;
			left: 7px;
			top: 3px;
			width: 5px;
			height: 10px;
			border: solid #fff;
			border-width: 0 2px 2px 0;
			transform: rotate(45deg);
		}

		/* Show the checkmark when checked */
		input:checked ~ .checkmark:after {
			display: block;
		}
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
		white-space: nowrap;

		animation-duration: 225ms;
		animation-name: scalePop;

		span {
			padding: 0 0.5rem;
			margin-right: -0.5rem;
			font-weight: 900;
		}
	}

	strong {
		white-space: nowrap;
	}

	@keyframes scalePop {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.05);
		}
		100% {
			transform: scale(1);
		}
	}
}
</style>
