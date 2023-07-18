import { useFile } from '@/hooks/useFile.hook'
import { resolvePath } from '@/modules/repo/services/resolvePath'
import { useUserRepoStore } from '@/modules/repo/store/userRepo.store'
import { computed, watch } from 'vue'

const SRC_PREFIX = 'data:image/jpeg;charset=utf-8;base64,'

export const useImages = (sha: string) => {
  const store = useUserRepoStore()

  const currentFilePath = computed(
    () => store.files.find((file) => file.sha === sha)?.path
  )

  watch(
    currentFilePath,
    (filePath) => {
      if (!filePath) {
        return
      }

      const images = document.querySelectorAll(`.note-${sha} img`)

      images.forEach(async (image) => {
        const src = image.getAttribute('src')
        if (!src || src.startsWith(SRC_PREFIX)) {
          return
        }

        const imageFilePath = resolvePath(
          filePath,
          image.getAttribute('src') ?? ''
        )

        const imageFile = store.files.find(
          (file) => file.path === imageFilePath
        )

        if (!imageFile?.sha) {
          return
        }
        const { getCachedFileContent } = useFile(imageFile.sha, false)

        const fileContent = await getCachedFileContent()
        image.setAttribute('src', `${SRC_PREFIX} ${fileContent}`)
      })
    },
    { immediate: true }
  )
}
