document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('button').addEventListener('click', onClick, false)

    // Buat show loading indicator
    const loader = document.querySelector("#loading")

    function displayLoading() {
        loader.classList.add("display")
        setTimeout(() => {
            loader.classList.remove("display")
        }, 5000)
    }

    function hideLoading() {
        loader.classList.remove("display")
    }

    // Function yang dijalankan ketika click 'Detect'
    function onClick() {
        displayLoading()
        chrome.tabs.query({currentWindow: true, active: true},
        function (tabs) {
            var activeTab = tabs[0].url
            if (activeTab != undefined) {
                if (activeTab.includes("inbox/") || activeTab.includes("starred/") || activeTab.includes("snoozed/") 
                || activeTab.includes("imp/") || activeTab.includes("sent/") || activeTab.includes("drafts/") || activeTab.includes("social/") || 
                activeTab.includes("updates/") || activeTab.includes("forums/") || activeTab.includes("promotions/") || activeTab.includes("chats/") || 
                activeTab.includes("scheduled/") || activeTab.includes("all/") || activeTab.includes("spam/") || activeTab.includes("trash/") || activeTab.includes("search/")) {
                    chrome.tabs.sendMessage(tabs[0].id, 'hi', loadingIndicator)
                } else {
                    chrome.tabs.sendMessage(tabs[0].id, 'hi', displayWrongTabError)
                }
            } else {
                chrome.tabs.sendMessage(tabs[0].id, 'hi', displayWrongTabError)
            }
        })        
    } 

    function loadingIndicator(res) {
        setUrlFound(res)
    }

    // Menampilkan hasil return phishing or not dari google cloud
    function setUrlFound (res) {
        var response = postAIResponse(res)
        hideLoading()
        document.getElementById('loading').style.display = "none"
        showElement(res)
        
        var emailRespond = document.getElementById('email-res')
        var detail = document.getElementById('detail')
        var containerId1 = document.getElementById('1')
        var containerImage = document.getElementById('image')

        if (response == 0) {
            emailRespond.innerText = "This Email is safe"
            detail.innerText = "Our system did not found any suspicious content on the email's subject, body or url(s) that might contains phishing."
            containerImage.src = "./image/safe-illustration.png"
        } else {
            containerId1.style.backgroundColor = "rgb(248,110,110)"
            emailRespond.innerText = "This Email is Phishing"
            detail.innerText = "This email has suspicious content in its subject, body, or url(s) that are detected by our system."
            containerImage.src = "./image/phishing-illustration.png"
        }
    }

    function postAIResponse(res) {
        var xhr = new XMLHttpRequest();
        var url = 'https://asia-southeast2-second-metrics-344913.cloudfunctions.net/modelcaller-v1/predict'
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

    function displayWrongTabError() {
        hideLoading()

        var detail = document.getElementById('detail')
        var containerId2 = document.getElementById('2')
        var containerImage = document.getElementById('image')
        var textId = document.getElementById('demo')
        var detectButton = document.getElementById('3')
        var loadingContainer = document.getElementById('loading')

        containerId2.style.display = "block"
        containerImage.style.display = "block"
        textId.style.display = "none"
        detectButton.style.display = "none"

        loadingContainer.remove()
        textId.remove()
        detectButton.remove()
        
        detail.innerText = "Please run the extension inside a specific mail in Gmail (mail.google.com)"
        containerImage.src = "./image/instruction.gif"
        containerImage.style.width = "300px"
        containerImage.style.height = "200px"
    }

} , false)