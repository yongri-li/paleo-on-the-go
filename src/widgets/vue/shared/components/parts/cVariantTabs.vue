<template>
	<section class="variants">
		<div class="variants__wrap">
			<div
				v-for="(val, i) in variantInfo"
				class="variants__wrap--tab"
				:class="{ isActive: active === i && val.available, notAvailable: val.available === false }"
				:key="i"
				@click="selectTab(i)"
			>
				{{ val.public_title }}
			</div>
		</div>
	</section>
</template>

<script>
export default {
	props: {
		variantInfo: {
			type: [Array, Object]
		}
	},
	data() {
		return {
			active: 0
		}
	},
	methods: {
		selectTab(tab) {
			this.active = tab
			this.$emit('selectedVar', tab)
		},
		selectFirstAvailable() {
			const index = this.variantInfo.findIndex(prd => prd.available)
			this.active = index
			this.$emit('selectedVar', index)
		}
	},
	mounted() {
		this.selectFirstAvailable()
	}
}
</script>

<style lang="scss">
.variants {
	padding: 1rem 0;
	margin-bottom: 1rem;

	width: 100%;
	overflow-x: auto;
	min-height: 70px;

	&__wrap {
		display: flex;
		align-items: center;
		justify-content: space-between;

		@include media-mobile-down {
			grid-gap: 0.75rem;
			padding-bottom: 1rem;
			overflow-x: scroll;
			width: calc(100vw - 2rem);
		}

		&--tab {
			border: 2px solid $color-black;
			cursor: pointer;
			font-size: 1rem;
			font-weight: 500;
			letter-spacing: 0.25px;
			min-width: 120px;
			padding: 0.5rem 1.75rem;
			text-align: center;
			text-transform: capitalize;
			transition: all 175ms;
		}

		&--tab.isActive {
			background-color: $color-black;
			color: $color-white;
		}

		&--tab.notAvailable {
			background: linear-gradient(
				to top left,
				transparent calc(50% - 1px),
				#000,
				transparent calc(50% + 1px)
			);
			opacity: 0.33;
			pointer-events: none;
		}
	}
}
</style>
