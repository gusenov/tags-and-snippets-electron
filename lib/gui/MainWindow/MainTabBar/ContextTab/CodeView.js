import { CodeToolbar } from './CodeView/CodeToolbar.js'
import { CodeEditor } from './CodeView/CodeEditor.js'

export class CodeView {
  constructor(layoutCellObject, dataProvider, contextId) {
    this._layoutCellObject = layoutCellObject
    this._dataProvider = dataProvider
    this._contextId = contextId

    this._layoutCellObject.setText('Editor')

    this._codeEditor = new CodeEditor(this._layoutCellObject, dataProvider, contextId)
    this._codeToolbar = new CodeToolbar(this._layoutCellObject, dataProvider, contextId, this._codeEditor)
    this._statusBarObject = this._layoutCellObject.attachStatusBar()
  }

  get codeToolbar()     { return this._codeToolbar }
  set codeToolbar(codeToolbar) { this._codeToolbar = codeToolbar }

  get codeEditor()    { return this._codeEditor }
  set codeEditor(codeEditor) { this._codeEditor = codeEditor }

  reload() {
    if (this._dataProvider.getSelectedSnippetId(this._contextId) === -1) {
      this.setEnabled(false)
      return
    }

    const tagsNames = this._dataProvider
                          .getSelectedSnippetTagsAsJoinedString(this._contextId)

    // this._statusBarObject.setText(tagsNames)
    this._layoutCellObject.setText(tagsNames)

    this._codeToolbar.reload()
    this._codeEditor.reload()
  }

  setEnabled(state) {
    this._codeToolbar.setEnabled(state)
    this._codeEditor.setEnabled(state)

    if (state) {
      this._layoutCellObject.expand()
    } else {
      this._layoutCellObject.collapse()
      this._layoutCellObject.setText('')
    }
  }
}
