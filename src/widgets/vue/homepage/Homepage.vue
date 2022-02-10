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

			<!-- 			<nav role="navigation">
				<ul>
					<li>
						<a href="#" aria-haspopup="true">Two</a>
						<ul class="dropdown" aria-label="submenu">
							<li><a href="#">Sub-1</a></li>
							<li><a href="#">Sub-2</a></li>
							<li><a href="#">Sub-3</a></li>
						</ul>
					</li>
				</ul>
			</nav> -->

			<!-- <nav> -->
			<!-- 			<nav :class="['c-dropdown', { 'is-open': isOpen }]" @click="isOpen = !isOpen">
				<header>This is the top</header>
				<section class="c-dropdown--wrap">
					<div><a href="#">One Clk</a></div>
					<div>Tow</div>
					<div>Three</div>
				</section>
			</nav> -->

			<c-dropdown :items="listItems" />

			<br />
			<br />
			<br />
			<br />

			<!-- /// -->
		</div>
	</div>
</template>

<script>
import cColorBlock from '@shared/components/parts/cColorBlock.vue'
import cButton from '@shared/components/core/cButton.vue'
import cMenu from '@shared/components/core/cMenu.vue'
import cDropdown from '@shared/components/core/cDropdown.vue'

export default {
	name: 'Homepage',
	components: { cColorBlock, cButton, cMenu, cDropdown },
	data() {
		return {
			...window.Scoutside.testVue,
			isOpen: false
		}
	},
	computed: {
		colors() {
			return ['black', 'yellow', 'green', 'grey', 'ecru']
		},
		listItems() {
			return ['Item One', 'Item Two', 'Yo yo yo!']
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

/*nav.c-dropdown {
	display: flex;
	flex-direction: column;
	position: relative;
	width: 150px;

	section .wrap {
		position: absolute;
		width: 100%;
		top: 0;
		left: 0;
		pointer-events: none;
	}

	section div {
		background: orange;
		opacity: 0;
		min-width: 5rem;
		transition: opacity 1s ease;
	}

	section:hover {
		cursor: pointer;

		.wrap {
			display: block;
			pointer-events: auto;
		}
	}

	section:hover div {
		opacity: 1;
	}
}*/

a {
	text-decoration: none;
}

ul {
	background: darkorange;
	list-style: none;
	margin: 0;
	padding-left: 0;
}

li {
	color: #fff;
	background: darkorange;
	display: block;
	float: left;
	padding: 1rem;
	position: relative;
	text-decoration: none;
	transition-duration: 0.5s;
}

li a {
	color: #fff;
}

li:hover,
li:focus-within {
	background: red;
	cursor: pointer;
}

li:focus-within a {
	outline: none;
}

ul li ul {
	background: orange;
	visibility: hidden;
	opacity: 0;
	min-width: 5rem;
	position: absolute;
	transition: all 0.5s ease;
	margin-top: 1rem;
	left: 0;
	display: none;
}

ul li:hover > ul,
ul li:focus-within > ul,
ul li ul:hover,
ul li ul:focus {
	visibility: visible;
	opacity: 1;
	display: block;
}

ul li ul li {
	clear: both;
	width: 100%;
}
</style>
