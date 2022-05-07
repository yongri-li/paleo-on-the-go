<template>
	<section class="pdp__tabs mg-btm--md">
		<div class="pdp__tabs--wrap">
			<div
				v-for="(val, i) in variantInfo"
				class="pdp__tabs--varTab"
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
	computed: {},
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
.pdp__tabs {
	padding: 1rem 0;

	&--wrap {
		display: flex;
		align-items: center;
		justify-content: space-between;

		@include media-mobile-down {
			grid-gap: 0.75rem;
			padding-bottom: 1rem;
			overflow-x: scroll;
			width: calc(100vw - 2rem);
		}
	}

	&--varTab {
		border: 2px solid $color-black;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 500;
		letter-spacing: 0.25px;
		min-width: 124px;
		padding: 0.5rem 1.75rem;
		text-align: center;
		text-transform: capitalize;
		transition: all 175ms;
	}

	&--varTab.isActive {
		background-color: $color-black;
		color: $color-white;
	}

	&--varTab.notAvailable {
		background: linear-gradient(to top left, transparent calc(50% - 1px), #000, transparent calc(50% + 1px));
		opacity: 0.33;
		pointer-events: none;
	}
}
</style>
