window.addEventListener('DOMContentLoaded',function(){
    function sleep(dih){
        return new Promise(resolve=>setTimeout(resolve,dih))
    }
    let config
    fetch('sources/config.json').then(text=>text.json()).then(configins=>{
        config=configins
    })
    const proj_openflix_fanart='0eec0af899ff2d6b1dc0d78986566052'
    fetch('sources/api.json').then(text=>text.json()).then(api=>{
        let keyword=api.api.structure.response
        console.log(`using ${api.api.api.docs} [movie data]`)
        console.log(`endpoint => ${api.api.start_url} [movie data]`)
        document.querySelectorAll('section[fill]').forEach(fill=>{
           console.log(`fetching ${api.api.start_url}${api.api.structure.pages[fill.getAttribute('fill')]}`)
           fetch(`${api.api.start_url}${api.api.structure.pages[fill.getAttribute('fill')]}`).then(txt=>txt.json()).then(data=>{
            data.movies.forEach(movie=>{
              let contain=document.createElement('movie')
              contain.setAttribute('openflixid',parseInt(movie.ids.tmdb)+67)
              let im=document.createElement('img')
              let title=document.createElement('p')
              title.innerText=movie.title
              im.src=String(api.api.structure.posters).replaceAll('{posterID}',movie[keyword.posterID])
                
              //movieinfo tab
              contain.addEventListener('click',async function(){
                let tab=document.createElement('fullwindow')
                let main=document.createElement('section')
                let backdrop=document.createElement('img')
                backdrop.setAttribute('backdrop','')
                backdrop.src=String(api.api.structure.backdrops).replaceAll('{backdropID}',movie[keyword.backdropID])
                let back=document.createElement('button')
                back.setAttribute('back','')
                backdrop.addEventListener('load',function(){
                    backdrop.setAttribute('loaded','')
                })
                back.addEventListener('click',async function(){
                    tab.setAttribute('closing','')
                    await sleep(200)
                    tab.remove()
                })
                let title=document.createElement('h1')
                title.innerHTML=`
  <span hiddenB>${movie.title}</span>
  <svg aria-hidden="true"  head hiddenB>
    <clipPath id="blurmask">
      <text dominant-baseline="hanging" text-anchor="start" x="0" y="0em" dy="0.125em">${movie.title}</text>
    </clipPath>
  </svg>
                `
                let infobar=document.createElement('p')
                infobar.setAttribute('vibrant','')
                infobar.innerText=`${movie[keyword.genre_list][0]} ∙ ${movie[keyword.length]}`
                
                let plot=document.createElement('plot')
                plot.innerText=movie[keyword.plot]

                let controlbar=document.createElement('playcontrol')
                let watch=document.createElement('button')
                watch.setAttribute('main','')
                let trailer=document.createElement('button')
                trailer.setAttribute('side','')
                trailer.setAttribute('trailer','')
                trailer.innerText='watch trailer'
                
                //waittimecheck
                let release=new Date(movie[keyword.release_date])
                let now=new Date()
                let diff=Math.floor(Math.abs(now-release)/(1000*60*60*24))
                let statuscheck=false
                if(config.config.wait_after_status.value!==false){
                    if(movie[keyword.status]==config.config.wait_after_status.value){
                        statuscheck=true
                    }
                    else{
                        statuscheck=false
                    }
                }
                else{
                    statuscheck=true
                }
                if(config.config.waittime_after_release.value<diff && statuscheck){
                    watch.setAttribute('playable','')
                    watch.innerText='Watch'
                    watch.addEventListener('click',async function(){
                        console.log('watching')
                    })
                }
                else{
                    watch.setAttribute('notplayable','')
                    watch.innerText='Unavailable'
                }

                let more=document.createElement('section')
                //movieseries
                if(String(movie.title).includes(':')){
                    const withtitle=data.movies.filter(mov=>{
                       return String(mov.title).toLowerCase().includes(movie.title.toLowerCase().split(':',1)[0])
                    })
                    console.log(withtitle)
                    let similarwrap=document.createElement('similar')
                    withtitle.forEach(similar=>{
                        if(similar.title!=movie.title){
                            let similarcard=document.createElement('simlarcard')
                            let cardim=document.createElement('img')
                            cardim.src=String(api.api.structure.landscape_poster).replaceAll('{posterID}',similar[keyword.posterID])

                            similarcard.addEventListener('click',async function(){
                                document.querySelector(`[openflixid="${parseInt(similar.ids.tmdb)+67}"]`).click()
                                tab.setAttribute('closing','')
                                await sleep(300)
                                tab.remove()
                            })
                            let simtitle=document.createElement('p')
                            simtitle.innerText=similar.title

                            similarcard.append(cardim,simtitle)
                            similarwrap.append(similarcard)
                        }
                            more.append(similarwrap)
                    })
                }    
                else{
                    alert('no')
                }            
                controlbar.append(watch,trailer)
                tab.setAttribute('info','')
                tab.append(backdrop,back)
                main.append(title,infobar,plot,controlbar)
                tab.setAttribute('closing','')
                tab.append(main,more)
                document.body.append(tab)
                await sleep(300)
                tab.removeAttribute('closing')
    
              })
            //
              contain.append(im,title)
              fill.append(contain)
              
            })
           })
        })
    })
})
