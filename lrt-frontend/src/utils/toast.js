export function showToast(message, type = 'success') {
    const toastZone = document.getElementById('toastZone')
    if (!toastZone) return

    const toast = document.createElement('div')
    toast.className = `toast align-items-center text-white bg-${type} border-0 show`
    toast.setAttribute('role', 'alert')
    toast.setAttribute('aria-live', 'assertive')
    toast.setAttribute('aria-atomic', 'true')
    toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `
    toastZone.appendChild(toast)

    setTimeout(() => {
        toast.classList.remove('show')
        toast.remove()
    }, 4000)
}
