# Shopping-List-App
A shopping list application created with VueJS

Enter items to make a list (optional aisle,index,store name and price)
  * aisle/index/store allows items to be sorted to ease shopping experience 
    (items with same aisle/index will be grouped by menu item color)
    Note, This drop down allows:
      -selection of a previously added index/aisle/location
      -Add Index the addition of an index/aisle/location
      -Edit allows editing of item name
      -Price to change or add price
      -Delete to completely remove item from list
  * price allows totals to be generated so there's no surprises at check out
  * tax when checked adds sales tax (to edit sales tax amount use menu icon in the upper right)
  * count will multiply dollar amounts and effect total items amount in lower left
  * In Cart (icon on left above price) select when item is placed in cart to reset the "Days" value
  * Days value tracks how many days since last purchase (See line above regarding In Cart icon)
  * Shopping Cart icon (on right) when selected (green) the item is considered to be active or something you are shopping for and will be shifted to the top of the list with other active items. When deselected (Gray) it is considered inactive and will be displayed with other inactive items below any active items.
  
 Totals/Footer
 *  Items represents the total number of different active items
 *  total (left) represents the total count of active items (if you modify the count or "quantity" of an item it will show here)
 * Tax will display the total amount of taxes you will be paying on all active items with "Tax" box checked (to update/view tax amount use menu icon in upper right of application)
 * Total (right) displays the totaled dollar amount for all active items
 
 Menu (Upper right)
 provides the following selections:
  * Sort by Name or Sort by Index
    -Sort by Index helps you shop for all items by aisle/location
    -Sort by Name helps you locate items on the list easier
  * Font Size allows you to modify list item font size
  * Tax allows editing/viewing of current sales tax amount
  * Save lets you save current master list that you can "Restore" if items are deleted later (this uses localStorage specific to device in wich you are displaying this application on)
  * Restore lets you retrieve your saved list
  * Clear will completely clear the list items and the list will be empty (See line above to Restore)
  * Revert will undo lastchange
  
