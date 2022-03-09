<template>
  <div
    :class="['c-checkbox', {
      'c-checkbox--checked': checked
    }]"
    @click.stop="$emit('checked')"
  >
    <div class="c-checkbox__box">
      <c-icon icon="checkmark" />
    </div>
    {{ title }}
  </div>
</template>

<script>
  import cIcon from "@shared/components/core/cIcon.vue";
  export default {
    name: "cCheckbox",
    props: {
      title: {
        type: String
      },
      checked: {
        type: Boolean
      }
    },
    components: {
      cIcon
    }
  };
</script>

