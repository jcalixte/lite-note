import { ref } from 'vue'
import { useMarkdown } from '@/hooks/useMarkdown.hook'
import { useNoteCache } from '@/modules/note/hooks/useNoteCache'
import { useUserRepoStore } from '@/modules/repo/store/userRepo.store'
import { getFileContent } from '@/modules/repo/services/repo'

export const useFile = (sha: string, retrieveContent = true) => {
  const { render } = useMarkdown()
  const store = useUserRepoStore()
  const { getCachedNote, saveCacheNote } = useNoteCache(sha)
  const fromCache = ref(false)

  const content = ref('')

  const getContent = async () => {
    const fileContent = await getCachedFileContent()
    if (!fileContent) {
      return
    }
    content.value = render(fileContent)
  }

  const getCachedFileContent = async (): Promise<string | null> => {
    const cachedNote = await getCachedNote()

    fromCache.value = !!cachedNote

    if (cachedNote) {
      return cachedNote.content
    }

    const contentFile = await getFileContent(store.user, store.repo, sha)

    if (!contentFile) {
      return null
    }
    saveCacheNote(contentFile)
    return contentFile
  }

  if (retrieveContent) {
    getContent()
  }

  return {
    content,
    getContent,
    getCachedFileContent,
    fromCache
  }
}
