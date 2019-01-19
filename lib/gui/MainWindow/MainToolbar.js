import { MainCommands } from './MainCommands.js'

// Главная панель инструментов:
export class MainToolbar extends MainCommands {
  constructor(layoutObject, dataProvider, mainTabbar) {
    super(dataProvider, mainTabbar)
    this._toolbarObject = layoutObject.attachToolbar()
    this._toolbarObject.setIconsPath('resources/icons/')
    this._toolbarObject.loadStruct('lib/gui/MainWindow/MainToolbar.json')
    this._toolbarObject.attachEvent('onClick', this.onClicked.bind(this))
  }

  get toolbarObject()       { return this._toolbarObject }
  set toolbarObject(toolbarObject) { this._toolbarObject = toolbarObject }

  // Parameters:
  //     id        string|number    id of the clicked/hovered menu item
  //     zoneId    string           context menu zone, if a menu rendered in the context menu mode
  //     cas       object           state of CTRL/ALT/SHIFT keys during the click (pressed/not pressed)
  onClicked(id, zoneId, cas) {
    this[id]()
  }
}
