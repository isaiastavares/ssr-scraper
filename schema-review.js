
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
    "reviewRating": {
        "@type": "Rating",
        "worstRating": 0,  
        "bestRating": 5,
        "ratingValue": 0
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
let imageUrl = document.querySelector('.vendor-introduction img')
let pageUrl = document.querySelector("[rel='canonical']").href
let primaryImageId = pageUrl  + '/#primaryimage'

imageObject['url'] = imageUrl ? imageUrl.src : null;
imageObject['@id'] = primaryImageId

// web page
let primaryImageOfPage = webPage.primaryImageOfPage
primaryImageOfPage['@id'] = primaryImageId

let pageTitle = document.querySelector('meta[property~="og:title"]')?.content;
let dateElement = document.querySelector('.autho-info__content .text-size-regular:last-child');
let dateFormat = dateElement ? new Date(dateElement.textContent).toISOString() : null;
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
let authorName = document.querySelector('.autho-info__content .heading-style-h5')
let authorDescription = document.querySelector('.autho-info__content .text-size-regular:nth-last-child(2)');

reviewedBy['name'] = authorName ? authorName.textContent : null;
reviewedBy['description'] = authorDescription ? authorDescription.textContent : null;
let authorImage = reviewedBy.image
let authorImageUrl = document.querySelector('.author-info__img')
authorImage['url'] =  authorImageUrl ? authorImageUrl.src : null;

webPage['@id'] = pageUrl + '#webpage'

// review
let vendorReviewElement = document.querySelector('.vendor-review');
let reviewBodyElement = vendorReviewElement.querySelector('.rich-text-style.w-richtext');
let paragraphs = reviewBodyElement ? reviewBodyElement.querySelectorAll('p') : [];

let reviewBody = '';
paragraphs.forEach(paragraph => {
    reviewBody += paragraph.textContent.trim().concat('\n\n');
});

review['name'] = pageTitle
review['reviewBody'] = reviewBody
review['mainEntityOfPage'] = pageUrl
review['datePublished'] = dateFormat
review['url'] = pageUrl

let itemReviewed = review.itemReviewed
let vendorName = document.querySelector('.app-info > h1')
let vendorImage = document.querySelector('.vendor-screenshot')

itemReviewed['name'] = vendorName ? vendorName.textContent : null;
itemReviewed['image'] = vendorImage ? vendorImage.src : null;

let reviewRating = review.reviewRating
let starsFillElement = document.querySelector('.stars__fill.is--vendor-fill');
reviewRating['ratingValue'] = starsFillElement ? starsFillElement.style.getPropertyValue('--rating') : null;

let isPartOf = review.isPartOf
isPartOf['@id'] = pageUrl + '#webpage'

let positiveNotes = {}
let prosPosition = 1
positiveNotes['@type'] = 'ItemList'

let prosList = document.querySelector('.vendor-pros ul');
let prosItems = prosList ? prosList.querySelectorAll('li') : [];

let pros = Array.from(prosItems).map(pro => {
    let item = {}
    item['@type'] = 'ListItem'
    item['position'] = prosPosition
    item['name'] = pro.textContent.trim()
    prosPosition++
    return item;
});

if (pros.length) {
    positiveNotes['itemListElement'] = pros
    review['positiveNotes'] = positiveNotes
}

let negativeNotes = {}
let consPosition = 1
negativeNotes['@type'] = 'ItemList'

let consList = document.querySelector('.vendor-cons ul');
let consItems = consList ? consList.querySelectorAll('li') : [];

let cons = Array.from(consItems).map(con => {
    let item = {}
    item['@type'] = 'ListItem'
    item['position'] = consPosition
    item['name'] = con.textContent.trim()
    consPosition++
    return item;
});

if (cons.length) {
    negativeNotes['itemListElement'] = cons
    review['negativeNotes'] = negativeNotes
}

// person
person['name'] = reviewedBy.name
person['description'] = reviewedBy.description

personImage = person.image
personImage['url'] = authorImage.url
personImage['caption'] = reviewedBy.name

// faq
let mainEntity = []

let faqElement = document.querySelector('.vendor-faq');
let faqContainer = faqElement.querySelector('.rich-text-style.w-richtext');
let questionElements = faqContainer ? faqContainer.querySelectorAll('h3') : [];

questionElements.forEach(questionElement => {
    let questionText = questionElement.textContent.trim();
    let answerText = questionElement.nextElementSibling.textContent.trim();

    let faqItem = {
        "@type": "Question",
        "name": questionText,
        "acceptedAnswer": {
            "@type": "Answer",
            "text": answerText
        }
    };

    mainEntity.push(faqItem);
});

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
