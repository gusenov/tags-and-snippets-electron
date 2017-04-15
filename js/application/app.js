/*jslint devel: true */
/*global $, dhtmlxEvent, dhtmlXLayoutObject, dhtmlXTabBar */

var DhtmlXLayoutObject = dhtmlXLayoutObject,
    DhtmlXTabBar = dhtmlXTabBar;

function createTab(tags_tabbar, tabNo, tabName, tab_pos, x) {
    'use strict';
    var tags_tab,
        tags_tab_tpl = document.querySelector('#tags_tab_template'),
        tags_tab_clone;
    
    tags_tabbar.addTab('tags_tab_' + tabNo, tabName, null, tab_pos, true, x);
    tags_tab = tags_tabbar.cells('tags_tab_' + tabNo);
    tags_tab.setActive();
    
    tags_tab_clone = document.importNode(tags_tab_tpl.content, true);
    document.querySelector('#copy').appendChild(tags_tab_clone);
    tags_tab_clone = $('#copy #tags_tab_content').get(0);
    tags_tab_clone.id = 'tags_tab_content_' + tabNo;
    tags_tabbar.tabs('tags_tab_' + tabNo).appendObject(tags_tab_clone);
    
    $(".js-example-basic-multiple").select2({
        tags: true
    });
    
    return { tab: tags_tab };
}

function createTabBar() {
    'use strict';
    var tags_tabbar,
        tags_tab_add;
    
    tags_tabbar = new DhtmlXTabBar("tags_tabbar");
    
    // Первая незакрываемая вкладка.
    createTab(tags_tabbar, 1, "default", 1, false);
    
    // Вкладка "+" для добавления новых вкладок.
    tags_tabbar.addTab('tags_tab_add', '+', null, null, false, false);
    tags_tab_add = tags_tabbar.cells('tags_tab_add');
    tags_tab_add.disable();
    
    tags_tabbar.attachEvent("onTabClick", function (id, lastId) {
        if (id.localeCompare('tags_tab_add') === 0) {
            createTab(tags_tabbar, tags_tabbar.getAllTabs().length, "New Tab", tags_tabbar.getAllTabs().length - 1, true);
        }
    });
    
    tags_tabbar.attachEvent("onTabClose", function (id) {
        tags_tabbar.forEachTab(function (tab) {
            if (tags_tabbar.tabs(id).getIndex() - tab.getIndex() === 1) {
                tab.setActive();
            }
        });
        return true;
    });
    
    return { tabbar: tags_tabbar };
}

function openFolder() {
    'use strict';
    createTabBar();
}

(function () {
    'use strict';
    dhtmlxEvent(window, "load", function () {
        window.dhx4.skin = 'material';
//        window.dhx4.skin = 'dhx_skyblue';
//        window.dhx4.skin = 'dhx_web';
//        window.dhx4.skin = 'dhx_terrace';
    });
}());
