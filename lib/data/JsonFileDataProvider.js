import { FileDataProvider } from './FileDataProvider.js'

export class JsonFileDataProvider extends FileDataProvider {
  constructor(jsonFilePath = '') {
    super(jsonFilePath)
  }

  load() {
    const result = super.load()
    this.data = JSON.parse(this.fileContents)
    return result
  }

  save() {
    this.dataToJson()
    return super.save()
  }

  saveAs() {
    this.dataToJson()
    return super.saveAs()
  }

  dataToJson() {
    this.fileContents = JSON.stringify(this.data, null, 2)
  }
}
