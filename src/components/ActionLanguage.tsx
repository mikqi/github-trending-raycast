import { Action, ActionPanel } from '@raycast/api'
import { DATE_RANGE_OPTIONS } from '../constants'
import { RepoType } from '../type'

export const ActionLanguage = ({ repo, onChangeRange }: { repo: RepoType; onChangeRange: (range: string) => void }) => {
  return (
    <ActionPanel>
      <ActionPanel.Section>
        <Action.OpenInBrowser url={repo.href} />
      </ActionPanel.Section>
      <ActionPanel.Section title="Range">
        {DATE_RANGE_OPTIONS.map((range) => (
          <Action
            key={range.value}
            title={range.label}
            onAction={() => {
              onChangeRange(range.value)
            }}
          />
        ))}
      </ActionPanel.Section>
    </ActionPanel>
  )
}
