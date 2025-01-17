import '@styles/index.scss'
import { tns } from 'tiny-slider/src/tiny-slider'

const windowPath = window.location.pathname
// if (windowPath === '/account') window.location.href = '/account#/shipments/'
const isHomepage = document.querySelector('.o-homepage')
const getStartedBtns = document.querySelectorAll('[data-get-started]')
const boxTabs = document.querySelectorAll('.js--planClk')
const logoutLinks = document.querySelectorAll('[data-logout-link]')

if (!windowPath.includes('/bundle')) sessionStorage.removeItem('fromPortal')
if (windowPath.includes('/tools/recurring/portal/')) window.location.href = '/account#/shipments/'

//  comment: if (windowPath.includes('/tools/recurring/portal/')) window.location.href = '/pages/under-construction'
//  console.log(windowPath, windowPath.includes('/account#/'))
//  if (windowPath.includes('/account')) window.location.href = '/pages/under-construction'

//  dynamic link and boxsize on getstarted plan btn clicks
const sendBoxInfo = btn => {
	sessionStorage.setItem('startBtnClk', true)
	sessionStorage.setItem('boxSize', btn.dataset.boxsize)
	window.location.href = '/pages/bundle/#/subscription'
}
getStartedBtns.forEach(btn => btn.addEventListener('click', () => sendBoxInfo(btn)))

if (isHomepage) boxTabs.forEach(box => box.addEventListener('click', () => sendBoxInfo(box)))

logoutLinks.forEach(lnk =>
	lnk.addEventListener('click', () => {
		localStorage.removeItem('vuex')
		localStorage.setItem('last_email', customer.email)
	})
)

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

// Toggles Menu and FAQs accordions on Homepage, and show active menu items
if (isHomepage) {
	const faqsWrappers = document.querySelectorAll('.c-homeFaqs button')
	const menuWrappers = document.querySelectorAll('.c-homeMenu__flex .c-homeFaqs__item button')
	const menuNodes = document.querySelectorAll('[data-group]')
	const panelNodes = document.querySelectorAll('.c-homeMenu__flex .panel-answer')

	faqsWrappers.forEach(item => {
		item.addEventListener('click', function (e) {
			const panel = this.nextElementSibling
			this.classList.toggle('active')

			panel.style.maxHeight
				? (panel.style.maxHeight = null)
				: (panel.style.maxHeight = panel.scrollHeight + 'px')
		})
	})

	menuWrappers.forEach(item => {
		item.addEventListener('click', function (e) {
			const groupNum = this.dataset.index * 1
			const menuNodes = document.querySelectorAll('[data-group]')
			const menuItems = [...menuNodes]
			const accordions = [...menuWrappers]

			this.classList.toggle('active')

			accordions.map(acc => {
				if (acc !== this) {
					acc.classList.remove('active')
					const pan = acc.nextElementSibling
					pan.style.maxHeight = null
				} else {
					const panel = this.nextElementSibling
					panel.style.maxHeight
						? (panel.style.maxHeight = null)
						: (panel.style.maxHeight = panel.scrollHeight + 'px')
				}
			})

			menuItems.map(grp => {
				const ind = grp.dataset.group * 1
				ind !== groupNum ? (grp.style.display = 'none') : (grp.style.display = 'block')
			})
		})
	})
}

// shrink header nav and logo on scroll
document.addEventListener('scroll', e => {
	let scrollPosition = window.scrollY
	const header = document.querySelector('.c-header')
	if (header) {
		scrollPosition > 0 ? header.classList.add('scrolled') : header.classList.remove('scrolled')
	}
})
