document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('button').addEventListener('click', onClick, false)

    function onClick() {
        chrome.tabs.query({currentWindow: true, active: true},
        function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, 'hi', setUrlFound)
        })        
    } 

    function setUrlFound (res) {
        const div = document.createElement('div')
        div.textContent = `${res.email} urls`
        var allUrl = document.getElementById('all-url')
        allUrl.innerText = ''
        
        res.email.forEach(e => {
            console.log(e)
            allUrl.innerText += e + "\n"
        });
        
    }

} , false)