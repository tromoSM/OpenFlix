window.addEventListener('DOMContentLoaded',function(){
    function sleep(dih){
        return new Promise(resolve=>setTimeout(resolve,dih))
    }
    fetch('sources/api.json').then(text=>text.json()).then(api=>{
        console.log(`using ${api.api.api.docs} [movie data]`)
        console.log(`endpoint => ${api.api.start_url} [movie data]`)
        document.querySelectorAll('section[fill]').forEach(fill=>{
           console.log(`fetching ${api.api.start_url}${api.api.structure.pages[fill.getAttribute('fill')]}`)
           fetch(`${api.api.start_url}${api.api.structure.pages[fill.getAttribute('fill')]}`).then(txt=>txt.json()).then(data=>{
            data.movies.forEach(movie=>{
              let contain=document.createElement('movie')
              let im=document.createElement('img')
              let title=document.createElement('p')
              title.innerText=movie.title
              im.src=String(api.api.structure.posters).replaceAll('{posterID}',movie[api.api.structure.response.posterID])

              contain.addEventListener('click',async function(){
                let tab=document.createElement('fullwindow')
                let backdrop=document.createElement('img')
                backdrop.setAttribute('backdrop','')
                backdrop.src=String(api.api.structure.backdrops).replaceAll('{backdropID}',movie[api.api.structure.response.backdropID])
                let back=document.createElement('button')
                back.setAttribute('back','')
                
                back.addEventListener('click',async function(){
                    tab.setAttribute('closing','')
                    await sleep(200)
                    tab.remove()
                })

                tab.append(backdrop,back)
                tab.setAttribute('closing','')
                document.body.append(tab)
                await sleep(300)
                tab.removeAttribute('closing')
              })
            
              contain.append(im,title)
              fill.append(contain)
              
            })
           })
        })
    })
})