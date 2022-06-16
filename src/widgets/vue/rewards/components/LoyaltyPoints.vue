<template>
  <section>
    <c-title-highlight ecru-text="earn" black-text="points" />
    <div data-lion-rules-list></div>
  </section>
</template>

<script>
import cTitleHighlight from './cTitleHighlight.vue'

export default {
  components: {
    cTitleHighlight
  }
}
</script>

<style lang="scss">
#loyaltylion .lion-rules-list {
  position: relative;
  font-size: 10px;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  max-width: 100%;
  gap: 0;

  .lion-rule-item {
    width: 100%;

    @include media-tablet-up {
      /*width: 25%;*/
    }

    padding: 10px;
    display: flex;
    flex: 1 0 auto;
    width: 100%;
    box-sizing: border-box;

    @include media-tablet-up {
      width: 25%;
    }

    &__content {
      background-color: $color-ecru;
      position: relative;
      padding: 15px 5px;
    }

    &__title {
      font-family: $font-heading;
      text-transform: uppercase;
      margin: 1rem 0;
      font-size: 1.5rem;
      padding: 15px 0 5px 0;
      color: $color-black;
      min-height: 74px;
      margin-bottom: 0;

      @include media-desktop-up {
        font-size: 1.75rem;
      }
    }

    &__points {
      font-family: $font-body;
      text-transform: capitalize;
      padding: 15px;
      padding-top: 0;

      .text,
      .value {
        color: $color-black;
        margin: 0;
        font-weight: 600;
        font-size: 1.3rem;
      }
    }

    .lion-rule-item__icon {
      margin-top: 1rem;
      width: 60px;
      height: 60px;
      -webkit-mask: none;
      mask: none;
      background-color: transparent;
    }

    &--authenticated {
      .lion-rule-item {
        &__actions {
          position: absolute;
          bottom: 15px;
          left: 3.5%;
          width: 93%;
          height: 60px;
          background-color: transparent;
          font-size: 0;

          .lion-action-button {
            width: 100%;
            height: 100%;
            border: none;

            &:hover {
              background: transparent;
            }
          }
        }
        &__points {
          background-color: $color-primary;
          height: 60px;
          width: 95%;
          padding: 0;
          @include flex($justify: center);
        }
      }
      .lion-rule-item__limit-reached {
        width: 100%;
        height: 100%;
        background: #fff;
        color: #231300;
        font-weight: 900;
        font-size: 1.25rem;
        justify-content: center;
        gap: 0.5rem;
      }
      .lion-rule-item__limit-reached::before {
        width: 1rem;
        height: 1rem;
        background-color: #000;
      }
      .lion-action-button--disabled {
        padding: 0;
      }
    }

    &--completed-forever {
      .lion-rule-item__actions {
        position: absolute;
        bottom: 15px;
        left: 3%;
        width: 94%;
        height: 60px;
        background-color: $color-white;
        border: 1px solid $color-black;
        font-size: 1rem;

        .lion-action-button {
          @include flex($justify: center);
          &::before {
            content: '✓';
            color: $color-white;
            background-color: $color-black;
            width: 25px;
            height: 25px;
            border-radius: 100%;
            margin-right: 0.5rem;
            @include flex($justify: center);
          }

          &::after {
            content: 'Completed';
            font-family: $font-body !important;
            font-weight: 600;
            line-height: initial;
            color: $color-black;
          }
        }

        .lion-rule-item__completed {
          display: none;
        }
      }
    }
  }
}
</style>
