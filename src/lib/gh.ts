import spawnAsync from '@expo/spawn-async'
import logger from './logger'

interface Repo {
  name: string
  owner: { id: string; login: string }
  url: string
}
// Make sure gh is installed
export const ghIsInstalled = () => {}

// Lists all repos for the user
export const listRepos = async (): Promise<Repo[]> => {
  let resultPromise = spawnAsync('gh', [
    'repo',
    'list',
    '--json',
    'owner,name,url',
  ])

  let { stdout } = await resultPromise
  const repos = JSON.parse(stdout)
  logger.debug(repos)

  return repos
}

// Check if that repo exists
export const getRepos = async (repo: string): Promise<Repo[]> => {
    const repos = await listRepos()

    return repos.filter((r) => r.name === repo)
}

export const cloneRepo = async (repo: string, destination: string) => {
  let resultPromise = spawnAsync('gh', ['repo', 'clone', repo, destination])
  let spawnedChildProcess = resultPromise.child;
  
  // pipe the output to the logger
  spawnedChildProcess.stdout!.pipe(process.stdout)
  await resultPromise;
}
