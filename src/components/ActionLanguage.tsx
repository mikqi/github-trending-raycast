import { Action, ActionPanel, KeyEquivalent } from '@raycast/api'
import { DATE_RANGE_OPTIONS } from '../constants'
import { RepoType } from '../type'

export const ActionLanguage = ({ repo, onChangeRange }: { repo: RepoType; onChangeRange: (range: string) => void }) => {
  return (
    <ActionPanel>
      <ActionPanel.Section>
        <Action.OpenInBrowser url={repo.href} />
      </ActionPanel.Section>
      <ActionPanel.Section title="Range">
        {/* <Action
            key={range[0].value}
            title={range[0].label}
            shortcut={{
                modifiers: ['cmd', 'opt'],
                key: '1'
            }}
            onAction={() => {
              onChangeRange(range[0].value)
            }}

          /> */}
        {DATE_RANGE_OPTIONS.map((range) => (
          <Action
            key={range.value}
            title={range.label}
            shortcut={{
                modifiers: ['cmd', 'shift'],
                key: `${range.key}` as KeyEquivalent
            }}
            onAction={() => {
              onChangeRange(range.value)
            }}
          />
        ))}
      </ActionPanel.Section>
    </ActionPanel>
  )
}
