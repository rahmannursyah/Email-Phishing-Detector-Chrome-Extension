document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('button').addEventListener('click', onClick, false)

    // var script = document.createElement('script');
    // script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
    // script.type = 'text/javascript';
    // document.getElementsByTagName('head')[0].appendChild(script);

    function onClick() {
        chrome.tabs.query({currentWindow: true, active: true},
        function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, 'hi', setUrlFound)
        })        
    } 

    function setUrlFound (res) {
        var response = postAIResponse(res)
        showElement(res)

        var allUrl = document.getElementById('url-list')
        if (response.contains(0)) {
            allUrl.innerText = "EMAIL IS SAFE BICHISS"
        } else {
            allUrl.innerText = "EMAIL IS PHISHING BICHISSSS"
        }
        // allUrl.innerText = res.allFeatures
    }

    async function postAIResponse(res) {
        var xhr = new XMLHttpRequest();
        var url = 'https://asia-southeast2-second-metrics-344913.cloudfunctions.net/modelcaller-v1/predict'
        var dataFerdi = [0,2457,369,0.15018315018315018,0,0,5,42,0.11904761904761904,0,0,0,3,0,0,3,0,0,0,0,0,0,0,0,0]
        var data = JSON.stringify({
            'data': res.allFeatures
        })
        xhr.open("POST", url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(data)
        xhr.onloadend = function() {
            alert(xhr.responseText)
            return xhr.responseText
        }  
    }
    postAIResponse(res).then(
        alert
    )

    async function showElement() {
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