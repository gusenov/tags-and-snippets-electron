#!/bin/bash

#set -x  # echo on

iconarchive_sh="~/repo/lang/sh/iconarchive-downloader-sh/iconarchive.sh"
eval iconarchive_sh="$iconarchive_sh"

target_dir="./resources/icons"

[ -d "$target_dir" ] && rm -rf "$target_dir"

farm_fresh_icons_by_fatcow="http://www.iconarchive.com/show/farm-fresh-icons-by-fatcow"

declare -a urls=(
  # Farm Fresh Iconset (3000 icons) | Fatcow Web Hosting
  # http://www.iconarchive.com/show/farm-fresh-icons-by-fatcow.html
  "$farm_fresh_icons_by_fatcow/tag-blue-icon.html"
  "$farm_fresh_icons_by_fatcow/tag-blue-add-icon.html"
  "$farm_fresh_icons_by_fatcow/tag-blue-delete-icon.html"
  "$farm_fresh_icons_by_fatcow/cursor-icon.html"
  "$farm_fresh_icons_by_fatcow/folder-database-icon.html"
  "$farm_fresh_icons_by_fatcow/database-add-icon.html"
  "$farm_fresh_icons_by_fatcow/database-save-icon.html"
  "$farm_fresh_icons_by_fatcow/door-open-icon.html"
  "$farm_fresh_icons_by_fatcow/tab-add-icon.html"
  "$farm_fresh_icons_by_fatcow/tab-delete-icon.html"
  "$farm_fresh_icons_by_fatcow/tab-edit-icon.html"
  "$farm_fresh_icons_by_fatcow/tabbar-icon.html"
  "$farm_fresh_icons_by_fatcow/arrow-refresh-icon.html"
  "$farm_fresh_icons_by_fatcow/arrow-undo-icon.html"
)

if [ -n "$urls" ]; then
 for url in "${urls[@]}"; do
   "$iconarchive_sh" -u="$url" -o="$target_dir" -s="16" --direct
 done
fi
