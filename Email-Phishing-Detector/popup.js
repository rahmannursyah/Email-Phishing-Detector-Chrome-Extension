document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('button').addEventListener('click', onClick, false)

    function onClick() {
        chrome.tabs.query({currentWindow: true, active: true},
        function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, 'hi', setUrlFound)
        })        
    } 

    function setUrlFound (res) {
        showElement()

        var allUrl = document.getElementById('url-list')
        if (res.email != null) {
            allUrl.innerText = res.subject + "\n" + res.sender + "\n" + res.email
        } else {
            allUrl.innerText = "no url(s) found"
        }
    }

    function showElement() {
        var containerId1 = document.getElementById('1')
        var containerId2 = document.getElementById('2')
        var textId = document.getElementById('demo')

        if (containerId1.style.display == "none") {
            return
        } else {
            containerId1.style.display = "flex"
            containerId2.style.display = "flex"
            textId.style.display = "none"
        }
    }

} , false)