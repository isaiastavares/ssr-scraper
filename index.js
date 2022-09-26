const puppeteer = require('puppeteer');

scrape()

async function scrape() {
	
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    let pages = [
        'https://www.selectsoftwarereviews.com/buyer-guide/hr-software'
    ]

    for await (const url of pages) {
        await page.goto(url)
        
        const reviews = await page.evaluate(() => {
            let reviews = []
            
            const vendors = document.querySelectorAll('.feature-v2')
            let id = 1
            vendors.forEach(vendor => {
                let review = {}
                review['id'] = id
                review['title'] = vendor.querySelector('.service-heading-second').innerHTML
                review['reviewBody'] = vendor.querySelector('.rich-text-block-9 > p').innerHTML
                let pros = []
                vendor.querySelectorAll('.ss-richtext-pros > ul > li').forEach(pro => {
                    pros.push(pro.innerHTML.replace('&nbsp;', ''))
                })
                review['positiveNotes'] = pros
                let cons = []
                vendor.querySelectorAll('.ss-richtext-cons > ul > li').forEach(pro => {
                    cons.push(pro.innerHTML.replace('&nbsp;', ''))
                })
                review['negativeNotes'] = cons
                reviews.push(review)
                id++
            })
            
            return reviews
        })

        console.log(reviews);
    }
    
    await browser.close();
}