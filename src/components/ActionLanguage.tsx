import { Action, ActionPanel, useNavigation, KeyEquivalent, Icon } from '@raycast/api'
import { DATE_RANGE_OPTIONS } from '../constants'
import { RepoType } from '../type'
import { RepoDetail } from './RepoDetail';

export const ActionLanguage = ({ repo, onChangeRange }: { repo: RepoType; onChangeRange: (range: string) => void }) => {
    const {push} = useNavigation();
  return (
    <ActionPanel>
      <ActionPanel.Section>
        <Action.OpenInBrowser url={repo.href} />
        <Action title="See detail" icon={Icon.Book} onAction={() => {push(<RepoDetail repo={repo} />)}} />
      </ActionPanel.Section>
      <ActionPanel.Section title="Range">
        {DATE_RANGE_OPTIONS.map((range) => (
          <Action
            key={range.value}
            title={range.label}
            icon={Icon.Calendar}
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
