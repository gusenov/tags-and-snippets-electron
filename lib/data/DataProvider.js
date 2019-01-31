import { BitMaskUtils } from '../utils/BitMaskUtils.js'

export class DataProvider {
  constructor() {
    this.reset()
  }

  // Сброс провайдера данных:
  reset() {
    this._data = {
      contexts: {},
      selectedContext: -1,
      tags: {},
      snippets: {}
    }
  }

  //---------------------------------------------------------------------
  // Работа с контекстами:
  //---------------------------------------------------------------------

  // Поиск свободного идентификатора для нового контекста:
  findFreeContextId() {
    let freeContextId = 1

    while (true) {
      let isFound = true

      for (const contextId in this._data.contexts) {
        if (this._data.contexts.hasOwnProperty(contextId)) {
          if (parseInt(contextId) === freeContextId) {
            isFound = false
          }
        }
      }  // for

      if (isFound) {
        break
      } else {
        ++freeContextId
      }
    }  // while

    return freeContextId
  }

  createContext(contextName = 'untitled') {
    const contextId = this.findFreeContextId()
    this._data.contexts[contextId] = {
      name: contextName,
      selectedTags: [],
      selectedSnippet: -1
    }
    return contextId
  }

  getContextById(contextId) {
    return this._data.contexts[contextId]
  }

  updateContextName(contextId, newContextName) {
    if (this._data.contexts[contextId] !== newContextName) {
      this._data.contexts[contextId].name = newContextName
    }
  }

  deleteContext(contextId) {
    delete this._data.contexts[contextId]
  }

  // Обход всех контекстов:
  forEachContext(callback) {
    for (const contextId in this._data.contexts) {
      if (this._data.contexts.hasOwnProperty(contextId)) {
        if (callback(parseInt(contextId), this._data.contexts[contextId])) {
          continue
        } else {
          break
        }
      }
    }
  }

  selectTag(contextId, selectedTagId, isSelected) {
    if (isSelected) {
      this._data.contexts[contextId].selectedTags.push(selectedTagId)
    } else {
      this._data.contexts[contextId].selectedTags =
        this._data.contexts[contextId].selectedTags.filter(tagId => tagId != selectedTagId)
    }
  }

  setSelectedContextId(contextId) {
    this._data.selectedContext = contextId
  }

  getSelectedContextId() {
    return this._data.selectedContext
  }

  //---------------------------------------------------------------------
  // Работа с тегами:
  //---------------------------------------------------------------------

  // Поиск свободного идентификатора для нового тега:
  findFreeTagId() {
    let freeTagId = 1

    while (true) {
      let isFound = true

      for (const tagId in this._data.tags) {
        if (this._data.tags.hasOwnProperty(tagId)) {
          if (parseInt(tagId) === freeTagId) {
            isFound = false
          }
        }
      }  // for

      if (isFound) {
        break
      } else {
        ++freeTagId
      }
    }  // while

    return freeTagId
  }

  // Поиск свободной битовой маски для нового тега:
  findFreeTagBitMask() {
    let freeTagBitMask = bigInt(1)

    while (true) {
      let isFound = true

      for (const tagId in this._data.tags) {
        if (this._data.tags.hasOwnProperty(tagId)) {
          const tag = this._data.tags[tagId]
          if (tag.bitMask === freeTagBitMask.toString()) {
            isFound = false
          }
        }
      }  // for

      if (isFound) {
        break
      } else {
        freeTagBitMask = freeTagBitMask.shiftLeft(1)
      }
    }  // while

    return freeTagBitMask.toString()
  }

  createTag(tagName, parentTagId) {
    const tagId = this.findFreeTagId()
    const tagBitMask = this.findFreeTagBitMask()
    this._data.tags[tagId] = {
      "name": tagName,
      "bitMask": tagBitMask,
      "parent": typeof parentTagId !== 'undefined' ? parentTagId : -1
    }
    return tagId
  }

  updateTagName(tagId, newTagName) {
    if (this._data.tags[tagId] !== newTagName) {
      this._data.tags[tagId].name = newTagName
    }
  }

  deleteTag(tagId) {
    const tagBitMask = bigInt(this.getBitMaskOfTag(tagId))

    this.forEachSnippet(function (snippetId, snippet) {
      const snippetBitMaskSum = bigInt(snippet.bitMaskSum)
      if (BitMaskUtils.isBitMaskIncludedInBitMaskSum(tagBitMask, snippetBitMaskSum)) {
        this.setSnippetBitMaskSum(snippetId, snippetBitMaskSum.minus(tagBitMask).toString())
      }
      return true
    }.bind(this))

    this.forEachContext(function (contextId, context) {
      const selectedTagIndex = context.selectedTags.indexOf(tagId)
      this._data.contexts[contextId].selectedTags.splice(selectedTagIndex, 1)
      return true
    }.bind(this))

    delete this._data.tags[tagId]
  }

  // Рекурсивный обход тегов и генерация древовидной структуры для dhtmlXGrid:
  buildRowsForTagsTree(parentTagId, contextId) {
    const resultRows = []  // результирующий массив строк.

    this.forEachTag(function (tagId, tag) {
      if (tag.parent === parseInt(parentTagId)) {
        resultRows.push({
            'id': tagId,
            'data': [
              typeof contextId !== 'undefined'
                ? this._data.contexts[contextId].selectedTags.includes(parseInt(tagId))
                : false,
              { 'value': tag.name, 'image': 'tag-blue-icon.png' }
            ],
            'rows': this.buildRowsForTagsTree(tagId, contextId)
        })
      }
      return true
    }.bind(this))

    return resultRows
  }

  // Создать JSON-строку, которую может распарсить dhtmlXGrid:
  buildJsonStringForTagsTree(contextId) {
    const data = { rows: this.buildRowsForTagsTree('-1', contextId) }  // результирующая JSON-строка.
    return JSON.stringify(data, null, 2)
  }

  // Изменить родительский тег на новый:
  changeTagParent(tagId, newParentTagId) {
    if (this._data.tags[tagId].parent !== newParentTagId) {
      this._data.tags[tagId].parent = newParentTagId
    }
  }

  forEachTag(callback) {
    // Обход всех ключей (идентификаторов тегов) в свойстве 'tags':
    for (const tagId in this._data.tags) {
      // Проверяем, действительно ли имеется такой ключ в свойстве 'tags':
      if (this._data.tags.hasOwnProperty(tagId)) {
        // Получаем информацию о теге по его идентификатору:
        const tag = this._data.tags[tagId]
        if (callback(tagId, tag)) {
          continue
        } else {
          break
        }
      }
    }
  }

  // Массив из ID тегов включенных в заданную сумму битовых масок - bitMaskSum:
  getTagsDictByBitMaskSum(bitMaskSum) {
    const tags = {}
    this.forEachTag(function (tagId, tag) {
      // Имея битовую маску bitMaskSum,
      // делаем bitMaskSum & tag.bitMask,
      // чтобы проверить входит ли в неё тег tag:
      if (bitMaskSum.and(bigInt(tag.bitMask)).compare(0) !== 0) {
        tags[tagId] = tag
      }
      return true
    }.bind(this))
    return tags
  }

  getTagById(tagId) {
    return this._data.tags[tagId]
  }

  getBitMaskOfTag(tagId) {
    const tag = this._data.tags[tagId]
    return tag.bitMask
  }

  // Множество битовых масок выбранных тегов:
  getBitMasksOfSelectedTags(contextId) {
    return new Set(this._data
                       .contexts[contextId]
                       .selectedTags
                       .map(function (selectedTagId) {
      return bigInt(this.getTagById(selectedTagId).bitMask)
    }.bind(this)))
  }

  getBitMaskSumOfSelectedTags(contextId) {
    let bitMaskSum = bigInt(0)
    this.getBitMasksOfSelectedTags(contextId).forEach(bitMask => {
      bitMaskSum = bitMaskSum.plus(bitMask)
    }.bind(this))
    return bitMaskSum
  }

  getSelectedTagsAsJoinedString(contextId) {
    const tagsNames = this._data
                          .contexts[contextId]
                          .selectedTags
                          .map(function (selectedTagId) {
                                return this.getTagById(selectedTagId).name
                               }.bind(this))

    return tagsNames.join(', ')
  }

  getSnippetTagsAsJoinedString(snippetId) {
    const snippet = this.getSnippetById(snippetId)
    const snippetTagsDict = this.getTagsDictByBitMaskSum(bigInt(snippet.bitMaskSum))

    const snippetTagsNamesArr = []
    for (const tagId in snippetTagsDict) {
      if (snippetTagsDict.hasOwnProperty(tagId)) {
        snippetTagsNamesArr.push(snippetTagsDict[tagId].name)
      }
    }

    return snippetTagsNamesArr.join(', ')
  }

  getSelectedSnippetTagsAsJoinedString(contextId) {
    const snippetId = this.getSelectedSnippetId(contextId)
    return this.getSnippetTagsAsJoinedString(snippetId)
  }

  //---------------------------------------------------------------------
  // Работа со сниппетами:
  //---------------------------------------------------------------------

  // Поиск свободного идентификатора для нового сниппета:
  findFreeSnippetId() {
    let freeSnippetId = 1

    while (true) {
      let isFound = true

      for (const snippetId in this._data.snippets) {
        if (this._data.snippets.hasOwnProperty(snippetId)) {
          if (parseInt(snippetId) === freeSnippetId) {
            isFound = false
          }
        }
      }  // for

      if (isFound) {
        break
      } else {
        ++freeSnippetId
      }
    }  // while

    return freeSnippetId
  }

  createSnippetForSelectedTags(contextId) {
    const bitMaskSum = this.getBitMaskSumOfSelectedTags(contextId)
    const snippetId = this.findFreeSnippetId()
    this._data.snippets[snippetId] = {
      bitMaskSum: bitMaskSum.toString(),
      contents: '',
      cursorPosition : { row: 0, column: 0 },
      highlight: 'text'
    }
    return snippetId
  }

  buildItemForSnippetsList(snippetId) {
    const snippet = this.getSnippetById(snippetId)
    const snippetBitMaskSum = bigInt(snippet.bitMaskSum)

    let tagsNames = []
    let tagsOptions = ''
    const tagsOfSnippet = this.getTagsDictByBitMaskSum(snippetBitMaskSum)
    this.forEachTag(function (tagId, tag) {
      tagsOptions += "<option value='" + tagId + "'"
         + (tagsOfSnippet.hasOwnProperty(tagId) ? "selected='selected'" : "")
         + ">" + tag.name + '</option>'

      if (tagsOfSnippet.hasOwnProperty(tagId)) {
        tagsNames.push(tag.name)
      }

      return true
    })

    return {
      id: snippetId,
      tagsOptions: tagsOptions,
      tagsNames: tagsNames.join(', ')
    }
  }

  buildJsonStringForSnippetsList(contextId) {
    const data = []

    const bitMasksOfSelectedTags = this.getBitMasksOfSelectedTags(contextId)

    this.forEachSnippet(function (snippetId, snippet) {
      // Сниппет попадает в список сниппетов для выбранных тегов только тогда,
      // когда множество его тегов является надмножеством множества выбранных тегов:

      const snippetBitMaskSum = bigInt(snippet.bitMaskSum)
      const bitMasksOfNotIncludedTags = BitMaskUtils.filterBitMasks(bitMasksOfSelectedTags, snippetBitMaskSum, false)

      if (bitMasksOfNotIncludedTags.size > 0) {
        return true
      }

      data.push(this.buildItemForSnippetsList(snippetId))

      return true
    }.bind(this))

    return JSON.stringify(data, null, 2)
  }

  isSnippetVisible(contextId, snippetId) {
    const snippet = this.getSnippetById(snippetId)
    const snippetBitMaskSum = bigInt(snippet.bitMaskSum)

    const bitMasksOfSelectedTags = this.getBitMasksOfSelectedTags(contextId)
    const bitMasksOfNotIncludedTags = BitMaskUtils.filterBitMasks(bitMasksOfSelectedTags, snippetBitMaskSum, false)

    return bitMasksOfNotIncludedTags.size === 0
  }

  forEachSnippet(callback) {
    for (const snippetId in this._data.snippets) {
      if (this._data.snippets.hasOwnProperty(snippetId)) {
        const snippet = this._data.snippets[snippetId]
        if (callback(snippetId, snippet)) {
          continue
        } else {
          break
        }
      }
    }
  }

  getSelectedSnippetId(contextId) {
    const snippetId = this._data.contexts[contextId].selectedSnippet
    return snippetId
  }

  getSelectedSnippet(contextId) {
    return this._data.snippets[this.getSelectedSnippetId(contextId)]
  }

  setSelectedSnippetId(contextId, snippetId) {
    this._data.contexts[contextId].selectedSnippet = snippetId
  }

  getSnippetById(snippetId) {
    return this._data.snippets[snippetId]
  }

  setSnippetContents(snippetId, contents) {
    this._data.snippets[snippetId].contents = contents
  }

  setSnippetBitMaskSum(snippetId, bitMaskSum) {
    this._data.snippets[snippetId].bitMaskSum = bitMaskSum
  }

  setSnippetHighlight(snippetId, highlight) {
    this._data.snippets[snippetId].highlight = highlight
  }

  getSnippetHighlight(snippetId) {
    return this._data.snippets[snippetId].highlight
  }

  getSelectedSnippetCursorPosition(contextId) {
    const selectedSnippetId = this.getSelectedSnippetId(contextId)
    return this._data.snippets[selectedSnippetId].cursorPosition
  }

  setSelectedSnippetCursorPosition(contextId, cursorPosition) {
    const selectedSnippetId = this.getSelectedSnippetId(contextId)
    this._data.snippets[selectedSnippetId].cursorPosition = cursorPosition
  }

  deleteSnippet(snippetId) {
    this.forEachContext(function (contextId, context) {
      if (this._data.contexts[contextId].selectedSnippet === snippetId) {
        this._data.contexts[contextId].selectedSnippet = -1
      }
      return true
    }.bind(this))

    delete this._data.snippets[snippetId]
  }

  //---------------------------------------------------------------------

  // Данные:
  get data() { return this._data }
  set data(data)    { this._data = data }
}
