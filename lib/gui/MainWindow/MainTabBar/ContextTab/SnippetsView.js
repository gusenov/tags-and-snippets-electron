import { SnippetsToolbar } from './SnippetsView/SnippetsToolbar.js'
import { SnippetsList } from './SnippetsView/SnippetsList.js'

export class SnippetsView {
  constructor(layoutCellObject, dataProvider, contextId, codeView) {
    this._layoutCellObject = layoutCellObject
    this._dataProvider = dataProvider
    this._contextId = contextId

    this._layoutCellObject.setText('Snippets')

    this._snippetsList = new SnippetsList(
        this._layoutCellObject
      , this._dataProvider
      , this._contextId
      , codeView
    )

    this._snippetsToolbar = new SnippetsToolbar(
        this._layoutCellObject
      , this._dataProvider
      , this._contextId
      , this._snippetsList
    )
  }

  get snippetsToolbar()         { return this._snippetsToolbar }
  set snippetsToolbar(snippetsToolbar) { this._snippetsToolbar = snippetsToolbar }

  get snippetsList()      { return this._snippetsList }
  set snippetsList(snippetsList) { this._snippetsList = snippetsList }

  reload() {
    const selectedTagsNames = this._dataProvider.getSelectedTagsAsJoinedString(this._contextId)
    this._layoutCellObject.setText(selectedTagsNames)

    this._snippetsList.reload()
  }
}
