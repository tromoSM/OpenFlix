window.addEventListener('DOMContentLoaded',async function(){
    function sleep(dih){
        return new Promise(resolve=>setTimeout(resolve,dih))
    }
    let autopage=new URLSearchParams(window.location.search).get('page/')
    let linkid=new URLSearchParams(window.location.search).get('id/')
    let autopage_type
    if(autopage){
        if(autopage.slice(0,1).toLowerCase()=='s'){
            autopage_type='tv'
        }
        else{
            autopage_type='movies'
        }
        console.log(`opening page:\n   type: ${autopage_type}\n   imdb: tt${autopage.slice(1)}`)
    }
    let config
    let searchapi
    fetch('sources/config.json').then(text=>text.json()).then(configins=>{
        config=configins
    })
    fetch('sources/searchapi.json').then(text=>text.json()).then(search=>{
        if(search!='enter_apikey_here'){
            console.error('SearchApi key is not found. Go to sources/searchapi.json and enter your api there')
        }
        else{
            searchapi=search.api_key
        }
    })
    const oldtitle=document.querySelector('title').innerHTML
      async function openpage(movie,api,keyword,datatype='auto',data='',trueback=false){
                document.querySelector('title').innerHTML=`${movie.title} - OpenFlix`
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
                if(!trueback){
                    back.addEventListener('click',async function(){
                        tab.setAttribute('closing','')
                        document.querySelector('title').innerHTML=oldtitle
                        await sleep(200)
                        tab.remove()
                    })
                }
                else{
                    back.addEventListener('click',function(){
                        window.history.back()
                    })
                }
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
                trailer.addEventListener('click',async function(){
                    let trailerwindow=document.createElement('iframewindow')
                    trailerwindow.innerHTML=`
<iframe src="https://www.youtube.com/embed/${movie[keyword.trailer]}" title="${movie.title} trailer" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
                    let trailerclose=document.createElement('button')
                    trailerclose.setAttribute('back','')
                    trailerclose.addEventListener('click',async function(){
                        trailerwindow.setAttribute('closing','')
                        await sleep(300)
                        trailerwindow.remove()
                    })
                    trailerwindow.append(trailerclose)
                    trailerwindow.setAttribute('closing','')
                    document.body.append(trailerwindow)
                    await sleep(300)
                    trailerwindow.removeAttribute('closing')

                })
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
                function addtosimilar(similar){
                        if(similar.title!=movie.title){
                            let similarcard=document.createElement('simlarcard')
                            let cardim=document.createElement('img')
                            cardim.src=String(api.api.structure.landscape_poster).replaceAll('{posterID}',similar[keyword.posterID])

                            similarcard.addEventListener('click',async function(){
                                document.querySelector(`[openflixid="${parseInt(similar.ids.tmdb)+67}"]`).click() //addurltots
                                tab.setAttribute('closing','')
                                await sleep(300)
                                tab.remove()
                            })
                            let simtitle=document.createElement('p')
                            simtitle.innerText=similar.title

                            similarcard.append(cardim,simtitle)
                            return similarcard
                            
                        }
                }
                if(datatype=='auto'){
                if(String(movie.title).includes(':')){
                    const withtitle=data.movies.filter(mov=>{
                       return String(mov.title).toLowerCase().includes(movie.title.toLowerCase().split(':',1)[0])
                    })
                    let similarwrap=document.createElement('similar')
                    let sub=document.createElement('h3')
                    sub.innerText=`Similar to ${movie.title}`
                    
                    withtitle.forEach(similar=>{
                            let similarcard=addtosimilar(similar)
                            if(similarcard){
                             similarwrap.append(similarcard)
                            }
                            more.append(sub,similarwrap)
                    })
                }

                //genreshi    
                const simgenre=data.movies.filter(mov=>{
                      return mov[keyword.genre_list].some(genre=>{
                       return movie[keyword.genre_list].includes(genre)
                       })
                })
                let similarwrap=document.createElement('similar')
                let sub=document.createElement('h3')
                sub.innerText=`Similar by genre`
                simgenre.forEach(similar=>{
                    let similarcard=addtosimilar(similar)
                    if(similarcard){
                      similarwrap.append(similarcard)
                    }
                    more.append(sub,similarwrap)
                })
                }
                else{
                    let similarwrap=document.createElement('similar')
                    let sub=document.createElement('h3')
                    sub.innerText=`Similar to ${movie.title}`
                    console.log(data)
                    data.forEach(similar=>{
                            let similarcard=addtosimilar(similar)
                            if(similarcard){
                             similarwrap.append(similarcard)
                            }
                            more.append(sub,similarwrap)
                    })
                }
                controlbar.append(watch,trailer)
                tab.setAttribute('info','')
                tab.append(backdrop,back)
                main.append(title,infobar,plot,controlbar)
                tab.setAttribute('closing','')
                tab.append(main,more)
                document.body.append(tab)
                if(datatype=='auto'){
                await sleep(300)
                }
                tab.removeAttribute('closing')
              }

    fetch('sources/api.json').then(text=>text.json()).then(api=>{
        let keyword=api.api.structure.response
        console.log(`using ${api.api.api.docs} [movie data]`)
        console.log(`endpoint => ${api.api.start_url} [movie data]`)
        //bylink
        if(autopage){
            fetch(`${api.api.translator.replace('{type}',autopage_type).replace('{imdb}',"tt"+autopage.slice(1)).replace('{clientid}',api.api.other_apis.id_translator.clientid)}&app-name=OpenFlix&app-version=1.0&shareid=${linkid}`).then(text=>text.json()).then(res=>{
               if(res.title){
                        openpage(res,api,keyword,'other',res[api.api.structure.response.translator.similar],true)
               }
            })
        }
        else{
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
            
            //
              contain.append(im,title)
              fill.append(contain)
              contain.addEventListener('click',()=>{
                openpage(movie,api,keyword,'auto',data)
              })
              
            })
           })
        })
    }
    })
})
