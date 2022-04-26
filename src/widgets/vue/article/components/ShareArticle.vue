<template>
  <div class="share-content">
    <div class="share-title">
      SHARE THIS ARTICLE
    </div>
    <div class="share-list">
      <a :href="twitterLink" target="_blank" class="share-list__item">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C5.373 0 0 5.373 0 12C0 18.627 5.373 24 12 24C18.627 24 24 18.627 24 12C24 5.373 18.627 0 12 0ZM18.066 9.645C18.249 13.685 15.236 18.189 9.902 18.189C8.28 18.189 6.771 17.713 5.5 16.898C7.024 17.078 8.545 16.654 9.752 15.709C8.496 15.686 7.435 14.855 7.068 13.714C7.519 13.8 7.963 13.775 8.366 13.665C6.985 13.387 6.031 12.143 6.062 10.812C6.45 11.027 6.892 11.156 7.363 11.171C6.084 10.316 5.722 8.627 6.474 7.336C7.89 9.074 10.007 10.217 12.394 10.337C11.975 8.541 13.338 6.81 15.193 6.81C16.018 6.81 16.765 7.159 17.289 7.717C17.943 7.589 18.559 7.349 19.113 7.02C18.898 7.691 18.443 8.253 17.85 8.609C18.431 8.539 18.985 8.385 19.499 8.156C19.115 8.734 18.629 9.24 18.066 9.645Z" fill="#231F20"/>
        </svg>
        <span>Twitter</span>
      </a>
      <a :href="facebookLink" target="_blank" class="share-list__item">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C5.373 0 0 5.373 0 12C0 18.627 5.373 24 12 24C18.627 24 24 18.627 24 12C24 5.373 18.627 0 12 0ZM15 8H13.65C13.112 8 13 8.221 13 8.778V10H15L14.791 12H13V19H10V12H8V10H10V7.692C10 5.923 10.931 5 13.029 5H15V8Z" fill="#231F20"/>
        </svg>
        <span>Facebook</span>
      </a>
      <div class="share-list__item" @click="copyClipboard">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24ZM9.45186 9.45157C9.14968 9.6184 8.86557 9.82956 8.60947 10.0856L6.09864 12.5974C4.63379 14.0621 4.63379 16.4368 6.09864 17.9015C7.56349 19.3662 9.9384 19.3662 11.4032 17.9015L13.1119 16.1929C12.3664 16.2484 11.6115 16.1369 10.9074 15.8575L10.1332 16.6316C9.37078 17.394 8.13052 17.394 7.36806 16.6316C6.60559 15.8692 6.60559 14.6291 7.36806 13.8667L9.87889 11.3549C10.1502 11.0837 10.4821 10.9093 10.8315 10.8311C11.7597 10.6234 12.6925 11.1111 13.0682 11.968L14.3784 10.6584C13.2957 9.017 11.1361 8.52351 9.45186 9.45157ZM10.8887 7.80662L12.5974 6.09809C14.0623 4.63397 16.4366 4.63397 17.9014 6.09809C19.3663 7.5628 19.3663 9.93747 17.9009 11.4022L15.39 13.9133C15.1339 14.1694 14.8498 14.3806 14.5476 14.5474C13.7198 15.0041 12.7561 15.1237 11.8565 14.9073C11.1623 14.7399 10.5591 14.387 10.0854 13.9133C9.90164 13.7296 9.75872 13.5494 9.62104 13.3405L10.9313 12.031C11.0264 12.2474 11.1786 12.4673 11.3554 12.6441C12.1138 13.4024 13.3558 13.4088 14.1206 12.6441L16.632 10.1329C17.3945 9.37049 17.3945 8.13036 16.632 7.36797C15.8695 6.60557 14.6293 6.60557 13.8668 7.36797L13.0933 8.14144C12.3891 7.86262 11.6337 7.75062 10.8887 7.80662Z" fill="#231F20"/>
        </svg>
        <span>Copy Link</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageUrl: encodeURIComponent(document.URL)
    }
  },
  computed: {
    twitterLink() {
      return `https://twitter.com/intent/tweet?url=${this.pageUrl}`
    },
    facebookLink() {
      return `https://www.facebook.com/sharer.php?u=${this.pageUrl}`
    }
  },
  methods: {
    copyClipboard() {
      navigator.clipboard.writeText(decodeURIComponent(this.pageUrl));
    }
  }
}
</script>

<style lang="scss" scoped>
.share-content {
  margin: 3rem 0;
}

.share-title {
  color: $color-secondary;
  text-transform: uppercase;
  text-align: center;
  font-weight: 500;
  font-size: 1.5rem;
  letter-spacing: 0.06em;
}

.share-list {
  @include flex($justify: space-between);
  padding: 2rem 0;

  &__item {
    @include flex($direction: column);
    font-family: $font-heading;
    letter-spacing: 0.05em;
    text-transform: capitalize;
    font-size: 1.5rem;
    width: 30%;
    cursor: pointer;

    @include media-tablet-up {
      flex-direction: row;
      font-size: 2.5rem;

      svg {
        width: 30px;
        margin-right: 1rem;
      }
    }
  }
}
</style>