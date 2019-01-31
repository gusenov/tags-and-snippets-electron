export class SnippetsList {
  constructor(layoutCellObject, dataProvider, contextId, codeView) {
    this._dataProvider = dataProvider
    this._contextId = contextId
    this._codeView = codeView

    this._classEditMode = 'edit' + this._contextId

    this._listObject = layoutCellObject.attachList({
        type: {
            template: "#tagsNames#",
            template_edit: "<select id='tagsOfSnippet#id#' class='tagsOfSnippet " + this._classEditMode + "' multiple='multiple'>#tagsOptions#</select>",
            height: "auto"
        }
    })

    this._listObject.attachEvent("onItemClick", this.onItemClicked.bind(this))
    this._listObject.attachEvent("onItemDblClick", this.onItemDblClicked.bind(this))
    this._listObject.attachEvent("onAfterRender", this.onAfterRendered.bind(this))
    this._listObject.attachEvent("onEditKeyPress", this.onEditKeyPressed.bind(this))
    this._listObject.attachEvent("onSelectChange", this.onSelectChanged.bind(this))
    this._listObject.attachEvent("onBeforeDelete", this.onBeforeDeleted.bind(this))
    this._listObject.attachEvent("onAfterEditStop", this.onAfterEditStopped.bind(this))
  }

  get listObject()    { return this._listObject }
  set listObject(gridObject) { this._listObject = listObject }

  reload() {
    this._listObject.stopEdit()
    this._listObject.clearAll()
    this._listObject.parse(this._dataProvider.buildJsonStringForSnippetsList(this._contextId), "json")

    if (this._listObject.dataCount() > 0) {
      const selectedSnippetId = this._dataProvider.getSelectedSnippetId(this._contextId)
      if (selectedSnippetId !== -1 && this._dataProvider.isSnippetVisible(this._contextId, selectedSnippetId)) {
        this._listObject.select(selectedSnippetId)
      }
    }
  }

  //---------------------------------------------------------------------
  // Обработчики событий списка сниппетов:
  //---------------------------------------------------------------------

  // Parameters:
  //     sel_arr    array    an array of items, the selected state of which is changed
  onSelectChanged(sel_arr) {
    if (sel_arr.length > 0) {
      this._dataProvider.setSelectedSnippetId(this._contextId, parseInt(sel_arr[0]))
      this._codeView.setEnabled(true)
      this._codeView.reload()
    }
  }

  // Parameters:
  //     id      string|number    id of the item
  //     ev      Event object     native event object
  //     html    object           target HTML element
  // Returns:
  //             boolean          true - to trigger the default action, false - to block it
  onItemClicked(id, ev, html) {
  }

  onItemDblClicked(id, ev, html) {
    if (!this._listObject.isEdit()) {
      this._listObject.edit(id)
      jQuery('#tagsOfSnippet' + id).select2({
          disabled: false  // включить компонент.
        , tags: false  // можно ли добавлять свои теги?
      })
      jQuery('#tagsOfSnippet' + id).on('change', function(e) {
        this.onSelectBoxChanged('#tagsOfSnippet' + id, id)
      }.bind(this))
    }
    return true
  }

  onAfterRendered() {
  }

  // Parameters:
  //     code     string          key code
  //     ctrl     string          control key flag
  //     shift    string          shift key flag
  //     ev       Event object    native event object
  onEditKeyPressed(code, ctrl, shift, ev) {
    console.info('Key pressed', code)
    if (code == 13) {
        this._listObject.stopEdit()
    }
    return true
  }

  // Parameters:
  //     id    string|number    id of the item which will be removed
  // Returns:
  //           boolean          true to trigger the default action, false to block it
  onBeforeDeleted(id) {
    const selectedSnippetId = this._dataProvider.getSelectedSnippetId(this._contextId)
    const dataCount = this._listObject.dataCount()

    if (dataCount > 1) {
      let id

      if (this._listObject.indexById(selectedSnippetId) < dataCount - 1) {
        id = this._listObject.next(selectedSnippetId)
      } else {
        id = this._listObject.previous(selectedSnippetId)
      }

      this._dataProvider.setSelectedSnippetId(this._contextId, id)
      this._listObject.select(id)

    } else {
      this._dataProvider.setSelectedSnippetId(this._contextId, -1)
      this._codeView.setEnabled(false)
    }

    return true
  }

  // Parameters:
  //     id    string|number    id of the item
  onAfterEditStopped(id) {
    this._listObject.update(id, this._dataProvider.buildItemForSnippetsList(id))
  }

  //---------------------------------------------------------------------

  onSelectBoxChanged(selectBoxHtmlId, snippetId) {
    const tagsIds = []
    jQuery(selectBoxHtmlId).find(':selected').each(function () {
      const tagId = jQuery(this).val()
      const tagName = jQuery(this).text()
      tagsIds.push(tagId)
    })

    let bitMaskSum = bigInt(0)
    tagsIds.forEach(function (tagId) {
      const tagBitMask = this._dataProvider.getBitMaskOfTag(tagId)
      bitMaskSum = bitMaskSum.plus(bigInt(tagBitMask))
    }.bind(this))

    this._dataProvider.setSnippetBitMaskSum(snippetId, bitMaskSum.toString())
  }

}
