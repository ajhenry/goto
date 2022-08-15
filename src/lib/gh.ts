import spawnAsync from '@expo/spawn-async'
import logger from './logger'

interface Repo {
  name: string
  owner: { id: string; login: string }
  url: string
  description: string
}
// Make sure gh is installed
export const ghIsInstalled = () => {}

// Lists all repos for the user
export const listRepos = async (repoPath: string): Promise<Repo[]> => {
  let resultPromise = spawnAsync('gh', [
    'search',
    'repos',
    repoPath,
    '--json',
    'owner,name,url,description',
  ])

  let { stdout } = await resultPromise
  const repos = JSON.parse(stdout)
  logger.debug(repos)

  return repos
}

// Check if that repo exists
export const getRepos = async (repoPath: string): Promise<Repo[]> => {
  const repos = await listRepos(repoPath)

  // If there's a repo with the exact name, return it
  const exactRepo = repos.find(
    (repo) => `${repo.owner.login}/${repo.name}` === repoPath
  )
  return exactRepo ? [exactRepo] : repos
}

export const cloneRepo = async (repo: string, destination: string) => {
  let resultPromise = spawnAsync('gh', ['repo', 'clone', repo, destination])
  let spawnedChildProcess = resultPromise.child

  // pipe the output to the logger
  spawnedChildProcess.stdout!.pipe(process.stdout)
  await resultPromise
}

// Search for a repo by it's path
export const searchRepos = async (repoPath: string): Promise<Repo> => {
  let resultPromise = spawnAsync('gh', [
    'search',
    'repos',
    repoPath,
    '--json',
    'owner,name,url,description',
  ])

  let { stdout } = await resultPromise
  const repos = JSON.parse(stdout)
  logger.debug(repos)

  return repos
}
