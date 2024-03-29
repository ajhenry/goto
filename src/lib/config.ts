import Conf from 'conf'

interface UserConfig {
  devPath: string | undefined
  owners: string[] | undefined
}

const config = new Conf<UserConfig>()

export default config
