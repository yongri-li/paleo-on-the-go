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

<style lang="scss">
.c-dropdownFull__wrap {
	.inner-flexwrap,
	.inner-flexwrap > div {
		display: flex;
		align-items: center;
		flex: 1;
		grid-gap: 1.125rem;
	}

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
	}

	.inner-flexwrap.trigger-filters div {
		grid-gap: 0.75rem;
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

		animation-duration: 225ms;
		animation-name: scalePop;

		span {
			padding: 0 0.5rem;
			margin-right: -0.5rem;
			font-weight: 900;
		}
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
