chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var expression = /(https?)?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    const regex = new RegExp(expression, 'gi')
    
    let emailBodyPath = getElementByXpath("/html/body/div[7]/div[3]/div/div[2]/div[1]/div[2]/div/div/div/div/div[2]/div/div[1]/div/div/div/table/tr/td[1]/div[2]/div[2]/div/div[3]/div/div/div/div/div/div[1]/div[2]/div[3]/div[3]/div")
    let emailSubjectPath = getElementByXpath("/html/body/div[7]/div[3]/div/div[2]/div[1]/div[2]/div/div/div/div/div[2]/div/div[1]/div/div/div/table/tr/td[1]/div[2]/div[1]")
    let emailSenderPath = getElementByXpath("/html/body/div[7]/div[3]/div/div[2]/div[1]/div[2]/div/div/div/div/div[2]/div/div[1]/div/div/div/table/tr/td[1]/div[2]/div[2]/div/div[3]/div/div/div/div/div/div[1]/div[2]/div[1]/table/tbody/tr[1]/td[1]/table/tbody/tr/td/h3")
    let bodyPath = getElementByXpath("/html/body")

    var emailBody = emailBodyPath.innerText
    var emailBodyUrl = emailBodyPath.getElementsByTagName("a")
    var emailSubjectHtml = emailSubjectPath.getElementsByTagName("h2")[0]
    var emailSenderHtml = emailSenderPath.getElementsByTagName("span")
    var emailAttachment = bodyPath.innerText
    var urls = []
    var emailSubject = emailSubjectPath.getElementsByTagName("h2")[0].textContent
    var isMultipart = []

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

    if (emailAttachment.includes('Attachments area') && emailAttachment.includes('Preview attachment') 
    || (emailAttachment.includes('lampiran'))) {
        isMultipart.push(1)
    } else {
        isMultipart.push(0)
    }

    let urlFeatureFromEmail = getUrlFeatures(urls, emailBodyUrl)
    let bodyFeature = getEmailBodyFeatures(emailBody)
    let subjectFeature = getEmailSubjectFeatures(emailSubject)
    let allFeaturesArr = [...bodyFeature, ...subjectFeature, ...urlFeatureFromEmail]

    sendResponse({allFeatures: allFeaturesArr})
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
    let susWord = ['account','your','update','notification','security','information','access','verify',
    'important','limited','measure','notice','bank','please','online','flag','email','spam','member',
    'possible','verification','message','confirm','question','urgent','address','required','card',
    'billing','credit']
    
    var count = 0
    var words = subjectInEmail.split(' ')
    var susWordsInBody = []
    
    for (let i = 0; i < words.length; i++) {
        for (let j = 0; j < susWord.length; j++) {
            if (words[i].toLowerCase().includes(susWord[j].toLowerCase())) {
                susWordsInBody.push(susWord[j])
            }
        }
    }

    var uniqueSusWordsInBody = [...new Set(susWordsInBody)]
    count = uniqueSusWordsInBody.length

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
        if (url.match(shorteningRegex) != null) {
            match = 1
        }
    });

    return match
}

function countUrlShortening(urlsInEmail) {
    var match = 0
    var count = 0

    urlsInEmail.forEach(url => {
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

function checkLongUrl(urlsInEmail) {
    urlsInEmail.forEach(url => {
        if (url.length > 127) {
            return 1
        }
    });

    return 0
}

function countLongUrl(urlsInEmail) {
    var count = 0

    urlsInEmail.forEach(url => {
        if (url.length > 127) {
            count += 1
        }
    });

    return count
}

function totalSusSubdomain(urlsInEmail) {
    var ct = 0
    var dotCt = 0
    
    urlsInEmail.forEach(function (item, index) {
        let domain = (new URL(item))
        let hostname = domain.hostname
        
        for (let i = 0; i < hostname.length; i++) {
            if (hostname[i] == '.') {
                dotCt += 1
            }
        }
        if (dotCt > 0) {
            ct += 1
        }
        
        dotCt = 0
    })

    return ct
}

function totalDash(urlsInEmail) {
    var ct = 0

    urlsInEmail.forEach(function (item) {
        if (item.includes("-")) {
            ct += 1
        }
    })

    return ct
}

function totalDoubleSlash(urlsInEmail) {
    ct = 0
    
    urlsInEmail.forEach(function (item) {
        url = item.replace(/^https?:\/\//, '')
        
        if (url.includes("//")) {
            ct += 1
        }
    })

    return ct    
}
// MARK: BODY FEATURES

function countCharacterInBody(emailBody) {
    return emailBody.length
}

function countWordInBody(emailBody) {
    return emailBody.split(' ').length
}

let susWord = ['update','access','records','security','online','bank','address','mail','log','help',
'protect','service','limited','assistance', 'password','user','here','id','message','customer',
'agreement','team','fraud','sent','item','using','member','verify','confirm','reply','send']

function countSusWordInBody(emailBody) {
    var count = 0
    var words = emailBody.split(' ')
    var susWordsInBody = []
    
    for (let i = 0; i < words.length; i++) {
        for (let j = 0; j < susWord.length; j++) {
            if (words[i].toLowerCase().includes(susWord[j].toLowerCase())) {
                susWordsInBody.push(susWord[j])
            }
        }
    }

    var uniqueSusWordsInBody = [...new Set(susWordsInBody)]
    count = uniqueSusWordsInBody.length

    return count
}

function countUniqueWord(msg) {
    var ct = 0
    var not_unique_word = []
    msg = msg.split(' ')
    
    for (m in msg) {
        if (!not_unique_word.includes(m)) {
            ct += 1
            not_unique_word.push(m)
        }
    }

    return ct
}

// TOTAL FEATURES = 19

function getUrlFeatures(urlsInEmail, tagAElements) {
    if (urlsInEmail == "") {
        var totalUrlInEmail = 0
        var susWordInUrl = 0
        var totalDomainInUrl = 0
        var totalUrlWithImg = 0
        var totalUrlWithPort = 0
        var isHttpInUrl = 0
        var totalHttpUrl = 0
        var isLongUrl = 0
        var totalLongUrl = 0
        var totalSusSubdomainInUrl = 0
        var totalDashInUrl = 0
        var totalDoubleSlashInUrl = 0
        var emailUrlFeaturesArr = new Array(susWordInUrl, totalDomainInUrl, totalUrlWithImg, totalUrlInEmail, totalUrlWithPort, isLongUrl, totalLongUrl, isHttpInUrl, totalHttpUrl, totalSusSubdomainInUrl, totalDashInUrl, totalDoubleSlashInUrl)
        return emailUrlFeaturesArr
    } else {
        var totalUrlInEmail = countUrlInEmail(urlsInEmail)
        var susWordInUrl = countSusWordInUrl(tagAElements)
        var totalDomainInUrl = countDomainInUrl(urlsInEmail)
        var totalUrlWithImg = countUrlWithImgLink(urlsInEmail)
        var totalUrlWithPort = countUrlWithPort(urlsInEmail)
        var isHttpInUrl = checkHttpInUrl(urlsInEmail)
        var totalHttpUrl = countUrlWithHttp(urlsInEmail)
        var isLongUrl = checkLongUrl(urlsInEmail)
        var totalLongUrl = countLongUrl(urlsInEmail)
        var totalSusSubdomainInUrl = totalSusSubdomain(urlsInEmail)
        var totalDashInUrl = totalDash(urlsInEmail)
        var totalDoubleSlashInUrl = totalDoubleSlash(urlsInEmail)
        var emailUrlFeaturesArr = new Array(susWordInUrl, totalDomainInUrl, totalUrlWithImg, totalUrlInEmail, totalUrlWithPort, isLongUrl, totalLongUrl, isHttpInUrl, totalHttpUrl, totalSusSubdomainInUrl, totalDashInUrl, totalDoubleSlashInUrl)
        return emailUrlFeaturesArr
    }
}

function getEmailSubjectFeatures(emailSubject) {
    if (emailSubject == "") {
        var totalSusWordInSubject = 0
        var totalCharacterInSubject = 0
        var totalWordsInSubject = 0
        var emailSubjectFeaturesArr = new Array(totalSusWordInSubject, totalWordsInSubject, totalCharacterInSubject)
        return emailSubjectFeaturesArr
    } else {
        var totalSusWordInSubject = countSusWordInSubject(emailSubject)
        var totalCharacterInSubject = countCharacterInSubject(emailSubject)
        var totalWordsInSubject = countWordsInSubject(emailSubject)
        var emailSubjectFeaturesArr = new Array(totalSusWordInSubject, totalWordsInSubject, totalCharacterInSubject)
        return emailSubjectFeaturesArr
    }
}

function getEmailBodyFeatures(emailBody) {
    if (emailBody == "") {
        var totalCharacterInBody = 0
        var totalWordsInBody = 0
        var totalSusWordInBody = 0
        var totalUniqueWordInBody = 0
        var emailBodyFeaturesArr = new Array(totalCharacterInBody, totalWordsInBody, totalSusWordInBody, totalUniqueWordInBody)
        return emailBodyFeaturesArr
    } else {
        var totalCharacterInBody = countCharacterInBody(emailBody)
        var totalWordsInBody = countWordInBody(emailBody)
        var totalSusWordInBody = countSusWordInBody(emailBody)
        var totalUniqueWordInBody = countUniqueWord(emailBody)
        var emailBodyFeaturesArr = new Array(totalCharacterInBody, totalWordsInBody, totalSusWordInBody, totalUniqueWordInBody)
        return emailBodyFeaturesArr
    }
}
