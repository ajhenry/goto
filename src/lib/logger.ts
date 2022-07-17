import { Logger } from 'tslog'

const logger: Logger = new Logger({
  minLevel: 'info',
  displayDateTime: false,
  displayLogLevel: false,
  displayLoggerName: false,
  displayFunctionName: false,
  displayFilePath: 'hidden',
})

export default logger
