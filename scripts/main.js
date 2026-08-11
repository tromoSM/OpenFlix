window.addEventListener('DOMContentLoaded',async function(){
    function sleep(dih){
        return new Promise(resolve=>setTimeout(resolve,dih))
    }
    let autopage=new URLSearchParams(window.location.search).get('page/')
    let linkid=new URLSearchParams(window.location.search).get('id/')
    let autopage_type
    let idstarter='tt'
    let idtype
    let currenttab

    if(!localStorage.getItem('taste-profile')){
        localStorage.setItem('taste-profile',JSON.stringify({}))
    }
    if(!localStorage.getItem('user-interact')){
        localStorage.setItem('user-interact',JSON.stringify({}))
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
            return [genre,highest]
        }
        else{
            console.log(`No stats to personalize recommendations. Recommending Action in feed.${refreshms}`)
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

    fetch('sources/api.json').then(text=>text.json()).then(api=>{
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
           console.log(`fetching ${api.api.start_url}${api.api.structure.pages[fill.getAttribute('fill')]}`)
           fetch(fetchpath).then(txt=>txt.json()).then(data=>{
            let filtered
            if(fill.getAttribute('filter')){
                filtered=data[fill.getAttribute('filter')]
            }
            else{
                filtered=data
            }
            filtered.forEach(movie=>{
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
           })
           fill.before(head)
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
                tabs.previousElementSibling.setAttribute('hiddenA','')
            })
            document.querySelectorAll(`section[${currenttab}]`)?.forEach(tabs=>{
                tabs.previousElementSibling?.removeAttribute('hiddenA')
                tabs?.removeAttribute('hiddenA')
            })
        })
    })

})
