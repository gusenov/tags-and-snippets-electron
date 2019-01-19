import { MainCommands } from './MainCommands.js'

// Главное меню:
export class MainMenu extends MainCommands {
  constructor(layoutObject, dataProvider, mainTabbar) {
    super(dataProvider, mainTabbar)
    this._menuObject = layoutObject.attachMenu()
    this._menuObject.setIconsPath('resources/icons/')
    this._menuObject.loadStruct('lib/gui/MainWindow/MainMenu.json')
    this._menuObject.attachEvent('onClick', this.onClicked.bind(this))
  }

  get menuObject()    { return this._menuObject }
  set menuObject(menuObject) { this._menuObject = menuObject }

  // Parameters:
  //     id        string|number    id of the clicked/hovered menu item
  //     zoneId    string           context menu zone, if a menu rendered in the context menu mode
  //     cas       object           state of CTRL/ALT/SHIFT keys during the click (pressed/not pressed)
  onClicked(id, zoneId, cas) {
    this[id]()
  }
}
