window.addEventListener('DOMContentLoaded', event => {
  const cFormLogin = document.querySelector('[data-form-login]')
  const cFormRecover = document.querySelector('[data-form-recover]')

  const recoverUrl = window.location.href.includes('#recover')
  if (!recoverUrl) cFormLogin.classList.remove('u-hide')
  else cFormRecover.classList.remove('u-hide')

  const cLoginTrigger = document.querySelector('[data-form-login-trigger]')
  const cRecoverTrigger = document.querySelector('[data-form-recover-trigger]')
  const triggers = [cLoginTrigger, cRecoverTrigger]

  cRecoverTrigger.addEventListener('click', event => {
    const alerts = document.querySelectorAll('c-form__alert')
    alerts.forEach(alert => alert.remove())

    cFormLogin.classList.add('u-hide')
    cFormRecover.classList.remove('u-hide')
  })
})
