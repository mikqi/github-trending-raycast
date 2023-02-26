import { Action, ActionPanel, Detail, useNavigation } from '@raycast/api'
import { useFetch } from '@raycast/utils'
import { RepoType } from '../type'

export const RepoDetail = ({ repo }: { repo: RepoType }) => {
  const { pop } = useNavigation()
  const READMEUrl = `https://raw.githubusercontent.com/${repo.author}/${repo.name}/master/README.md`

  const { data: README, isLoading } = useFetch(READMEUrl, { method: 'GET' })
  return (
    <Detail
      navigationTitle={repo.author + '/' + repo.name}
      isLoading={isLoading}
      markdown={README as string}
      actions={
        <ActionPanel>
          <Action title="Back" onAction={pop} />
        </ActionPanel>
      }
    />
  )
}
