import { bold } from 'kleur'
import prompts from 'prompts'
import config from '../lib/config'
import logger from '../lib/logger'
import { createDir, normalizePath, pathExists } from '../lib/path'

// User prompt for settings dev directory
export const devDirectoryCommand = async (update: boolean = false) => {
  const devPath = config.get('devPath')
  if (devPath) {
    logger.info(`Current dev path: ${bold(devPath)}`)
  }

  if (!update) {
    logger.info(
      `To update the dev path, use ${bold('--update')} or ${bold(
        '-u'
      )}`
    )
    return
  }

  const response = await prompts({
    type: 'text',
    name: 'newPath',
    message: 'Enter a path as the default dev directory',
  })

  // Handle ctrl+c
  if (!response.newPath) {
    return
  }

  const newPath = normalizePath(response.newPath)

  if (!pathExists(newPath)) {
    logger.debug(`Directory ${newPath} doesn't exist, asking to create it`)
    const shouldCreateDir = await prompts({
      type: 'toggle',
      name: 'value',
      message: `${newPath} doesn't exist, do you want to create it?`,
      initial: true,
      active: 'yes',
      inactive: 'no',
    })

    // handle ctrl+c and no
    if (!shouldCreateDir.value) {
      return
    }

    // Create the new path
    logger.debug(`Creating new path: ${newPath}`)
    createDir(newPath)
  }

  // Output the new dev path
  config.set('devPath', newPath)
  logger.info(`New dev path: ${bold(newPath)}`)
}
