import { JsonFileDataProvider } from '../data/JsonFileDataProvider.js'

import { MainMenu } from './MainWindow/MainMenu.js'
import { MainToolbar } from './MainWindow/MainToolbar.js'
import { MainTabbar } from './MainWindow/MainTabbar.js'


// Главное окно:
export class MainWindow {
  constructor(skin) {
    window.skin = skin  // for tree image_path
    if (skin === 'material') {
      window.dhx4.skin = 'material'
    } else {
      window.dhx4.skin = 'dhx_' + skin
    }

    this._dataProvider = new JsonFileDataProvider()

    this._layoutObject = new dhtmlXLayoutObject(document.body, '1C')

    this._mainTabbar = new MainTabbar(
        this._layoutObject.cells('a')
      , this._dataProvider
    )

    this._mainMenu = new MainMenu(
        this._layoutObject
      , this._dataProvider
      , this._mainTabbar
    )

    this._mainToolbar = new MainToolbar(
        this._layoutObject
      , this._dataProvider
      , this._mainTabbar
    )
  }

  // Провайдер данных:
  get dataProvider()             { this._dataProvider }
  set dataProvider(dataProvider) { this._dataProvider = dataProvider }

  // Раскладка:
  get layoutObject()      { return this._layoutObject }
  set layoutObject(layoutObject) { this._layoutObject = layoutObject }

  // Главное меню:
  get mainMenu()  { return this._mainMenu }
  set mainMenu(mainMenu) { this._mainMenu = mainMenu }

  // Главная инструментальная панель:
  get mainToolbar()     { return this._mainToolbar }
  set mainToolbar(mainToolbar) { this._mainToolbar = mainToolbar }

  // Главная панель вкладок:
  get mainTabbar()    { return this._mainTabbar }
  set mainTabbar(mainTabbar) { this._mainTabbar = mainTabbar }
}
