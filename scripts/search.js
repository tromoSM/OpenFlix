window.addEventListener('DOMContentLoaded',async function(){
    let search=new URLSearchParams(window.location.search).get('q')
    document.querySelector('title').innerHTML=`${search.slice(0,1).toUpperCase()}${search.slice(1)} - OpenFlix`
    let searchapi=false
    await fetch('../sources/searchapi.json').then(text=>text.json()).then(api=>{
        if(api.api_key=='enter_apikey_here'){
            alert('search failed')
        }
        else{
            searchapi=api.api_key
            console.log(`starting search with ${api.api_for}`)
        }
    })
    try{
        if(searchapi){
            fetch('../sources/api.json').then(text=>text.json()).then(api=>{
                let searchapix=api.api.searchapi
                fetch(`${searchapix.start_url}${search.replaceAll(searchapix.space_character)}&apikey=${searchapi}`).then(text=>text.json()).then(results=>{
                    let imdb=searchapix.structure.response.imdb
                    let result=results[searchapix.structure.response.results]
                    if(result){
                        console.log(`search finished. found ${result.length} results`)
                        result.forEach(movie=>{
                            let cont=document.createElement('movie')
                            let pos=document.createElement('img')
                            let sub=document.createElement('p')
                            sub.innerText=movie[searchapix.structure.response.title]
                            pos.src=movie[searchapix.structure.response.poster]
                            cont.append(pos,sub)
                            document.querySelector('[fill=search]').append(cont)
                        })

                    }
                    else{
                        console.error(`search failed : ${results[searchapix.structure.response.error_message]} `)
                        
                    }
                })
            }) 
        }
        else{
            console.log('api not found')
        }
    }
    catch(er){
        console.error(er)
    }
})