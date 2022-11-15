document.addEventListener('DOMContentLoaded', function () {
	function iOSversion() {
		let d, v
		if (/iP(hone|od|ad)/.test(navigator.platform)) {
			v = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)
			d = {
				status: true,
				version: parseInt(v[1], 10),
				info: parseInt(v[1], 10) + '.' + parseInt(v[2], 10) + '.' + parseInt(v[3] || 0, 10)
			}
		} else {
			d = { status: false, version: false, info: ' ' }
		}
		return d
	}

	let iosVer = iOSversion()
	if (iosVer.status) {
		const mealBox = document.querySelector('.meal-cart__info')
		if (+iosVer.version >= 16) mealBox.style.height = 'calc(100vh - 132px)'
	} else {
		console.log('not iPhone or iPad')
	}
})
