async function getBlog(){
    fetch('../sources/blog.json').then(raw=>raw.json()).then(blgsource=>{
        fetch(blgsource.url).then(blraw=>blraw.json()).then(blog=>{
            console.log(blog)
            blog.blog.forEach(eachblog=>{
                if(document.querySelector('[bio=blog]')){
                    document.querySelector('[bio=blog]').remove()
                }
                let output=eachblog.text
                // Source - https://stackoverflow.com/a/10530468
                // Posted by Community Driven Business, modified by community. See post 'Timeline' for change history
                // Retrieved 2026-10-30, License - CC BY-SA 3.0
                const mlinks=[...output.matchAll(/\[(.*?)\]/g)]
                mlinks.forEach(links=>{
                    const [text,link]=links[1].split('||')
                    output=output.replace(links[0],`<a href="${link}">${text}</a>`)
                })
                const mbold=[...output.matchAll(/\*\*(.*?)\*\*/g)]
                mbold.forEach(bolds=>{
                    output=output.replace(bolds[0],`<strong>${bolds[1]}</strong>`)
                })
                output=output.replaceAll('{break}','<br>')
                output=output.replaceAll('{q}','"')
                //
                const blogobj=document.createElement('blog')
                const title=document.createElement('h2')
                title.innerText=eachblog.title
                const body=document.createElement('p')
                body.setAttribute('blogbody','')
                body.innerHTML=output
                const author=document.createElement('p')
                author.setAttribute('author','blog')
                author.innerHTML=`<i class="bi bi-person-circle"></i> ${eachblog.author}`
                const date=document.createElement('p')
                date.setAttribute('blog','date')
                date.innerText=eachblog.date
                blogobj.append(title,body,author,date)
                document.querySelector('blogs').append(blogobj)
            })
        })
    })
}
getBlog()