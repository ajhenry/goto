import fs from 'fs-extra'
import path from 'path'
import untildify from 'untildify'
import config from './config'

// File hack for cd
const gotoFile = untildify('~/.goto/goto')

// Join and normalize paths
export const normalizePath = (...paths: string[]) => {
  let pathDir: string = path.join(...paths)
  pathDir = pathDir.includes('~') ? untildify(pathDir) : pathDir
  pathDir = path.normalize(pathDir)

  return pathDir
}

// checks to see if the path exists
export const checkPath = (path: string): boolean => {
  return fs.existsSync(path)
}

// Set a file path to the default dev directory
export const setDevDir = (path: string) => {}

// Check if a folder exists in a directory
export const pathExists = (path: string): boolean => {
  return fs.existsSync(path)
}

// Get the default dev directory
export const getDevDir = (): string | undefined => {
  return config.get('devPath', undefined)
}

// Creates a directory
export const createDir = (path: string): void => {
  fs.mkdirpSync(path)
}

// Navigates to a directory
export const gotoDir = (path: string): void => {
  fs.outputFileSync(gotoFile, path)
}
