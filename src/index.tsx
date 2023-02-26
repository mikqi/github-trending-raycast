import { ActionPanel, Action, List, Cache } from '@raycast/api'
import { useFetch, Response } from '@raycast/utils'
import { useEffect, useReducer } from 'react'
import trending from 'trending-github'

import { PROGRAMMING_LANGUAGES, DATE_RANGE_OPTIONS } from './constants'

const cache = new Cache()
cache.set('languages', JSON.stringify(PROGRAMMING_LANGUAGES))

type RepoType = {
  author: string
  name: string
  href: string
  description: string
  language: string
  stars: number
  forks: number
  starsInPeriod: number
}

const RangeDropdown = ({
  onChangeRange,
  selectedRange,
}: {
  onChangeRange: (range: string) => void
  selectedRange: string
}) => {
  return (
    <List.Dropdown tooltip="Select range" value={selectedRange} onChange={onChangeRange}>
      {DATE_RANGE_OPTIONS.map((range) => (
        <List.Dropdown.Item key={range.value} title={range.label} value={range.value} />
      ))}
    </List.Dropdown>
  )
}

const LanguageActions = ({ repo, onChangeRange }: { repo: RepoType; onChangeRange: (range: string) => void }) => {
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

type CommandState = {
  selectedLanguage: string
  isLoading: boolean
  repos: RepoType[]
  query: string
  range: string
}

type CommandAction =
  | { type: 'SET_SELECTED_LANGUAGE'; payload: string }
  | { type: 'SET_IS_LOADING'; payload: boolean }
  | { type: 'SET_REPOS'; payload: RepoType[] }
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_RANGE'; payload: string }

const initialState: CommandState = {
  selectedLanguage: '',
  isLoading: false,
  repos: [],
  query: '',
  range: 'daily',
}

const commandReducer = (state: CommandState, action: CommandAction) => {
  switch (action.type) {
    case 'SET_SELECTED_LANGUAGE':
      return { ...state, selectedLanguage: action.payload }
    case 'SET_IS_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_REPOS':
      return { ...state, repos: action.payload }
    case 'SET_QUERY':
      return { ...state, query: action.payload }
    case 'SET_RANGE':
      return { ...state, range: action.payload }
    default:
      return state
  }
}

export default function Command() {
  const [state, dispatch] = useReducer(commandReducer, initialState)

  useEffect(() => {
    async function fetchRepos() {
      try {
        dispatch({ type: 'SET_IS_LOADING', payload: true })
        const result = await trending(state.range, state.selectedLanguage)
        dispatch({ type: 'SET_REPOS', payload: result as RepoType[] })
        dispatch({ type: 'SET_IS_LOADING', payload: false })
      } catch (error) {
        dispatch({ type: 'SET_IS_LOADING', payload: false })
      }
    }

    fetchRepos()
  }, [state.selectedLanguage, state.range])

  const handleSearchFilterChange = (searchFilter: string) => {
    if (searchFilter === '') {
      return dispatch({ type: 'SET_SELECTED_LANGUAGE', payload: '' })
    }
    dispatch({ type: 'SET_QUERY', payload: searchFilter })
  }

  const handleTimeRangeChange = (timeRange: string) => {
    dispatch({ type: 'SET_RANGE', payload: timeRange })
  }

  return (
    <List
      onSearchTextChange={handleSearchFilterChange}
      navigationTitle="Trending Repositories"
      isLoading={state.isLoading || state.repos.length === 0}
      searchBarPlaceholder="Filter repos by name..."
      searchBarAccessory={<RangeDropdown selectedRange={state.range} onChangeRange={handleTimeRangeChange} />}
      throttle
    >
      {state.query === ''
        ? state.repos.map((repo) => (
            <ListItem key={repo.author + '/' + repo.name} repo={repo} onRangeChange={handleTimeRangeChange} />
          ))
        : PROGRAMMING_LANGUAGES.filter((lang) => lang.toLowerCase().includes(state.query.toLowerCase())).map(
            (lang, idx) => (
              <List.Item
                key={lang + idx}
                title={lang}
                actions={
                  <ActionPanel>
                    <Action
                      title="Select Language"
                      onAction={() => {
                        dispatch({
                          type: 'SET_SELECTED_LANGUAGE',
                          payload: lang,
                        })
                        dispatch({ type: 'SET_QUERY', payload: '' })
                      }}
                    />
                  </ActionPanel>
                }
              />
            ),
          )}
    </List>
  )
}

type ListItemProps = {
  repo: RepoType
  onRangeChange: (range: string) => void
}

const ListItem = ({ repo, onRangeChange }: ListItemProps) => (
  <List.Item
    title={repo.author + '/' + repo.name}
    subtitle={{
      value: repo.language,
      tooltip: repo.description,
    }}
    accessories={[{ text: `${repo.stars} ☆` }]}
    actions={<LanguageActions repo={repo} onChangeRange={onRangeChange} />}
  />
)
