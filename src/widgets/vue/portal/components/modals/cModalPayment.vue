<template>
	<div :class="_buildModifiers('c-modalPaymentUpdate', modifiers)" v-if="content">
		<c-h
			class="c-modalPaymentUpdate__heading c-modal__heading"
			tag="h2"
			level="2"
			:text="content.heading"
			:modifiers="['isBolder']"
		/>
		<c-p
			class="c-modalPaymentUpdate__text"
			tag="p"
			level="2"
			:text="content.text"
			:modifiers="['isBolder']"
		/>
		<iframe class="c-sidebar__iframe" :src="src" frameborder="0" />
	</div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'

import cH from '@shared/components/core/cH.vue'
import cP from '@shared/components/core/cP.vue'

export default {
	props: {
		content: {
			type: Object,
			required: true
		},
		modifiers: {
			type: Array,
			default: () => []
		}
	},
	components: {
		cH,
		cP
	},
	computed: {
		...mapGetters('customer', ['customerRecharge']),
		src() {
			const { customerRecharge } = this
			if (customerRecharge) {
				return `https://shopifysubscriptions.com/customer_portal_payment_source_form/${customerRecharge.hash}/payment_source`
			}
		}
	}
}
</script>

<style lang="scss">
.c-modalPaymentUpdate {
	padding: 1.75rem 1.25rem;
	@include flex($direction: column);
	text-align: center;

	.c-sidebar__iframe {
		min-height: 300px;
	}
}
.c-modalPaymentUpdate__confirm {
	margin-top: 20px;
}
.c-modalPaymentUpdate__text {
	margin-bottom: 32px;
}
.c-modalPaymentUpdate__cta {
	width: 100%;
	max-width: 340px;
	margin: 0 auto;
}
</style>
