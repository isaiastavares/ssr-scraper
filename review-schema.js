let schemaTemplate = `
{
    "@context": "http://schema.org",
    "@type": "WebApplication",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Windows, OS X, Linux",
    "review": {
        "@type": "Review",
        "sourceOrganization": {
            "@type": "Organization",
            "address": {
                "@type": "PostalAddress",
                "name": "SelectSoftware Reviews Address",
                "addressCountry": "http://www.wikidata.org/wiki/Q30",
                "addressLocality": "Cambridge",
                "addressRegion": "Massachusetts",
                "postalCode": "02139",
                "streetAddress": "196 Broadway, Suite 200",
                "@id": "https://www.selectsoftwarereviews.com/#PostalAddress"
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
        },
        "author": {
            "@type": "Person"
        },
        "inLanguage": "en-US"
    }
}
`;

let schema = JSON.parse(schemaTemplate)
schema['name'] = document.querySelector('.ss-review-embed-title > h3').innerHTML
schema['description'] = document.querySelector('.ssr-richtext > p').innerHTML
let image = document.querySelector('.ss-reviews-top-logo > img').src
if (image) { schema['image'] = image }
let shouldSkip = false;
document.querySelectorAll('.ss-cta-p-link').forEach(cta => {
    if (shouldSkip) {
        return;
    }
    if (cta.innerText.includes('website')) {
        shouldSkip = true;   
        schema['url'] = cta.href
    }
})

let review = schema.review
let mainReview = document.querySelector('#main-review').nextElementSibling.nextElementSibling
let reviewBody = ''
mainReview.querySelectorAll('.ssr-richtext > p').forEach(review => {
    reviewBody = reviewBody.concat(review.innerText)
})
review['reviewBody'] = reviewBody
review['datePublished'] = document.querySelector('.ss-review-aithor-date').innerHTML

let author = review.author
author['name'] = document.querySelector('.ss-buyer-author-name').innerHTML
author['description'] = document.querySelector('.ss-review-aithor-postion').innerHTML
let authorUrl = document.querySelector('.buyer-guide > a')
if (authorUrl) { author['url'] = authorUrl.href }

let offer = schema.offers
let pricingUrl = document.querySelector('.ss-review-pricing-button-holder > a')
if (pricingUrl && pricingUrl.hostname != location.hostname) {
    let offer = {}
    offer['@type'] = 'Offer'
    offer['url'] = pricingUrl.href
    schema2['offers'] = offer
}

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
    review.positiveNotes = positiveNotes
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
    review.negativeNotes = negativeNotes
}

if (schema) {
    let script = document.createElement("script");
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);
}
