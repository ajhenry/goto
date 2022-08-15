import { Command, Flags } from '@oclif/core'
import { bold } from 'kleur'
import prompts from 'prompts'
import { gotoFunc } from '../lib/bash'
import { cloneRepo, getRepos, listRepos } from '../lib/gh'
import logger from '../lib/logger'
import {
  createDir,
  getDevDir,
  gotoDir,
  normalizePath,
  pathExists
} from '../lib/path'
import { updateGitHubOwners } from '../user/owners'
import { devDirectoryCommand } from '../user/path'

export class Goto extends Command {
  static flags = {
    list: Flags.boolean({ char: 'l', description: 'List all repos' }),
    path: Flags.boolean({
      char: 'p',
      description: 'List the default dev directory',
    }),
    update: Flags.boolean({
      char: 'u',
      description: 'Update the default dev directory',
    }),
    debug: Flags.boolean({ char: 'd', description: 'Enable debug output' }),
    init: Flags.boolean({
      char: 'i',
      description: 'Initializes the goto function for bash',
    }),
    owners: Flags.boolean({
      char: 'o',
      description: 'Update the list of owners to search for repos from',
    }),
  }

  static args = [{ name: 'path' }]

  async run() {
    const { flags, args } = await this.parse(Goto)
    const { path } = args

    // Set debug mode
    if (flags.debug) {
      logger.setSettings({
        minLevel: 'debug',
        displayLogLevel: true,
        displayLoggerName: true,
        displayFunctionName: true,
        displayFilePath: 'displayAll',
      })
    }

    // Initializes the goto function for bash
    if (flags.init) {
      console.log(gotoFunc)
      this.exit(1)
      return
    }

    // Go through dev directory command
    if (flags.path) {
      await devDirectoryCommand(flags.update)
      this.exit(1)
      return
    }

    // Go through owner command
    if (flags.owners) {
      await updateGitHubOwners(flags.update)
      this.exit(1)
      return
    }

    // List out the directories in the dev directory
    if (flags.list) {
      const repos = await listRepos()
      repos.forEach((repo) => {
        logger.info(`${bold(`${repo.owner.login}/${repo.name}`)} - ${repo.url}`)
      })
      this.exit(1)
      return
    }

    // If no dev directory is set, make them set one
    if (!getDevDir()) {
      devDirectoryCommand(true)
      this.exit(1)
      return
    }

    // Don't go to a directory if it's not provided
    // Go to the default dev directory
    if (!path) {
      const defaultDir = getDevDir()!
      gotoDir(defaultDir)
      logger.info(`Changed directory to ${bold(defaultDir)}`)
      this.exit(0)
      return
    }

    // Normalize paths
    const pathDir: string = normalizePath(getDevDir()!, path)
    logger.debug(`Paths provided: ${pathDir}`)

    // Goto the project repo directory
    // First check for directory in dev folder
    if (pathExists(pathDir)) {
      logger.info(`Changed directory to ${bold(pathDir)}`)
      gotoDir(pathDir)
      this.exit(0)
      return
    }
    logger.info(`No paths found for ${bold(path)}`)

    // Check for repo on github via gh cli
    const repos = await getRepos(path)

    // Handle case for multiple repos with same name
    if (repos.length > 1) {
      logger.error(
        `Multiple repos found for ${bold(path)}. Please specify the repo name.`
      )
      repos.forEach((repo) => {
        logger.info(`${bold(`${repo.owner.login}/${repo.name}`)} - ${repo.url}`)
      })
      this.exit(1)
      return
    }

    // Base case for single repo
    if (repos.length == 1) {
      const repo = `${repos[0].owner.login}/${repos[0].name}`
      logger.info(`Found github repo ${bold(repo)}`)
      await cloneRepo(repo, pathDir)
      logger.info(`Changed directory to ${bold(pathDir)}`)
      gotoDir(pathDir)
      this.exit(0)
      return
    }
    logger.info(`No repos found for ${bold(path)}`)

    // Ask user if they want to create it if not found
    logger.debug(
      `${pathDir} doesn't exist, asking user if they want to create it`
    )
    const shouldCreateDir = await prompts({
      type: 'toggle',
      name: 'value',
      message: `${pathDir} doesn't exist, do you want to create it?`,
      initial: true,
      active: 'yes',
      inactive: 'no',
    })

    // Create and goto the directory
    if (shouldCreateDir.value) {
      logger.info(`Changed directory to ${bold(pathDir)}`)
      createDir(pathDir)
      gotoDir(pathDir)
      this.exit(0)
      return
    }

    this.exit(1)
    return
  }
}
