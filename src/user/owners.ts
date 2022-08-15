import { bold } from 'kleur'
import prompts from 'prompts'
import config from '../lib/config'
import logger from '../lib/logger'

// User prompt for settings dev directory
export const updateGitHubOwners = async (update: boolean = false) => {
  const owners = config.get('owners')
  if (owners) {
    logger.info(
      `Current github orgs enabled: ${
        owners.length === 0 ? bold('none') : owners.map((owner) => bold(owner))
      }`
    )
  }

  if (!update) {
    logger.info(
      `To update the list of github orgs, use ${bold('--update')} or ${bold(
        '-u'
      )}`
    )
    return
  }

  const response = await prompts({
    type: 'list',
    name: 'value',
    message: 'Enter orgs (separated by ,) to fetch repos from',
    initial: '',
    separator: ',',
  })

  // Handle ctrl+c
  if (!response.value) {
    return
  }

  const newOwners = response.value.filter((owner: string) => owner.length !== 0)

  // Output the new owners
  config.set('owners', newOwners)
  logger.info(
    `New github orgs enabled: ${
      newOwners.length === 0
        ? bold('none')
        : newOwners.map((owner: string) => bold(owner))
    }`
  )
}
