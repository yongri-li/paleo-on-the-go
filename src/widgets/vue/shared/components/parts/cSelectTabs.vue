<template>
	<section class="pdp__tabs">
		<template v-if="isSwag">
			<div class="pdp__tabs--wrap">
				<div class="pdp__tabs--tab isActive">
					{{ Object.keys(pdpinfo)[0] }}
				</div>
			</div>
			<div class="pdp__tabs--info">
				<article class="isActive" v-html="description"></article>
			</div>
		</template>
		<template v-else>
			<div class="pdp__tabs--wrap">
				<template v-for="(val, name, i) in pdpinfo">
					<div
						v-if="i < 4"
						class="pdp__tabs--tab"
						:class="active === i && 'isActive'"
						:key="name"
						@click="selectTab(i)"
					>
						{{ name }}
					</div>
				</template>
			</div>
			<div class="pdp__tabs--info">
				<template v-for="(val, name, i) in pdpinfo">
					<article
						v-if="i < 4"
						:key="i"
						:class="active === i && 'isActive'"
						v-html="name !== 'nutrition' ? val : nutritionHtml"
					></article>
				</template>
			</div>
		</template>
	</section>
</template>

<script>
export default {
	props: {
		pdpinfo: {
			type: Object
		},
		isSwag: {
			type: Boolean
		}
	},
	data() {
		return {
			active: 0
		}
	},
	computed: {
		description() {
			return this.pdpinfo.description
		},
		nutritionImg() {
			const imgSrc = this.pdpinfo.nutrition_image
			return imgSrc && !imgSrc.includes('no-image') ? `<img src='${imgSrc}' /><br/>` : ''
		},
		nutritionText() {
			return this.pdpinfo.nutrition
		},
		nutritionHtml() {
			return `${this.nutritionImg} ${this.nutritionText}`
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
			padding-bottom: 1rem;
			overflow-x: scroll;
			width: calc(100vw - 2rem);
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
		padding: 0.25rem 0;
		margin: 1rem 0 1.25rem;
		height: clamp(300px, 24vw, 460px);
		overflow-y: scroll;

		article {
			/*@include text-line-clamp($lines: 8);*/
			height: fit-content;
			line-height: 1.5;
			opacity: 0;
			transition: opacity 175ms;
		}

		article.isActive {
			opacity: 1;
			position: relative;
			z-index: 10;
		}

		article:not(:first-child) {
			position: absolute;
			top: 1.5rem;
		}

		@include media-mobile-down {
			padding: 1rem 1rem 1rem 0;
		}
	}
}
</style>
