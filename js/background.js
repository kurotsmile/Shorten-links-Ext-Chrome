const CONTEXT_MENU_ID = "MY_CONTEXT_MENU";
function getword(info,tab) {
    if (info.menuItemId !== CONTEXT_MENU_ID) {
        return;
    }
    chrome.tabs.create({
        url: chrome.extension.getURL('popup.html'),
        active: false
    }, function(tab) {
        chrome.windows.create({
            tabId: tab.id,
            type: 'popup',
            focused: true,
            top:0,width:350,height:500
        });
    });
}
chrome.contextMenus.create({
    title: "Add",
    contexts:["all"],
    id: CONTEXT_MENU_ID
});
chrome.contextMenus.onClicked.addListener(getword);