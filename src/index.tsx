import { List, Cache } from '@raycast/api'
import { useEffect, useReducer, useCallback } from 'react'
import trending from 'trending-github'

import { DropdownRange } from './components/DropdownRange'
import { ListItemLanguage } from './components/ListItemLanguage'
import { ListItemRepo } from './components/ListItemRepo'

import { PROGRAMMING_LANGUAGES } from './constants'
import { commandReducer } from './reducer'
import { RepoType } from './type'

const cache = new Cache()
cache.set('languages', JSON.stringify(PROGRAMMING_LANGUAGES))

export default function Command() {
  const [state, dispatch] = useReducer(commandReducer, {
    selectedLanguage: '',
    isLoading: false,
    repos: [],
    query: '',
    range: 'daily',
  })

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

  const handleSearchFilterChange = useCallback((searchFilter: string) => {
    if (searchFilter === '') {
      return dispatch({ type: 'SET_SELECTED_LANGUAGE', payload: '' })
    }
    dispatch({ type: 'SET_QUERY', payload: searchFilter })
  }, [])

  const handleTimeRangeChange = useCallback((timeRange: string) => {
    dispatch({ type: 'SET_RANGE', payload: timeRange })
  }, [])

  const handleLanguageChange = useCallback((language: string) => {
    dispatch({ type: 'SET_SELECTED_LANGUAGE', payload: language })
    dispatch({ type: 'SET_QUERY', payload: '' })
  }, [])

  return (
    <List
      onSearchTextChange={handleSearchFilterChange}
      navigationTitle="Trending Repositories"
      isLoading={state.isLoading || state.repos.length === 0}
      searchBarPlaceholder="Filter repos by name..."
      searchBarAccessory={<DropdownRange selectedRange={state.range} onChangeRange={handleTimeRangeChange} />}
      throttle
    >
      {state.query === ''
        ? state.repos.map((repo) => (
            <ListItemRepo key={repo.author + '/' + repo.name} repo={repo} onRangeChange={handleTimeRangeChange} />
          ))
        : PROGRAMMING_LANGUAGES.filter((lang) => lang.toLowerCase().includes(state.query.toLowerCase())).map(
            (lang, idx) => <ListItemLanguage key={lang + idx} lang={lang} onLanguageChange={handleLanguageChange} />,
          )}
    </List>
  )
}
