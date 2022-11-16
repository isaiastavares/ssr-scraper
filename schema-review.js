let organizationTemplate = `
{
    "@type": "Organization",
    "name": "SelectSoftware Reviews",
    "address": {
        "@type": "PostalAddress",
        "name": "SelectSoftware Reviews Address",
        "addressCountry": "http://www.wikidata.org/wiki/Q30",
        "addressLocality": "Cambridge",
        "addressRegion": "Massachusetts",
        "postalCode": "02139",
        "streetAddress": "196 Broadway, Suite 200"
    },
    "sameAs": [
        "https://twitter.com/bestb2bsoftware",
        "https://www.facebook.com/selectsoftwarereviews/",
        "https://www.linkedin.com/company/select-software-reviews",
        "https://www.youtube.com/channel/UC33dCPVWVucOoDuJ3HSNePg"
    ],
    "logo": "https://uploads-ssl.webflow.com/5dbc34a79684004f6e7a6c30/60a579c867fb7827b08da6ea_SelectSoftware%20Reviews%20Logo.png",
    "telephone": "+13194812578",
    "url": "https://www.selectsoftwarereviews.com/",
    "knowsLanguage": "http://www.wikidata.org/wiki/Q1860",
    "areaServed": "http://www.wikidata.org/entity/Q13780930",
    "@id": "https://www.selectsoftwarereviews.com/#organization"
}
`;

let imageObjectTemplate = `
{
    "@type": "ImageObject",
    "inLanguage": "en-US"
}
`;

let webPageTemplate = `
{
    "@type": "WebPage",
    "primaryImageOfPage": {},
    "url": "REPLACE",
    "name": "REPLACE",
    "dateModified": "REPLACE",
    "description": "REPLACE",
    "inLanguage": "en-US",
    "potentialAction": {
        "@type": "ReadAction"
    },
    "reviewedBy": {
        "@type": "Person",
        "name": "REPLACE",
        "image": {
            "@type": "ImageObject",
            "inLanguage": "en-US",
            "url": "REPLACE"
        },
        "description": "REPLACE"
    }
}
`;

let reviewTemplate = `
{
    "@type": "Review",
    "itemReviewed": {
        "@type": "SoftwareApplication",
        "name": "REPLACE",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Windows, macOS, Android, iOS, and Linux",
        "image": "REPLACE"
    },
    "name": "REPLACE",
    "publisher": {
        "@id": "https://www.selectsoftwarereviews.com/#organization"
    },
    "author": {
        "@id": "https://www.selectsoftwarereviews.com/#person"
    },
    "reviewBody": "REPLACE",
    "mainEntityOfPage": "REPLACE",
    "datePublished": "REPLACE",
    "url": "REPLACE",
    "isPartOf": {}
}
`;

let personTemplate = `
{
    "@type": "Person",
    "name": "REPLACE",
    "image": {
        "@type": "ImageObject",
        "inLanguage": "en-US"
    },
    "description": "REPLACE",
    "@id": "https://www.selectsoftwarereviews.com/#person"
}
`;

let faqTemplate = `
{
    "@type": "FAQPage",
    "@context": "https://schema.org",
    "mainEntity": []
}
`;

let organization = JSON.parse(organizationTemplate)
let imageObject = JSON.parse(imageObjectTemplate)
let webPage = JSON.parse(webPageTemplate)
let review = JSON.parse(reviewTemplate)
let person = JSON.parse(personTemplate)
let faq = JSON.parse(faqTemplate)

// image object
let imageUrl = document.querySelector('.ss-reviews-mainphoto > img').src
let pageUrl = document.querySelector("[rel='canonical']").href
let primaryImageId = pageUrl  + '/#primaryimage'

imageObject['url'] = imageUrl
imageObject['@id'] = primaryImageId

// web page
let primaryImageOfPage = webPage.primaryImageOfPage
primaryImageOfPage['@id'] = primaryImageId

let pageTitle = document.querySelector('meta[property~="og:title"]')?.content;
let date = document.querySelector('.ss-review-aithor-date').innerHTML
let dateFormat = new Date(date).toISOString();
let pageDescription = document.querySelector('meta[property~="og:description"]')?.content;

webPage['url'] = pageUrl
webPage['name'] = pageTitle
webPage['dateModified'] = dateFormat
webPage['description'] = pageDescription

let potentialAction = webPage.potentialAction
let target = {}
target['@type'] = 'EntryPoint'
target['url'] = pageUrl
potentialAction['target'] = [target]

let reviewedBy = webPage.reviewedBy
let authorName = document.querySelector('.ss-buyer-author-name').innerHTML
let authorDescription = document.querySelector('.ss-review-aithor-postion').innerHTML

reviewedBy['name'] = authorName
reviewedBy['description'] = authorDescription
let authorImage = reviewedBy.image
let authorImageUrl = document.querySelector('.ss-buyer-author-photo > img').src
authorImage['url'] =  authorImageUrl

webPage['@id'] = pageUrl + '#webpage'

// review
let reviewBody= '';
let reviews = document.querySelectorAll("[class='ss-reviews-fieldblock']")
for(let i = 0; i < reviews.length; i++) {
    let review = reviews[i]
    let nextSibling = review.firstChild.nextSibling
    if (nextSibling?.className === 'ss-reviews-fieldblock') {
        review = nextSibling
        continue;
    }

    let nextDiv = review.firstChild
    if (nextDiv.id === 'alternatives') {
        break;
    }

    reviewBody = reviewBody.concat(review.innerText).concat('\n\n')
}

review['name'] = pageTitle
review['reviewBody'] = reviewBody
review['mainEntityOfPage'] = pageUrl
review['datePublished'] = dateFormat
review['url'] = pageUrl

let itemReviewed = review.itemReviewed
let vendorName = document.querySelector('.ss-review-embed-title > h3').innerHTML
let vendorImage = document.querySelector('.ss-review-screenshot').src

itemReviewed['name'] = vendorName.split(' ').shift();
itemReviewed['image'] = vendorImage

let isPartOf = review.isPartOf
isPartOf['@id'] = pageUrl + '#webpage'

let positiveNotes = {}
positiveNotes['@type'] = 'ItemList'
let pros = []
let prosPosition = 1
document.querySelectorAll('[class="ss-richtext-pros w-richtext"] > ul > li').forEach(pro => {
    let item = {}
    item['@type'] = 'ListItem'
    item['position'] = prosPosition
    item['name'] = pro.innerHTML.replace('&nbsp;', '')
    pros.push(item)
    prosPosition++
})
if (pros.length) {
    positiveNotes['itemListElement'] = pros
    review['positiveNotes'] = positiveNotes
}

let negativeNotes = {}
negativeNotes['@type'] = 'ItemList'
let cons = []
let consPosition = 1
document.querySelectorAll('[class="ss-richtext-cons w-richtext"] ul > li').forEach(con => {
    let item = {}
    item['@type'] = 'ListItem'
    item['position'] = consPosition
    item['name'] = con.innerHTML.replace('&nbsp;', '')
    cons.push(item)
    consPosition++
})
if (cons.length) {
    negativeNotes['itemListElement'] = cons
    review['negativeNotes'] = negativeNotes
}

// person
person['name'] = authorName
person['description'] = authorDescription

personImage = person.image
personImage['url'] = authorImageUrl
personImage['caption'] = authorName

// faq
let mainEntity = []
document.querySelectorAll('[class="ss-review-embed-title w-embed"]').forEach(elem => {
    let title = elem.firstChild
    if (title.innerHTML === 'FAQs') {
        let faqs = [];
        elemFaq = elem.nextElementSibling.firstChild
        // loop through next siblings until `null`
        do
            // push sibling to array
            faqs.push(elemFaq);
        while (elemFaq = elemFaq.nextElementSibling)

        for(let i = 0; i < faqs.length; i++) {
            if (faqs[i].nodeName === 'P') {
                continue;
            }

            if (faqs[i].nodeName === 'H3') {
                let faq = {}
                faq['@type'] = 'Question'
                faq['name'] = faqs[i].firstChild.innerHTML.replace('&nbsp;', '')

                let acceptedAnswer = {}
                acceptedAnswer['@type'] = 'Answer'
                let nextElem = faqs[i].nextElementSibling
                acceptedAnswer['text'] = nextElem.innerHTML.replace('&nbsp;', '')
                faq['acceptedAnswer'] = acceptedAnswer
                mainEntity.push(faq)
            }
        }
    }
})
faq['mainEntity'] = mainEntity

//create schema
let schema = {};
schema['@context'] = "http://schema.org"
let graph = [organization, imageObject, webPage, review, person];

if (faq.mainEntity.length) {
    graph.push(faq)
}

schema['@graph'] = graph

console.log(schema);
console.log(JSON.stringify(schema));

// create script
let script = document.createElement("script");
script.type = "application/ld+json";
script.innerHTML = JSON.stringify(schema);
document.head.appendChild(script);
