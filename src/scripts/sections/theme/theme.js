import '@styles/index.scss'
import { tns } from 'tiny-slider/src/tiny-slider'

if (document.querySelector('[data-tile-slider]')) {
	const copyTiles = tns({
		container: '[data-tile-slider]',
		items: 1,
		slideBy: 1,
		autoplay: true,
		controls: false,
		autoplayButtonOutput: false
	})
}

if (document.querySelector('[data-testimony-slider]')) {
	const sliders = tns({
		container: '[data-testimony-slider]',
		items: 1,
		slideBy: 1,
		autoplay: false,
		controls: false,
		autoplayButtonOutput: false
	})
}
