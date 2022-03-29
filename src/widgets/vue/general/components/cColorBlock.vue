<template>
	<div :class="`color__div--${color}`">{{ color }}</div>
</template>

<script>
export default {
	props: {
		color: {
			type: String
		}
	}
}
</script>

<style lang="scss">
.color__div {
	&--black {
		background-color: $color-black;
		height: 100px;
		width: 100px;
	}

	&--yellow {
		background-color: $color-primary;
		height: 100px;
		width: 100px;
	}

	&--green {
		background-color: $color-secondary;
		height: 100px;
		width: 100px;
	}

	&--grey {
		background-color: $color-grey;
		height: 100px;
		width: 100px;
	}

	&--ecru {
		background-color: $color-ecru;
		height: 100px;
		width: 100px;
	}
}
</style>
