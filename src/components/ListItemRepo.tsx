import { List } from '@raycast/api'
import { RepoType } from '../type'
import { ActionLanguage } from './ActionLanguage'

export type ListItemProps = {
  repo: RepoType
  onRangeChange: (range: string) => void
}

export const ListItemRepo = ({ repo, onRangeChange }: ListItemProps) => (
  <List.Item
    title={repo.author + '/' + repo.name}
    subtitle={{
      value: repo.language,
      tooltip: repo.description,
    }}
    accessories={[{ text: `${repo.stars} ☆` }]}
    actions={<ActionLanguage repo={repo} onChangeRange={onRangeChange} />}
  />
)
