<template>
  <div class="c-sidebarEditSchedule">
    <!-- v-if="content" -->
    <div class="c-sidebar__line">
      <!--       <c-svg name="chevronDown" class="placeholder-arrow"  formatDate(this.shipDate)  /> -->
      <span>{{ shipDate ? formatDayDateMMIOS(shipDate) : selectDateText }}</span>
      <div class="placeholder-wrap" data-placeholder="Delivery Date: ">
        <datepicker
          v-model="shipDate"
          :required="true"
          :open-date="thisWeek"
          :disabled-dates="disabledDates"
          :inline="true"
          :highlighted="availableForDelivery"
          format="D, MMMM dsu"
          :placeholder="selectDateText"
        >
          <!-- :inline="true" -->
          <!-- <div slot="beforeCalendarHeader" class="calender-header">test choose a date</div> -->
        </datepicker>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { format } from 'date-fns'
import cFormShipping from '../forms/cFormShipping.vue'
import Datepicker from 'vuejs-datepicker'
import { convertToYYYYMMDDlocalT } from '@shared/utils'

export default {
  data() {
    return {
      availableForDelivery: {
        days: [1, 2, 5, 6]
      },
      disabledDates: {
        to: new Date(),
        from: new Date(2022, 4, 29)
      },
      selectDateText: 'Click to Select',
      shipDate: new Date(2022, 2, 25),
      thisWeek: null
    }
  },
  props: {
    content: {
      type: Object
    },
    modifiers: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    formatDayDateMMIOS(date) {
      const dateStr = convertToYYYYMMDDlocalT(date)
      return dateStr != null ? format(new Date(dateStr), 'ddd, MMM D') : null
    }
  },
  components: { Datepicker }
}
</script>

<style lang="scss">
.c-sidebarEditSchedule {
  background-color: $color-white;
  padding: 2rem 1.5rem;
}
</style>
