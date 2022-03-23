// alert("testing running")
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var expression = /(https?)?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    const regex = new RegExp(expression, 'gi')
    
    let emailBodyPath = getElementByXpath("/html/body/div[7]/div[3]/div/div[2]/div[1]/div[2]/div/div/div/div/div[2]/div/div[1]/div/div/div/table/tr/td[1]/div[2]/div[2]/div/div[3]/div/div/div/div/div/div[1]/div[2]/div[3]/div[3]/div")
    let emailSubjectPath = getElementByXpath("/html/body/div[7]/div[3]/div/div[2]/div[1]/div[2]/div/div/div/div/div[2]/div/div[1]/div/div/div/table/tr/td[1]/div[2]/div[1]")
    let emailSenderPath = getElementByXpath("/html/body/div[7]/div[3]/div/div[2]/div[1]/div[2]/div/div/div/div/div[2]/div/div[1]/div/div/div/table/tr/td[1]/div[2]/div[2]/div/div[3]/div/div/div/div/div/div[1]/div[2]/div[1]/table/tbody/tr[1]/td[1]/table/tbody/tr/td/h3")

    var emailBodyUrl = emailBodyPath.getElementsByTagName("a")
    var emailSubjectHtml = emailSubjectPath.getElementsByTagName("h2")[0].textContent
    var emailSenderHtml = emailSenderPath.getElementsByTagName("span")
    var urls = ""
    var emailSender = ""

    for (let index = 0; index < emailBodyUrl.length; index++) {
        if (!emailBodyUrl[index].href.includes("mailto")) {
            urls += emailBodyUrl[index].href + "\n"
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

    sendResponse({subject: emailSubjectHtml, sender: emailSender, email: urls})
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
