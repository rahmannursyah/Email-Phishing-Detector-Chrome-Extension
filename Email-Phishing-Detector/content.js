chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var expression = /(https?)?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    const regex = new RegExp(expression, 'gi')
    
    let emailBodyPath = getElementByXpath("/html/body/div[7]/div[3]/div/div[2]/div[1]/div[2]/div/div/div/div/div[2]/div/div[1]/div/div/div/table/tr/td[1]/div[2]/div[2]/div/div[3]/div/div/div/div/div/div[1]/div[2]/div[3]/div[3]/div")
    let emailSubjectPath = getElementByXpath("/html/body/div[7]/div[3]/div/div[2]/div[1]/div[2]/div/div/div/div/div[2]/div/div[1]/div/div/div/table/tr/td[1]/div[2]/div[1]")
    let emailSenderPath = getElementByXpath("/html/body/div[7]/div[3]/div/div[2]/div[1]/div[2]/div/div/div/div/div[2]/div/div[1]/div/div/div/table/tr/td[1]/div[2]/div[2]/div/div[3]/div/div/div/div/div/div[1]/div[2]/div[1]/table/tbody/tr[1]/td[1]/table/tbody/tr/td/h3")
    // let emailAttachmentPath = getElementByXpath("/html/body/div[7]/div[3]/div/div[2]/div[1]/div[2]/div/div/div/div/div[2]/div/div[1]/div/div[2]/div/table/tr/td[1]/div[2]/div[2]/div/div[3]/div/div/div/div/div/div[1]/div[2]/div[3]")

    var emailBody = emailBodyPath.innerText
    var emailBodyUrl = emailBodyPath.getElementsByTagName("a")
    var emailSubjectHtml = emailSubjectPath.getElementsByTagName("h2")[0]
    var emailSenderHtml = emailSenderPath.getElementsByTagName("span")
    // var emailAttachment = emailAttachmentPath.getElementByXpath("div")
    var urls = []
    var emailSender = ""
    var emailSubject = emailSubjectPath.getElementsByTagName("h2")[0].textContent
    var isMultipart = 0

    for (let index = 0; index < emailBodyUrl.length; index++) {
        if (!emailBodyUrl[index].href.includes("mailto")) {
            urls.push(emailBodyUrl[index].href)
        }
    }
    
    for (let index = 0; index < emailSenderHtml.length; index++) {
        if (emailSenderHtml[index].innerText.includes("@") && emailSenderHtml[index].innerText.includes("<")) {
            let tmpEmail = emailSenderHtml[index].innerText
            emailSender = substring(tmpEmail)
            break
        } else {
            let tmpEmail = emailSenderHtml[index].innerText
            emailSender = tmpEmail
            break
        }
    }

    var totalSusWordInSubject = countSusWordInSubject(emailSubject)
    var totalCharacterInSubject = countCharacterInSubject(emailSubject)
    var totalWordsInSubject = countWordsInSubject(emailSubject)

    var susWordInUrl = countSusWordInUrl(emailBodyUrl)

    let urlFeature = getUrlFeatures(urls)
    // getUrlFeatures(susWordInUrl)

    sendResponse({subject: emailSubject, sender: emailSender, body: emailBody, url: urls})
})

function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }

function substring(myString) {
    var mySubstring = myString.substring (
        myString.indexOf("<") + 1,
        myString.lastIndexOf(">")
    )
    return mySubstring
} 

// MARK: HEADER FEATURES

function countSusWordInSubject(subjectInEmail) {
    let susWord = ['bank', 'debit', 'verify', 'password', 'attention', 'credit', 'urgent', 'billing', 'account', 'invoice']
    var count = 0

    susWord.forEach(sus => {
        count += subjectInEmail.toLowerCase().split(sus).length - 1
    });

    return count
}

function countCharacterInSubject(subjectInEmail) {
    return subjectInEmail.length
}

function countWordsInSubject(subjectInEmail) {
    return subjectInEmail.split(' ').length
}

// MARK: URL FEATURES

function countUrlInEmail(urlsInEmail) {
    var count = urlsInEmail.length

    return count
}

function countSusWordInUrl(tagAElements) {
    let susWord = ['click', 'here', 'update', 'login', 'register']
    var count = 0

    for (let index = 0; index < tagAElements.length; index++) {
        for (let j = 0;  j< susWord.length; j++) {
           if (tagAElements[index].innerText.toLowerCase().includes(susWord[j])) {
               count += 1
           }
        }
    }

    return count
}

function searchAtSymbolInUrl(myUrl) {
    var totalAtSymbol = 0
    
    myUrl.forEach(url => {
        if (url.includes('@')) {
            for(let index = 0; index < url.length; index++) {
                if (url[index] == "@") {
                    totalAtSymbol += 1
                }
            }
        }
    });

    return totalAtSymbol
}

function checkForIpInUrl(urlsInEmail) {
    let ipUrl = RegExp([
        '^https?:\/\/([a-z0-9\\.\\-_%]+:([a-z0-9\\.\\-_%])+?@)?',
        '((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\\.){3}(25[0-5]|2[0-4',
        '][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])?',
        '(:[0-9]+)?(\/[^\\s]*)?$'
    ].join(''), 'i')
    var isIpInUrl = 0

    for (let index = 0; index < urlsInEmail.length; index++) {
        if (ipUrl.test(urlsInEmail[index])) {
            isIpInUrl = 1
            return isIpInUrl
            break
        }
    }

    return isIpInUrl
}

function countUrlsWithIp(urlsInEmail) {
    let ipUrl = RegExp([
        '^https?:\/\/([a-z0-9\\.\\-_%]+:([a-z0-9\\.\\-_%])+?@)?',
        '((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\\.){3}(25[0-5]|2[0-4',
        '][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])?',
        '(:[0-9]+)?(\/[^\\s]*)?$'
    ].join(''), 'i')
    var total = 0

    for (let index = 0; index < urlsInEmail.length; index++) {
        if (ipUrl.test(urlsInEmail[index])) {
            total += 1
        }
    }

    return total
}

function countDomainInUrl(urlsInEmail) {
    var domain = []

    urlsInEmail.forEach(url => {
        let d = (new URL(url))
        if (!domain.includes(d)) {
            domain.push(d)
        }
    });

    return domain.length
}

function countUrlWithImgLink(urlsInEmail) {
    imgFormat = ['jpg', 'apng', 'avif', 'gif', 'png', 'jpeg', 'svg', 'webp']
    var count = 0

    for(let i = 0; i<urlsInEmail.length; i++) {
        for(let j = 0; j<imgFormat.length; j++) {
            if (urlsInEmail[i].includes(imgFormat[j])) {
                count += 1
                break
            }
        }
    }

    return count
}

function countPeriodInUrl(urlsInEmail) {
    var count = 0

    urlsInEmail.forEach(url => {
        for(let index = 0; index < url.length; index++) {
            if (url[index] == ".") {
                count += 1
            }
        }
    });

    return count
}

function checkUrlWithPort(urlsInEmail) {
    var isPort = 0

    urlsInEmail.forEach(url => {
        let domain = (new URL(url))
        if (domain.port) {
            isPort = 1
        }
    });

    return isPort
}

function countUrlWithPort(urlsInEmail) {
    var count = 0

    urlsInEmail.forEach(url => {
        let domain = (new URL(url))
        if (domain.port) {
            count += 1
        }
    });

    return count
}

let shorteningRegex = /https?:\/\/(bit\.ly|goo\.gl|shorte\.st|go2l\.ink|x\.co|ow\.ly|t\.co|tinyurl|tr\.im|is\.gd|cli\.gs|yfrog\.com|migre\.me|ff\.im|tiny\.cc|url4\.eu|twit\.ac|su\.pr|twurl\.nl|snipurl\.com|short\.to|BudURL\.com|ping\.fm|post\.ly|Just\.as|bkite\.com|snipr\.com|fic\.kr|loopt\.us|doiop\.com|short\.ie|kl\.am|wp\.me|rubyurl\.com|om\.ly|to\.ly|bit\.do|t\.co|lnkd\.in|db\.tt|qr\.ae|adf\.ly|goo\.gl|bitly\.com|cur\.lv|tinyurl\.com|ow\.ly|bit\.ly|ity\.im|q\.gs|is\.gd|po\.st|bc\.vc|twitthis\.com|u\.to|j\.mp|buzurl\.com|cutt\.us|u\.bb|yourls\.org|x\.co|prettylinkpro\.com|scrnch\.me|filoops\.info|vzturl\.com|qr\.net|1url\.com|tweez\.me|v\.gd|tr\.im|link\.zip\.net)/i
function checkForUrlShortening(urlsInEmail) {
    var match = 0

    urlsInEmail.forEach(url => {
        // match = url.search(shorteningRegex)
        if (url.match(shorteningRegex) != null) {
            match = 1
        }
    });

    console.log(match)
    return match
}

function countUrlShortening(urlsInEmail) {
    var match = 0
    var count = 0

    urlsInEmail.forEach(url => {
        // match = url.search(shorteningRegex)
        if (url.match(shorteningRegex) != null) {
            count += 1
        }
    });

    return count
}

function checkHttpInUrl(urlsInEmail) {
    var isHttp = 0
    
    urlsInEmail.forEach(url => {
        if (!url.includes('https')) {
            isHttp = 1
        }
    });
    
    return isHttp
}

function countUrlWithHttp(urlsInEmail) {
    var count = 0
    
    urlsInEmail.forEach(url => {
        if (!url.includes('https')) {
            count += 1
        }
    });
    
    return count
}

function getUrlFeatures(urlsInEmail) {
    var totalUrlInEmail = countUrlInEmail(urlsInEmail)
    var urlWithAt = searchAtSymbolInUrl(urlsInEmail)
    var isUrlWithIp = checkForIpInUrl(urlsInEmail)
    var totalUrlWithIp = countUrlsWithIp(urlsInEmail)
    var totalDomainInUrl = countDomainInUrl(urlsInEmail)
    var totalUrlWithImg = countUrlWithImgLink(urlsInEmail)
    var totalPeriodInUrl = countPeriodInUrl(urlsInEmail)
    var isUrlWithPort = checkUrlWithPort(urlsInEmail)
    var totalUrlWithPort = countUrlWithPort(urlsInEmail)
    var isUrlShortened = checkForUrlShortening(urlsInEmail) 
    var totalShortenedUrl = countUrlShortening(urlsInEmail)
    var isHttpInUrl = checkHttpInUrl(urlsInEmail)
    var totalHttpUrl = countUrlWithHttp(urlsInEmail)

    // alert('total' + totalUrlInEmail)
    // alert('@' + urlWithAt)
    // alert('isIp' + isUrlWithIp)
    // alert('total ip' + totalUrlWithIp)
    // alert('total domain' + totalDomainInUrl)
    // alert('total url' + totalUrlWithImg)
    // alert('total period' + totalPeriodInUrl)
    // alert('is port' + isUrlWithPort)
    // alert('total port' + totalUrlWithPort)
    alert('is shortened' + isUrlShortened)
    alert('total shortened' + totalShortenedUrl)
    // alert('is http' + isHttpInUrl)
    // alert('total http' + totalHttpUrl)
}