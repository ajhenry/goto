import spawnAsync from '@expo/spawn-async'
import { bold } from 'kleur'
import config from './config'
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
  const owners = config.get('owners', []) as string[]

  const repos = await searchRepos(repoPath)

  // Fetch all repos
  for (const owner of owners) {
    const ownerRepos = await searchRepos(repoPath, owner)
    repos.push(...ownerRepos)
  }

  // If there's a repo with the exact name, return it
  let exactRepo = repos.find(
    (repo) => `${repo.owner.login}/${repo.name}` === repoPath
  )
  if (!exactRepo) {
    for (const owner of owners) {
      exactRepo = repos.find(
        (repo) => `${repo.owner.login}/${repo.name}` === `${owner}/${repoPath}`
      )
      if (exactRepo) {
        logger.info(
          `Found repo using owner ${bold(owner)}: ${bold(
            `${owner}/${repoPath}`
          )}`
        )
        break
      }
    }
  }
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
export const searchRepos = async (
  repoPath: string,
  owner?: string
): Promise<Repo[]> => {
  const args = [
    'search',
    'repos',
    repoPath,
    '--json',
    'owner,name,url,description',
    '--limit',
    '10',
  ]

  if (owner) {
    args.push('--owner', owner)
  }

  let repos: Repo[] = []
  try {
    let resultPromise = spawnAsync('gh', args)

    let { stdout } = await resultPromise
    repos = JSON.parse(stdout)
  } catch (e) {
    logger.debug(`Error searching for repo ${repoPath}`)
  }
  logger.debug(repos)

  return repos
}
