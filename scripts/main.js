window.addEventListener('DOMContentLoaded',async function(){
    function sleep(dih){
        return new Promise(resolve=>setTimeout(resolve,dih))
    }
    //devmode
    let splashmaintain=false
    let debug=true
    let debugLevel='all' //all=anoyin shi
    let expectednRepeatederrorLog='no'
    let accinfotype='Local'
    let autopage=new URLSearchParams(window.location.search).get('page/')
    let linkid=new URLSearchParams(window.location.search).get('id/')
    let autopage_type
    let idstarter='tt'
    let idtype
    let currenttab
    if(!localStorage.getItem('joined')){
        let date=new Date()
        localStorage.setItem('joined',`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`)
        localStorage.setItem('account',accinfotype)
    }
    if(!localStorage.getItem('taste-profile')){
        localStorage.setItem('taste-profile',JSON.stringify({}))
    }
    if(!localStorage.getItem('user-interact')){
        localStorage.setItem('user-interact',JSON.stringify({}))
    }
    if(!localStorage.getItem('watchd')){
        localStorage.setItem('watchd',0)
    }
    if(!localStorage.getItem('searchhist')){
        localStorage.setItem('searchhist',JSON.stringify([]))
    }
    function tasteprofile(genre,add){
        let profile=JSON.parse(localStorage.getItem('taste-profile'))
        if(profile[genre]){
            profile[genre]=Number(profile[genre])+Number(add)
        }
        else{
            profile[genre]=Number(add)
        }
        localStorage.setItem('taste-profile',JSON.stringify(profile))
    }
    function addwatched(){
        let watched=Number(localStorage.getItem('watchd'))
        localStorage.setItem('watchd',watched+1)
    }
    function refreshtaste(refreshedby=''){
        let highest=0
        let genre
        let refreshms
        if(refreshedby!=''){
            refreshms="\n   Profile was requested by <"+refreshedby.toLowerCase()+">"
        }
        Object.entries(JSON.parse(localStorage.getItem('taste-profile'))).forEach(([key,value])=>{
            if(Number(value)>highest){
                highest=Number(value)
                genre=key
            }
        })
        if(genre&&highest!=0){
            localStorage.setItem('topGenre',genre)
            return [genre,highest]
        }
        else{
            console.log(`No stats to personalize recommendations. Recommending Action in feed.${refreshms}`)
            localStorage.setItem('topGenre','no genre')
            return ['action',0]
        }
    }

    if(autopage){
        if(autopage.includes('xid')){
            idstarter=''
            idtype='simkl'
        }
        else{
            idstarter='tt'
            idtype='imdb'
        }
        if(autopage.slice(0,1).toLowerCase()=='s'){
            autopage_type='tv'
        }
        else{
            autopage_type='movies'
        }
        console.log(`opening page:\n   type: ${autopage_type}\n   id type: ${idtype}\n   ${idtype}_id: ${idstarter}${autopage.slice(1)}`)
    }


    //slides
    let movieindex=0
    let slideRunning=true
    let currenSlideID=''
    //to read
    document.querySelector('newshi').addEventListener('mouseenter',async function(){
        slideRunning=false
        document.querySelector('newshi pos').setAttribute('stopped','')
        if(debug&&debugLevel=='all'){
            console.log('[experience] Slide rotation stopped because the user was interacting with a slide')
        }
        let paused=document.createElement('button')
        paused.setAttribute('perfrounded','')
        paused.innerHTML='<i class="bi bi-pause-fill"></i>'
        paused.setAttribute('hiddenA','')
        document.querySelector('newshi').append(paused)
        await sleep(200)
        paused?.removeAttribute('hiddenA')
    })
    document.querySelector('newshi').addEventListener('mouseleave',async function(){
        slideRunning=true
        document.querySelector('newshi pos')?.removeAttribute('stopped')
        if(debug&&debugLevel=='all'){
            console.log('[experience] Slide rotation resumed after the user stopped interacting with it.')
        }
        document.querySelector('newshi button[perfrounded]')?.setAttribute('hiddenA','')
        await sleep(200)
        document.querySelector('newshi button[perfrounded]')?.remove()
    })
    document.querySelector('newshi [parents]').addEventListener('click',function(){
            let a=document.createElement('a')
            a.target='_blank'
            console.log(`[page] Opening parents guide :\n   imdb : ${currenSlideID}\n   link : "https://www.imdb.com/title/${currenSlideID}/parentalguide/"`)
            a.href=`https://www.imdb.com/title/${currenSlideID}/parentalguide/?ref_=openflix_che`
            a.click()
            a.remove()
    })
    document.querySelector('newshi [watch]').addEventListener('click',function(){
        let fetchedEl=document.querySelector(`[openflixid_="${parseInt(currenSlideID.replaceAll('t',''))+67}"]`)
        if(fetchedEl){
            fetchedEl.click()
            console.log(`[page] Opening tab via tab (prefetch):\n   type : select by id\n   openflixid_ : ${parseInt(currenSlideID.replaceAll('t',''))+67}`)
        }
        else{
            if(debug){
                console.log(`[page] Opening tab via url (no prefetch):\n   type : m\n   openflixid_ : ${parseInt(currenSlideID.replaceAll('t',''))+67}`)
                window.href=`${window.location.origin}?page/=m${currenSlideID.replaceAll('t','')}`
            }
        }
    })
    //
    function refreshslide(){
        if(document.querySelectorAll('newshi scroll img').length==0){
            console.warn('[slides] Slides missing or still loading. Skipping refresh')
            return
        }
        let title=document.querySelector('[info="title"]')
        let rating=document.querySelector('[info="rating"]')
        if(debug&&debugLevel=='all'){
            console.log(`refreshing slide ${movieindex} -> ${movieindex+1}`)
        }
        let scrollcont=document.querySelector('newshi scroll')
        let movie=document.querySelectorAll('newshi scroll img')[movieindex]
        function updateposition(){
            document.querySelectorAll('newshi pos poscircle').forEach((pos,index)=>{
                if(index==movieindex-1){
                    pos.setAttribute('now','')            
                }
                else{
                    pos?.removeAttribute('now')
                }
            })
        }
        if(movieindex==0){
                movieindex=1
                let first=true
                document.querySelectorAll('newshi scroll img').forEach(pos=>{
                    let position=document.createElement('poscircle')
                    if(first){
                        position.setAttribute('now','')
                        first=false
                    }
                    document.querySelector('newshi pos').append(position)
                })
        }
        else if(movieindex==document.querySelectorAll('newshi scroll img').length){
            scrollcont.scrollLeft=0
            movieindex=1
            updateposition()
        }
        else{
            scrollcont.scrollLeft+=(movie.clientWidth)
            movieindex+=1

            updateposition()
        }
        const currentImage=document.querySelectorAll('newshi scroll img')[movieindex-1]
        let titl=currentImage.getAttribute('name')
        title.innerHTML= `
  <span hiddenB>${titl}</span>
  <svg aria-hidden="true"  head hiddenB>
    <clipPath id="newshiblurmask">
      <text dominant-baseline="hanging" text-anchor="start" x="0" y="0em" dy="0.125em">${titl}</text>
    </clipPath>
  </svg>
`
        currenSlideID=currentImage.getAttribute('id')
        document.querySelector('genres').innerHTML=''
        currentImage.getAttribute('genre').split(',').slice(0,3).forEach((genre,index)=>{
            let genr=document.createElement('genre')
            if(index!=2){ //max-1
                genre=genre+' ∙ '
            }
            genr.innerText=genre
            document.querySelector('genres').append(genr)
        })
        if(currentImage.hasAttribute('rating')&&currentImage.getAttribute('rating')!=undefined){
            rating.innerText=currentImage.getAttribute('rating')        
        }
        else{
            console.log(`Rating missing for ${currentImage.getAttribute('name')}`)
        }
    }
    let declaredHidden=false
    let declaredInteraction=false
    function autorefresh(){
        setInterval(()=>{
            if(document.visibilityState=='visible'&&slideRunning){
                refreshslide()
                declaredInteraction=false
                declaredHidden=false
            }
            else{
                if(!declaredHidden){
                    if(document.visibilityState=='hidden'){
                        console.log('[performance] Slides not visible to user : stopping slides from refreshing')
                        declaredHidden=true
                    }
                    else{
                        if(!declaredHidden&&debug&&debugLevel=='all'){
                            console.log('[performance] SlideRunning is paused because the user is interacting with a slide or because its hidden by a tab')
                            declaredInteraction=true
                        }
                    }
                }
            }
        },2500)
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
                //slides
                slideRunning=false
                //
                if(!trueback){
                    back.addEventListener('click',async function(){
                        slideRunning=true
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
                if(movie[keyword.genre_list]&&movie[keyword.length]){
                    infobar.innerText=`${movie[keyword.genre_list][0]} ∙ ${movie[keyword.length]}`
                    movie[keyword.genre_list].forEach(genr=>{
                        tasteprofile(genr,'1')
                    })
                }
                else{
                    console.warn(`Couldnt find genre or length :\n   movie: ${movie.title}   datatype: ${datatype}\n   openviapage(trueback): ${trueback}`)
                }
                
                let plot=document.createElement('plot')
                plot.innerText=movie[keyword.plot].replaceAll('<br>','\n')

                let controlbar=document.createElement('playcontrol') //add watchlist,watched,dislike,like
                let watch=document.createElement('button')
                watch.setAttribute('main','')
                let trailer=document.createElement('button')
                trailer.setAttribute('side','')
                trailer.setAttribute('trailer','')
                trailer.innerText='watch trailer'
                let watchlist=document.createElement('button')
                let watched=document.createElement('button')
                let like=document.createElement('button')
                let dislike=document.createElement('button')
                watchlist.setAttribute('action','watchlist')
                watched.setAttribute('action','watched')
                like.setAttribute('action','like')
                dislike.setAttribute('action','dislike');
                
                [watched,watchlist,like,dislike].forEach(act=>{
                    act.setAttribute("smallactionb","")//add to recommendations
                    act.addEventListener('click',function(){
                        let liked=JSON.parse(localStorage.getItem('user-interact'))
                         let type=act.getAttribute("action")
                            if(act.hasAttribute('actived')){
                                try{
                                    delete liked[movie[keyword.id_list][keyword.imdb].replaceAll('t','')][type]
                                    localStorage.setItem('user-interact',JSON.stringify(liked))
                                    act.removeAttribute('actived')
                                }
                                catch(e){
                                    console.error(e)
                                }
                            }
                            else{
                                try{
                                   let intr
                                   if(liked[movie[keyword.id_list][keyword.imdb].replaceAll('t','')]){
                                       intr=liked[movie[keyword.id_list][keyword.imdb].replaceAll('t','')]
                                   }
                                   else{
                                    intr={}
                                   }
                                   intr[type]=true
                                   if(type=='like'&&intr['dislike']){
                                    delete intr['dislike']
                                    dislike?.removeAttribute('actived')
                                   }
                                   else if(type=='dislike'&&intr['like']){
                                    delete intr['like']
                                    like?.removeAttribute('actived')
                                   }
                                   liked[movie[keyword.id_list][keyword.imdb].replaceAll('t','')]=intr
                                   localStorage.setItem('user-interact',JSON.stringify(liked))
                                   act.setAttribute('actived','')
                                }
                                catch(er){
                                    console.error(er)
                                }
                            
                    }})
                })

                trailer.addEventListener('click',async function(){
                    if(movie[keyword.genre_list]){
                        movie[keyword.genre_list].forEach(genr=>{
                            tasteprofile(genr,2)
                        })
                    }
                    let trailerobj
                    if(movie[keyword.trailer]){
                        trailerobj=movie[keyword.trailer]
                        console.log(`[trailer] Playing trailer (single)`)
                    }
                    else if(movie[keyword.trailer_list]){
                        if(typeof movie[keyword.trailer_list]=='object'){
                            trailerobj=movie[keyword.trailer_list][0][keyword.trailer_listYTId]
                            console.log(`[trailer] Multiple trailers found for ${movie.title}. Chose 1st trailer by index:\n   trailers : `)
                            movie[keyword.trailer_list].forEach(trailerr=>{
                                console.log('     '+trailerr[keyword.trailer_listtitle])
                            })
                            console.log(`   chose : ${movie[keyword.trailer_list][0][keyword.trailer_listtitle]}`)
                        }
                    }
                    let trailerwindow=document.createElement('iframewindow')
                    trailerwindow.innerHTML=`
<iframe src="https://www.youtube.com/embed/${trailerobj}" title="${movie.title} trailer" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
                    let trailerclose=document.createElement('button')
                    console.log(`[${movie.title}] Watching trailer : https://www.youtube.com/embed/${trailerobj}`)
                    if(debug==true){
                        console.log(`[debug] trailer for ${movie.title}\n`)
                        console.log(movie)
                    }
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
                        addwatched()
                        if(movie[keyword.genre_list]){
                            movie[keyword.genre_list].forEach(genr=>{
                              tasteprofile(genr,2)
                         })
                    }
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
                                let keyw=api.api.structure.response.translator.similar_response
                                window.location.href=`./?page/=m${similar[keyw.id_list][keyw.id]}xid`
                                
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
                    data.forEach(similar=>{
                            let similarcard=addtosimilar(similar)
                            if(similarcard){
                             similarwrap.append(similarcard)
                            }
                            more.append(sub,similarwrap)
                    })
                }
                controlbar.append(watch,trailer,watchlist,watched,like,dislike)
                tab.setAttribute('info','')
                tab.append(backdrop,back)
                main.append(title,infobar,plot,controlbar)
                tab.setAttribute('closing','')
                tab.append(main,more)
                try{
                    window.loader('h','h')
                }
                catch(e){
                    console.error(`Failed to remove loader :\n   fallback : trying to remove loader directly\n   error : ${e}`)
                    try{
                        document.querySelectorAll('notify').forEach(loader=>{
                            loader.remove()
                        })
                        console.warn('Removed loader directly via force.(success)')
                    }
                    catch(er){
                        console.error(`Tried to remove loader directly :\n   status : failed\n   error : ${er}\n   no-force-attempt : ${e}`)
                    }
                }
                document.body.append(tab)
                //savedlikes n shi
                if(localStorage.getItem('user-interact')){
                    let liked=JSON.parse(localStorage.getItem('user-interact'))
                    if(liked[movie[keyword.id_list][keyword.imdb].replaceAll('t','')]){
                        Object.entries(liked[movie[keyword.id_list][keyword.imdb].replaceAll('t','')]).forEach(([type,val])=>{
                            document.querySelector(`[action=${type}]`).setAttribute('actived','')
                        })
                    }
                }
                if(datatype=='auto'){
                await sleep(300)
                }
                tab.removeAttribute('closing')
              }

    fetch('sources/api.json').then(text=>text.json()).then(async api=>{
        let keyword=api.api.structure.response
        console.log(`using ${api.api.api.docs} [movie data]`)
        console.log(`endpoint => ${api.api.start_url} [movie data]`)
        //bylink
        if(autopage){
            fetch(`${api.api.translator.replace('{type}',autopage_type).replace('{imdb}',idstarter+autopage.slice(1)).replace('{clientid}',api.api.other_apis.id_translator.clientid)}&app-name=OpenFlix&app-version=1.0&shareid=${linkid}`).then(text=>text.json()).then(res=>{
               if(res.title){
                        openpage(res,api,keyword,'other',res[api.api.structure.response.translator.similar],true)
               }
            })
        }
        else{
        let genrrr=refreshtaste('You might like')
        console.log(`Recommending ${genrrr[0]} in feed. (personalized/${genrrr[1]})`)
        let sectioncount=0
        document.querySelectorAll('section[fill]').forEach(fill=>{
          let fetchpath
          let manual=false

          if(fill.getAttribute('fill').slice(0,2)=='//'){
            let genre=genrrr[0]
            manual=true
            fetchpath=`${api.api.structure.pages[fill.getAttribute('fill')].replace('{genre}',genre).replace('{type}',fill.getAttribute('type')).replace('{clientid}',api.api.other_apis.id_translator.clientid)}`
          }
          else{
            fetchpath=`${api.api.start_url}${api.api.structure.pages[fill.getAttribute('fill')]}`
          }
           let head=document.createElement('h2')
           head.innerText=fill.getAttribute('name')
           head.setAttribute('sectitle','')
           
           //navigation
           let right=document.createElement('button')
           right.innerHTML='&#xF285;'
           let left=document.createElement('button')
           left.innerHTML='&#xF284;'
           left.setAttribute('navigate','left')
           right.setAttribute('navigate','right')
           
           if(fill.closest('scroller')){
               fill.closest('scroller').setAttribute('pre','')        
               fill.closest('scroller').append(left,right)            
           }

           right.addEventListener('click',function(){
                fill.closest('scroller')?.removeAttribute('pre')
                fill.scrollLeft+=(174.667 + 10) //av poster width
           })
           left.addEventListener('click',function(){
                fill.scrollLeft-=(174.667 + 10) //av poster width
           })
           
           
           console.log(`fetching ${api.api.start_url}${api.api.structure.pages[fill.getAttribute('fill')]}`)
           fetch(fetchpath).then(txt=>txt.json()).then(data=>{
            let filtered
            if(fill.getAttribute('filter')){
                filtered=data[fill.getAttribute('filter')]
            }
            else{
                filtered=data
            }
            let total=16
            let count=0
            let imstart=performance.now()
            let lastimload=performance.now()
            let finished=false

            let specialscount=0
            let specialstotal=5

            filtered.forEach(movie=>{
              let contain=document.createElement('movie')
              try{
                  contain.setAttribute('openflixid',parseInt(movie.ids.tmdb)+67)
              }
              catch(er){
                 console.error(`Error when assigning openflixid to movie shortcut :\n   movie : ${movie.title}\n   culprit : tmdbID might not exist\n   error : ${er}`)
              }
              try{
                  contain.setAttribute('openflixid_',parseInt(movie[keyword.id_list][keyword.imdb].replaceAll('t',''))+67)
              }
              catch(er){
                if(debug&&debugLevel=='all'&&expectednRepeatederrorLog=='all'){
                 console.error(`Error when assigning openflixid to movie shortcut :\n   movie : ${movie.title}\n   culprit : imdb might not exist\n   error : ${er}`)
                }
              }
              let im=document.createElement('img')
              let title=document.createElement('p')
              title.innerText=movie.title
              im.src=String(api.api.structure.posters).replaceAll('{posterID}',movie[keyword.posterID])
              //slide
              if(fill.getAttribute('fill')=='movies/today/popular'&&fill.getAttribute('filter')=='movies'){
                if(specialscount!=specialstotal){
                    console.log(movie)
                    specialscount++
                    let slidewrap=document.querySelector('newshi scroll')
                    let slide=document.createElement('img')
                    slide.src=String(api.api.structure.backdrops).replaceAll('{backdropID}',movie[keyword.backdropID])
                    slide.setAttribute('name',movie.title)
                    slide.setAttribute('desc',movie[keyword.plot])
                    slide.setAttribute('genre',movie[keyword.genre_list].join(','))
                    slide.setAttribute('id',movie[keyword.id_list][keyword.imdb])
                    try{
                        slide.setAttribute('rating',movie[keyword.rating_list][keyword.rating][keyword.rating_type])
                        if(debug){
                            console.log(`[slides] Rating found for ${movie.title}:\n   rating : ${JSON.stringify(movie[keyword.rating_list][keyword.rating][keyword.rating_type])}\n   rating list (str): ${JSON.stringify(movie[keyword.rating_list])}`)
                        }
                    }
                    catch(er){
                        console.error(`Error was raised when trying to access rating from movie :\n   movie : ${movie.title}\n   error : ${er}`)
                        if(debug){
                            console.log('[debug] rating for slides')
                            console.log(movie)
                        }
                    }
                    slidewrap.append(slide)
                }
              }
              //
              im.addEventListener('load',async function(){
                count++
                if(document.querySelector('[loader="val"] val')){
                    document.querySelector('[loader="val"] val').style.width=`${((total*sectioncount)/(total*document.querySelectorAll('section[fill]').length))*100}%`                
                }
                if(total==count){
                    sectioncount+=1
                    let secfinish=(performance.now()-lastimload).toFixed(2)
                    console.log(`Loaded [${fill.getAttribute('name')}] posters :\n   preload wait : (${count}/${total})\n   fullload : (${count}/${filtered.length})\n   section : ${sectioncount}/${document.querySelectorAll('section[fill]').length}\n   took : ${secfinish}ms`)
                    lastimload=performance.now()
                }
                if(sectioncount==document.querySelectorAll('section[fill]').length&&!finished){
                    finished=true
                    let finish=(performance.now()-imstart).toFixed(2)
                    let splash=document.querySelector('splash')
                    try{
                     if(!splashmaintain){
                       if(splash){
                        await sleep(300)//loaderfinish
                        splash.setAttribute('hiddenA','')
                        await sleep(200)//outro
                        splash.remove()
                        refreshslide()
                        autorefresh()
                       }
                     }
                    }
                    catch(er){
                        console.error(`Error when removing splash :\n   culprit : splash might already be removed\n   error : ${er}`)
                    }
                }
              })
              //movieinfo tab
            
            //
              contain.append(im,title)
              fill.append(contain)
              contain.addEventListener('click',()=>{
                window.loader('loading','s')
                if(manual){
                    let dict=api.api.other_apis.alltime_popular.structure.response
                     fetch(`${api.api.translator.replace('{type}','movies').replace('{imdb}',movie[dict.id_list][dict.id]).replace('{clientid}',api.api.other_apis.id_translator.clientid)}&app-name=OpenFlix&app-version=1.0&shareid=${linkid}`).then(text=>text.json()).then(res=>{
                         if(res.title){
                            openpage(res,api,keyword,'other',res[api.api.structure.response.translator.similar])
                         }
                     })
                }
                else{
                    openpage(movie,api,keyword,'auto',data)
                }
              })
              
            })
           }).catch(async er=>{
            document.querySelector('splash p').innerText='Almost there'
            let prog=document.querySelector('[loader="val"] val')
            let errtext=`error when fetching data from source :\n   url : ${fetchpath}\n   error : ${er}\n   culprit : might be from api rate limiting`
            console.error(errtext)
            const status=await window.fileIncidentReport(errtext,true,fetchpath,'main',window.location)
            if(status){
                document.querySelector('splash p').innerText='Error while loading data.'
                console.log(`Incident report ${status} filed. Error will be resolved as soon as posible`)
                await sleep(500)
                document.querySelector('splash p').innerText=`Incident report ${status} filed.\nError will be resolved as soon as posible`
            }    
            console.warn('Critical error : main features of openflix may not load.')
           })
           if(!fill.closest('scroller')){
            fill.before(head)
           }
           else{
            fill.closest('scroller').before(head)
           }
        })
    }
    })
    //uishi
        //search
    let searchin=document.querySelector('input[searchin]')
    let icon=document.querySelector('[searchicon')
    document.querySelector('center-tab button[search]').addEventListener('click',function(){
        if(searchin.hasAttribute('full')){
            if(searchin.value.replaceAll(' ','')!=''){
               let searches=JSON.parse(localStorage.getItem('searchhist'))
               searches.push(searchin.value.replaceAll(' ','_').replaceAll('[','').replaceAll(']'))
               localStorage.setItem('searchhist',JSON.stringify(searches))
               window.location.href=`search/?q=${searchin.value.replaceAll(' ','+')}`
            }
            searchin.removeAttribute('full')
        }
        else{
            searchin.setAttribute('full','')
        }
            icon.className='bi bi-search'
    })
    searchin.addEventListener('keyup',function(key){
        if(key.key=='Enter'){
            document.querySelector('center-tab button[search]').click()
            icon.className='bi bi-search'
        }
        if(searchin.value.replaceAll(' ','')!==''){
            icon.className='bi bi-search'
        }
        else{
            icon.className='bi bi-x-circle'
        }
    })
        //tabs
     if(!currenttab){
        currenttab='home'
     }
     function refreshtab(){
      document.querySelectorAll('tabs tab').forEach(tab=>{
        if(tab.getAttribute('tab')==currenttab){
            tab.setAttribute('active','')
        }
        else{
            tab?.removeAttribute('active')
        }
       })
     }
     refreshtab()
    document.querySelectorAll('tabs tab').forEach(tab=>{
        tab.addEventListener('click',function(){
            currenttab=tab.getAttribute('tab')
            refreshtab()
            document.querySelectorAll(`section:not([${currenttab}])`)?.forEach(tabs=>{
                tabs.setAttribute('hiddenA','')
                tabs.closest('scroller').previousElementSibling.setAttribute('hiddenA','')
            })
            document.querySelectorAll(`section[${currenttab}]`)?.forEach(tabs=>{
                tabs.previousElementSibling?.removeAttribute('hiddenA')
                tabs?.removeAttribute('hiddenA')
            })
        })
    })
    let pos=document.querySelector('[account]').getBoundingClientRect()
    console.log(pos.x)
    console.log(pos.y)
    let originalbutton=document.querySelector('[link="account/"]').querySelector('button')
    let animator=document.querySelector('windowmove')
    animator.style.width=originalbutton.clientWidth+'px'
    animator.style.height=originalbutton.clientHeight+'px'
    animator.style.transform=`translate(${pos.x}px,${pos.y}px)`

    document.querySelector('[link="account/"]').addEventListener('click',async function(ev){
        animator.style.transition=' 0.3s all, 0.3s 0.2s border-radius'
        animator.style.width='100vw'
        animator.style.height='100vh'
        animator.style.transform='none'
        animator.style.borderRadius='0px'
        animator.style.background='black'
        animator.style.zIndex='+999999'
        await sleep(500)
        let a=document.createElement('a')
        a.href='account/'
        a.click()
    })
})

