<template>
	<section class="pdp__tabs">
		<div class="pdp__tabs--wrap">
			<div
				v-for="(val, name, i) in pdpinfo"
				class="pdp__tabs--tab"
				:class="active === i && 'isActive'"
				:key="name"
				@click="selectTab(i)"
			>
				{{ name }}
			</div>
		</div>
		<div class="pdp__tabs--info">
			<article v-for="(val, name, i) in pdpinfo" :key="i" :class="active === i && 'isActive'">
				{{ val }}
			</article>
		</div>
	</section>
</template>

<script>
export default {
	props: {
		pdpinfo: {
			type: Object
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
		}
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
			overflow-x: scroll;
			width: calc(100vw - 1rem);
		}
	}

	&--tab {
		background-color: $color-white;
		border-radius: 25px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 500;
		letter-spacing: 0.25px;
		padding: 0.5rem 1.75rem;
		text-transform: capitalize;
		transition: background-color 175ms;
	}

	&--tab.isActive {
		background-color: $color-secondary;
	}

	&--info {
		position: relative;
		padding: 1.5rem 0;

		article {
			line-height: 1.5;
			opacity: 0;
			transition: opacity 175ms;
		}

		article.isActive {
			opacity: 1;
		}

		article:not(:first-child) {
			position: absolute;
			top: 1.5rem;
		}

		@include media-mobile-down {
			padding-right: 1rem;
		}
	}
}
</style>
