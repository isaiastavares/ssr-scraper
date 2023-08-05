let organizationTemplate = `
{
    "@type": "Organization",
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
    "description": "SelectSoftware is dedicated to helping HR and recruiting teams find and buy the best software through in depth, expert research.",
    "name": "SelectSoftware Reviews",
    "telephone": "+13194812578",
    "url": "https://www.selectsoftwarereviews.com/",
    "knowsLanguage": "http://www.wikidata.org/wiki/Q1860",
    "areaServed": "http://www.wikidata.org/entity/Q13780930",
    "image": "https://uploads-ssl.webflow.com/5dbc34a79684004f6e7a6c30/624c120442f0bbf51c16f142_ssr-hat-optimized.jpg",
    "@id": "https://www.selectsoftwarereviews.com/"
}
`;

let breadcrumbTemplate = `
{
    "@type": "BreadcrumbList",
    "@context": "http://schema.org",
    "itemListElement": []
}
`;

let articleTemplate = `
{
    "@type": "Article",
    "@context": "http://schema.org",
    "headline": "REPLACE",
    "url": "REPLACE",
    "dateModified": "REPLACE",
    "author": [
      {
        "@type": "Person",
        "name": "REPLACE",
        "description": "REPLACE",
        "url": "REPLACE",
        "image": "REPLACE"
      }
    ],
    "contributor": [],
    "description": "REPLACE",
    "publisher": {
      "@type": "Organization",
      "name": "SelectSoftware Reviews",
      "url": "https://www.selectsoftwarereviews.com/"
    }
}
`;

let itemListTemplate = `
{
    "@type": "ItemList",
    "@context": "http://schema.org",
    "description": "REPLACE",
    "url": "REPLACE",
    "numberOfItems": 0,
    "itemListElement": []
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
let breadcrumb = JSON.parse(breadcrumbTemplate)
let article = JSON.parse(articleTemplate)
let itemList = JSON.parse(itemListTemplate)
let faq = JSON.parse(faqTemplate)

//breadcrumb
const breadcrumbItems = document.querySelectorAll('.ss-hero-breadrubms a');
const lastBreadcrumb = document.querySelector('.ss-hero-breadrubms div.text-color-white');
const breadcrumbItemList = [];

breadcrumbItems.forEach((elem, index) => {
    const position = index + 1;
    const name = elem.textContent;
    const item = elem.href;
    
    breadcrumbItemList.push({
        "@type": "ListItem",
        "position": position,
        "name": name,
        "item": item
    });
})

if (lastBreadcrumb) {
    const position = breadcrumbItems.length + 1;
    const name = lastBreadcrumb.textContent;
    const item = document.querySelector("[rel='canonical']").href
    
    breadcrumbItemList.push({
        "@type": "ListItem",
        "position": position,
        "name": name,
        "item": item
    });
}
breadcrumb['itemListElement'] = breadcrumbItemList

// article object
let pageUrl = document.querySelector("[rel='canonical']").href
let pageTitle = document.querySelector('meta[property~="og:title"]')?.content
let pageDescription = document.querySelector('meta[property~="og:description"]')?.content;
let date = document.querySelector('.ssr-buyers-hero-into-text.w-embed').innerText
let dateFormat = new Date(date).toISOString();

article['headline'] = pageTitle
article['url'] = pageUrl
article['dateModified'] = dateFormat
article['description'] = pageDescription

//author
document.querySelectorAll('.ssr-buyer-author').forEach(authorDiv => {
    let authorRightDiv = authorDiv.querySelector('.ssr-buyer-author-right').firstChild
    let authorName = authorRightDiv.nextElementSibling
    let authorDescription = authorName.nextElementSibling

    let author = article.author[0]
    author['name'] = authorName.innerHTML
    author['description'] = authorDescription.innerHTML
    author['url'] = authorDiv.href
    author['image'] = authorDiv.querySelector('.ssr-buyer-author-photo > img').src
})

//contributor
let contributors = []
document.querySelectorAll('.ssr-experts-list-item').forEach(contributing => {
    let contributor = {}
    contributor['@type'] = 'Person'
    contributor['name'] = contributing.querySelector('.ssr-experts-list-item-name').innerHTML
    contributor['url'] = contributing.href
    contributor['image'] = contributing.querySelector('.ssr-buyer-author-photo > img').src
    contributors.push(contributor)
})

if (contributors.length) {
    article['contributor'] = contributors
} else {
    delete article.contributor
}

// item list object
itemList['description'] = document.querySelector('.heading-h3.buyers-guide-heading.text-align-left').innerHTML
itemList['url'] = pageUrl

let numberOfItems = 0
let items = []
document.querySelectorAll('.ssr-bg-topdetails-content').forEach(vendor => {
    numberOfItems++;

    let itemList = {}
    let item = {}

    let vendorImage = vendor.querySelector('.ssr-toplist-tem-vendor-logo > img').src
    let vendorName = vendor.querySelector('.ssr-toplist-tem-vendor-name').innerHTML
    let vendorUrl = vendor.querySelector('.ssr-bg-topdetails-content > a').href

    itemList['@context'] = 'http://schema.org'
    itemList['@type'] = 'ListItem'
    itemList['position'] = numberOfItems
    itemList['image'] = vendorImage
	itemList['name'] = vendorName
	
    item['@context'] = 'http://schema.org'
    item['@type'] = 'SoftwareApplication'
    item['name'] = vendorName
    item['applicationCategory'] = 'BusinessApplication'
    item['operatingSystem'] = 'Windows, macOS, Android, iOS, and Linux'
    item['url'] = vendorUrl

    itemList['item'] = item

	items.push(itemList)
})

itemList['numberOfItems'] = numberOfItems
itemList['itemListElement'] = items

// faq
let mainEntity = []
document.querySelectorAll('.heading-h3.buyers-guide-heading').forEach(buyersGuideHeading => {
    if (buyersGuideHeading.innerText.includes('FAQ')) {
        let faqs = [];
        elemFaq = buyersGuideHeading.nextElementSibling.firstChild
        // loop through next siblings until `null`
        do
            // push sibling to array
            faqs.push(elemFaq);
        while (elemFaq = elemFaq.nextElementSibling)

        for(let i = 0; i < faqs.length; i++) {
            let faqElem = faqs[i]
            if (faqElem.nodeName === 'H3') {
                let faq = {}
                faq['@type'] = 'Question'
                faq['name'] = faqElem.innerText

                let acceptedAnswer = {}
                acceptedAnswer['@type'] = 'Answer'
                let nextElem = faqElem.nextElementSibling
                let text = ''
                while (nextElem != null && nextElem.nodeName !== 'H3') {
                    text += nextElem.innerText + " "
                    nextElem = nextElem.nextElementSibling
                }
                acceptedAnswer['text'] = text

                faq['acceptedAnswer'] = acceptedAnswer
                mainEntity.push(faq)
            } else {
                continue;
            }
        }
    }   
})
faq['mainEntity'] = mainEntity

//create schema
let schema = {};
schema['@context'] = "http://schema.org"
let graph = [organization, breadcrumb, article, itemList];

if (faq.mainEntity.length) {
    graph.push(faq)
}

schema['@graph'] = graph

console.log(JSON.stringify(schema));

// create script
let script = document.createElement("script");
script.type = "application/ld+json";
script.innerHTML = JSON.stringify(schema);
document.head.appendChild(script);