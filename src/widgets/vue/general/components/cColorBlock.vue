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
	> div {
		height: 100px;
		width: 100px;
	}

	&--black {
		background-color: $color-black;
	}

	&--yellow {
		background-color: $color-primary;
	}

	&--green {
		background-color: $color-secondary;
	}

	&--grey {
		background-color: $color-grey;
	}

	&--ecru {
		background-color: $color-ecru;
	}
}
</style>
