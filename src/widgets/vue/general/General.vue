<template>
	<div>
		<div class="c-heroForm u-textCenter">
			<img class="c-heroForm__image u-hideTabletUp" />
			<img class="c-heroForm__image u-hideMobileDown" />

			<section class="c-heroForm__content">
				<div class="c-smallHeading c-tilesSection__small-heading">
					{{ this.id_test1 }}
					asdasdas dasd dHI WOEW!
				</div>
				<h1 class="c-h1 c-heroForm__heading">
					<!-- 		{{ this.title }} -->
				</h1>
				<div class="c-heroForm__text" />

				<button class="c-heroForm__cta c-cta c-cta--tall" data-bundle-trigger>
					<!-- 	{{ this.cta_text }} -->
					test cta here
				</button>
				<h1 class="c-h1">Headline One</h1>
				<h2 class="c-h2">Headline Two</h2>
				<h3 class="c-h3">Headline Three</h3>
				<h4 class="c-h4">Headline Four</h4>
				<h5 class="c-h5">Headline Five</h5>
				<p>Normal regular paragraph</p>
				<p class="c-p2">Secondary pargraphs</p>
			</section>

			<!-- 			<div class="color__div" v-for="color in colors">
				<div :class="color">{{ color }}</div>
			</div>
 -->

			<c-button class="c-button c-button--isDefault c-button--isBlack" text="Default isBlack Button" />
			<c-button class="c-button c-button--isDefault c-button--isPrimary" text="Get Started" />
			<c-button class="c-button c-button--isDefault c-button--isSecondary" text="isSecondary Button" />
			<c-button class="c-button c-button--isHollow c-button--isBlack" text="isHollow Button" />
			<c-button class="c-button c-button--isHollow c-button--isPrimary" text="isHollow Button" />
			<c-button class="c-button c-button--isHollow c-button--isSecondary" text="isHollow Button" />

			<section class="color__div">
				<div v-for="color in colors">
					<cColorBlock :color="color" />
				</div>
			</section>

			<c-menu />

			<!-- 			<div class="color__div" v-for="color in colors">
				<c-colorBlock :class="color" :testPara="color" />
			</div> -->
			<!-- 			<section class="color__div">
				<div class="color__div--black">black</div>
				<div class="color__div--yellow">yello</div>
				<div class="color__div--green">green</div>
				<div class="color__div--grey">grey</div>
				<div class="color__div--ecru">ecru</div>
			</section> -->
		</div>
	</div>
</template>

<script>
import cColorBlock from './components/cColorBlock.vue'
import cButton from '@shared/components/core/cButton.vue'
import cMenu from '@shared/components/core/cMenu.vue'

export default {
	name: 'General',
	components: { cColorBlock, cButton, cMenu },
	data() {
		return {
			...window.Scoutside.testVue
		}
	},
	computed: {
		colors() {
			return ['black', 'yellow', 'green', 'grey', 'ecru']
		}
		// heroModule() {
		// 	return {
		// 		id_test1: this.id_test1
		// 		// bg_image: this.bg_image,
		// 		// small_title: this.small_title,
		// 		// title: this.title,
		// 		// text: this.text,
		// 		// cta_text: this.cta_text
		// 	}
		// }
	}
}
</script>

<style lang="scss">
/*section {
	color: $color-black;;
}*/
</style>
