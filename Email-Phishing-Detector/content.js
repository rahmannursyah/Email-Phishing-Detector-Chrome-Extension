// alert("testing running")
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var expression = /(https?)?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    var expression2 = 'bear'
    const regex = new RegExp(expression, 'gi')
    // const matches = document.documentElement.innerHTML.match(regex)

    let emailBody = getElementByXpath("/html/body/div[7]/div[3]/div/div[2]/div[1]/div[2]/div/div/div/div/div[2]/div/div[1]/div")
    // let emailBody = getElementByXpath("/html/body/div[7]/div[3]/div/div[2]/div[1]/div[2]/div/div/div/div/div[2]/div/div[1]/div/div[2]/div/table/tr/td[1]/div[2]/div[2]/div/div[3]/div/div/div/div/div/div[1]/div[2]/div[3]/div[3]/div[1]")

    let matchesUrl = emailBody.innerHTML.match(regex)

    var htmlCollection = emailBody.getElementsByTagName("a")
    // htmlCollection = Array.from(htmlCollection)
    
    let totalUrl = matchesUrl.length
    var urlFromHref = ""

    console.log(htmlCollection)

    sendResponse({email: matchesUrl})
})

function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }
