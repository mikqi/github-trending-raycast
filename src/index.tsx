import { ActionPanel, Action, List, Cache } from '@raycast/api'
import { useFetch, Response } from '@raycast/utils'
import { useState, useEffect } from 'react'
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

const Dropdown = () => {
  return (
    <List.Dropdown tooltip="Select range">
      {DATE_RANGE_OPTIONS.map((range) => (
        <List.Dropdown.Item key={range.value} title={range.label} value={range.value} />
      ))}
    </List.Dropdown>
  )
}

const LanguageActions = ({ repo }: { repo: RepoType }) => {
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
              console.log(range.value)
            }}
          />
        ))}
      </ActionPanel.Section>
    </ActionPanel>
  )
}

export default function Command() {
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [repos, setRepos] = useState<RepoType[]>([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    async function fetchRepos() {
      try {
        setIsLoading(true)
        const result = await trending('daily', selectedLanguage)
        setRepos(result as RepoType[])
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
      }
    }

    fetchRepos()
  }, [selectedLanguage])

  const handleSearchTextChange = (searchText: string) => {
    if (searchText === '') {
      return setSelectedLanguage('')
    }
    setQuery(searchText)
  }

  return (
    <List
      onSearchTextChange={handleSearchTextChange}
      navigationTitle="Trending Repositories¡"
      isLoading={repos.length === 0 || isLoading}
      searchBarPlaceholder="Filter repos by name..."
      searchBarAccessory={<Dropdown />}
      throttle
    >
      {query === ''
        ? repos.map((repo) => (
            <List.Item
              key={repo.author + '/' + repo.name}
              title={repo.author + '/' + repo.name}
              subtitle={{
                value: repo.language,
                tooltip: repo.description,
              }}
              accessories={[{ text: `${repo.stars} ☆` }]}
              actions={<LanguageActions repo={repo} />}
            />
          ))
        : PROGRAMMING_LANGUAGES.filter((lang) => lang.toLowerCase().includes(query.toLowerCase())).map((lang, idx) => (
            <List.Item
              key={lang + idx}
              title={lang}
              actions={
                <ActionPanel>
                  <Action
                    title="Select Language"
                    onAction={() => {
                      setSelectedLanguage(lang)
                      setQuery('')
                    }}
                  />
                </ActionPanel>
              }
            />
          ))}
    </List>
  )
}
