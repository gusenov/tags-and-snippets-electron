export class CodeEditor {
  constructor(layoutCellObject, dataProvider, contextId) {
    this._dataProvider = dataProvider
    this._contextId = contextId

    this._editorObjectId = 'snippetEditor' + contextId
    layoutCellObject.attachHTMLString('<div id="' + this._editorObjectId + '" class="snippetEditor"></div>')

    this._editorObject = ace.edit(this._editorObjectId)
    this._editorObject.setTheme("ace/theme/monokai")
    this._editorObject.setAutoScrollEditorIntoView(true)

    this._editorObject.setOptions({
      fontSize: "12pt"
    })

    this._editorObject.session.on('change', this.onChanged.bind(this))
    this._editorObject.session.selection.on('changeCursor', this.onCursorChanged.bind(this))

  }

  get editorObject()      { return this._editorObject }
  set editorObject(editorObject) { this._editorObject = editorObject }

  setEnabled(state) {
    this._editorObject.setReadOnly(!state)

    if (state) {
      this._editorObject.renderer.$cursorLayer.element.style.display = ''
    } else {
      this._editorObject.renderer.$cursorLayer.element.style.display = 'none'

      this._isReloading = true
      this._editorObject.session.setValue('')
      this._editorObject.session.getUndoManager().markClean()
      this._isReloading = false
    }
  }

  reload() {
    this._isReloading = true

    const snippet = this._dataProvider.getSelectedSnippet(this._contextId)
    this._editorObject.session.setMode('ace/mode/' + snippet.highlight)
    this._editorObject.session.setValue(snippet.contents)
    this._editorObject.session.getUndoManager().markClean()

    const cursorPosition = this._dataProvider.getSelectedSnippetCursorPosition(this._contextId)
    this._editorObject.moveCursorToPosition(cursorPosition)
    this._editorObject.focus()

    this._isReloading = false
  }

  //---------------------------------------------------------------------
  // Обработчики событий списка сниппетов:
  //---------------------------------------------------------------------

  onChanged(delta) {
    if (!this._isReloading) {
      const selectedSnippetId = this._dataProvider.getSelectedSnippetId(this._contextId)
      this._dataProvider.setSnippetContents(selectedSnippetId, this._editorObject.getValue())
    }
  }

  onCursorChanged(e) {
    if (!this._isReloading) {
      const cursorPosition = this._editorObject.getCursorPosition()
      this._dataProvider.setSelectedSnippetCursorPosition(this._contextId, cursorPosition)
    }
  }

  //---------------------------------------------------------------------

}
