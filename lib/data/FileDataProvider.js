import { DataProvider } from './DataProvider.js'

const { remote } = require('electron')
const { dialog } = remote

const fs = require('fs')
const fsPromises = fs.promises

// Синхронный вариант функции fs.stat из стандартной библиотеки Node.js.
// https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fs_stat_path_options_callback
// https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fspromises_stat_path_options
// https://stackoverflow.com/questions/40593875/using-filesystem-in-node-js-with-async-await
export async function stat(path) {
  try {
    return await fsPromises.stat(path)
  } catch (error) {
    console.error(error)
  }
}

export class FileDataProvider extends DataProvider {
  constructor(filePath = '') {
    super()
    this._filePath = filePath
  }

  reset() {
    super.reset()
    this._filePath = ''
    this._fileContents = ''
  }

  load() {
    if (!this.hasFilePath()) {
      const filePathArray = dialog.showOpenDialog(
        remote.getCurrentWindow(),
        {
          filters: [ { name: 'Tags & Snippets File Type', extensions: [ 'tas' ] } ],
          properties: [ 'openFile' ]
        }
      )
      if (filePathArray.length > 0 && filePathArray[0].length > 0) {
        this._filePath = filePathArray[0]
        console.info('Loading file ', this._filePath)
      } else {
        return false
      }
    }

    if (this.isFileExists()) {
      this._fileContents = fs.readFileSync(this._filePath).toString()
      console.info('Successfully loaded file at', this._filePath)
      return true
    } else {
      console.error('File not exists', this._filePath)
      return false
    }
  }

  save() {
    if (this.hasFilePath()) {
      fs.writeFileSync(this._filePath, this._fileContents)
      console.info('Successfully saved file at path:', this._filePath)
      return true
    } else {
      return this.saveAs()
    }
  }

  saveAs() {
    const filePath = dialog.showSaveDialog(
      remote.getCurrentWindow(),
      {
        filters: [ { name: 'Tags & Snippets File Type', extensions: [ 'tas' ] } ]
      }
    )
    if (filePath && filePath.length > 0) {
      this._filePath = filePath
      return this.save()
    } else {
      console.warn('User cancelled out of save dialog')
      return false
    }
  }

  // Путь к файлу:
  get filePath()  { return this._filePath }
  set filePath(filePath) { this._filePath = filePath }

  hasFilePath() {
    return this._filePath && this._filePath.length > 0
  }

  isFileExists() {
    return stat(this._filePath)
  }

  // Содержимое файла:
  get fileContents()  { return this._fileContents }
  set fileContents(filePath) { this._fileContents = filePath }
}
