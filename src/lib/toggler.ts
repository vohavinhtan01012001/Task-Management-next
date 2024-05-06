export const sidebarToggle = (): void => {
  const width: number = document.body.clientWidth
  const isMobile: boolean = width < 768

  if (isMobile) {
    const target: HTMLElement | null = document.getElementById('sidebar')
    const overlaySidebar: HTMLElement | null = document.getElementById('overlaySidebar')

    if (target && overlaySidebar) {
      if (target.classList.contains('-translate-x-full')) {
        target.classList.remove('-translate-x-full')
        target.classList.add('translate-x-0')
        overlaySidebar.classList.add('block')
        overlaySidebar.classList.remove('hidden')
      } else {
        target.classList.add('-translate-x-full')
        target.classList.remove('translate-x-0')
        overlaySidebar.classList.add('hidden')
        overlaySidebar.classList.remove('block')
      }
    }
  }
}
