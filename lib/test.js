import { JsonFileDataProvider } from './data/JsonFileDataProvider.js'

const dataProvider = new JsonFileDataProvider('/home/abbas/repo/tech/electron/tags-and-snippets-electron/example.tas')
dataProvider.load()
// console.log(dataProvider)
console.log(dataProvider.buildJsonStringForSnippetsList(1))
