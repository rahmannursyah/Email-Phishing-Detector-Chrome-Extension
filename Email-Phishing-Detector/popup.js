document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('button').addEventListener('click', onClick, false)

    const loader = document.getElementById('loading')

    function displayLoading() {
        loader.classList.add("display")
        setTimeout(() => {
            loader.classList.remove("display")
        }, 5000)
    }

    function hideLoading() {
        loader.classList.remove("display")
    }

    function onClick() {
        chrome.tabs.query({currentWindow: true, active: true},
        function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, 'hi', setUrlFound)
        })        
    } 

    function setUrlFound (res) {
        displayLoading()
        var response = postAIResponse(res)
        showElement(res)
        hideLoading()

        alert(response)
        var emailRespond = document.getElementById('email-res')
        var detail = document.getElementById('detail')
        var containerId1 = document.getElementById('1')
        var containerImage = document.getElementById('image')
        var loaderDiv = document.getElementById('loading')

        if (response == 0) {
            loaderDiv.style.display = "none"
            emailRespond.innerText = "This Email is safe"
            detail.innerText = "Our system did not found any suspicious content on the email's subject, body or url(s) that might contains phishing."
            containerImage.src = "./image/safe-illustration.png"
        } else {
            loaderDiv.style.display = "none"
            containerId1.style.backgroundColor = "rgb(248,110,110)"
            emailRespond.innerText = "This Email is Phishing"
            detail.innerText = "This email has suspicious content in its subject, body, or url(s) that are detected by our system."
            containerImage.src = "./image/phishing-illustration.png"
        }
    }

    function postAIResponse(res) {
        var xhr = new XMLHttpRequest();
        var url = 'https://asia-southeast2-second-metrics-344913.cloudfunctions.net/modelcaller-v1/predict'
        var dataFerdi = [0,2457,369,0.15018315018315018,0,0,5,42,0.11904761904761904,0,0,0,3,0,0,3,0,0,0,0,0,0,0,0,0]
        var data = JSON.stringify({
            'data': res.allFeatures
        })
        xhr.open("POST", url, false);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(data)
        let aiResponse = xhr.responseText
        let result = JSON.parse(aiResponse)
        let status = result["status"]
        return status
    }

    async function showElement() {
        var containerId1 = document.getElementById('1')
        var containerId2 = document.getElementById('2')
        var detectButton = document.getElementById('3')
        var containerImage = document.getElementById('image')
        var textId = document.getElementById('demo')

        if (containerId1.style.display == "none") {
            return
        } else {
            containerId1.style.display = "flex"
            containerId2.style.display = "block"
            textId.style.display = "none"
            detectButton.style.display = "none"
            containerImage.style.display = "block"
        }
    }

} , false)