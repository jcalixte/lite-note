import { RepoBase } from '@/modules/interfaces/RepoBase'
import { computed } from 'vue'
import { useFavoriteRepos } from '@/modules/repo/hooks/useFavoriteRepos.hook'
import { useRepos } from '@/hooks/useRepos.hook'

export const useRepoList = () => {
  const { savedFavoriteRepos, addFavorite, removeFavorite } = useFavoriteRepos()
  const { repos } = useRepos()

  const favoriteRepos = computed(() => {
    return repos.value.filter((repo) =>
      savedFavoriteRepos.value.find(
        (fav) => fav._id?.includes(repo.id) ?? false
      )
    )
  })

  const otherRepos = computed(() => {
    return repos.value.filter(
      (repo) => !favoriteRepos.value.find((favorite) => favorite.id === repo.id)
    )
  })

  const favoriteCheckboxes = computed(() =>
    favoriteRepos.value.map((favorite) => favorite.id)
  )

  const toggleCheckbox = async (repo: RepoBase) => {
    if (favoriteCheckboxes.value.includes(repo.id)) {
      await removeFavorite(repo)
    } else {
      await addFavorite(repo)
    }
  }

  return {
    favoriteRepos,
    otherRepos,
    favoriteCheckboxes,
    toggleCheckbox
  }
}
