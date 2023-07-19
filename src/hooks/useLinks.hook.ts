import { noteEventBus } from '@/bus/noteEventBus'
import { useUserRepoStore } from '@/modules/repo/store/userRepo.store'
import { isExternalLink } from '@/utils/link'
import { ComputedRef, onUnmounted, toValue } from 'vue'

export const useLinks = (
  className: ComputedRef<string> | string,
  sha?: string
) => {
  const store = useUserRepoStore()

  const linkNote: EventListener = (event) => {
    const target = event.target as HTMLElement
    const href = target.getAttribute('href')

    if (!href) {
      return
    }

    if (href.startsWith('#')) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    if (isExternalLink(href)) {
      window.open(href, '_blank')
      return
    }

    noteEventBus.emit({
      path: href,
      currentNoteSHA: sha,
      user: store.user,
      repo: store.repo
    })
  }

  const selector = `.${toValue(className)} a`

  const removeListeners = () => {
    const elements = document.querySelectorAll(selector)

    elements.forEach((element) => {
      element.removeEventListener('click', linkNote)
    })
  }

  const listenToClick = () => {
    removeListeners()
    const elements = document.querySelectorAll(selector)

    elements.forEach((element) => {
      const href = element.getAttribute('href')

      if (!href) {
        return
      }

      if (isExternalLink(href)) {
        element.classList.add('external-link')
      }
    })

    elements.forEach((element) => {
      element.addEventListener('click', linkNote)
    })
  }

  onUnmounted(() => {
    removeListeners()
  })

  return {
    listenToClick
  }
}
