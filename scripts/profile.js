window.addEventListener('DOMContentLoaded',async function(){
    if(!localStorage.getItem('username')){
        let alertX=document.createElement('alert')
        let controlbarX=document.createElement('controls')
        let okX=document.createElement('button')
        okX.innerText='Enter'
        let messageX=document.createElement('p')
        let mestitleX=document.createElement('h3')
        mestitleX.innerText="What's your name"
        const maininput=document.createElement('input')
        maininput.placeholder='ex : John doe'
        let resetcount=0
        okX.addEventListener('click',async function(){
         if(maininput.value.replaceAll(' ','')==''){
           alertX.setAttribute('error','')
           await sleep(300)
           alertX.removeAttribute('error')
           if(resetcount==10){
            console.log('[easter egg] Flashbang yo watchout')
            alertX.style.transition='none'
            resetcount=0
            alertX.setAttribute('erregg','')
            await sleep(4500)
            mestitleX.innerText="What's your name"
            alertX.removeAttribute('erregg')
            for(let x=0;x<10;x++){
                await sleep(50)
                alertX.setAttribute('erreggend','')
                await sleep(100)
                alertX.removeAttribute('erreggend')
            }
            alertX.style.transition='0.1s'
            maininput.placeholder='flashbanged'
            await sleep(1000)
            maininput.style.filter='blur(5px)'
            await sleep(200)
            maininput.placeholder='ex : John doe'
            maininput.style.filter='blur(0px)'

        }
           else{
            resetcount++
           }
           return  
         }
        resetcount=0
        window.loader('creating profile','s')
        const {error}=await window.supabase
                .from("OpenFlix_users")
                .insert([{
           user:maininput.value,
           localtime:new Date(),
           from:window.location,
           dialog:'welcomeinput'
            }])
                if(error){
                    window.fail('an error occured')

                }
                else{
                    alertX.setAttribute('hiddenA','')
                    await sleep(300)
                    alertX.remove()
                    localStorage.setItem('username',maininput.value)      }
           window.loader('h','h')           

        })

        maininput.addEventListener('keyup',function(key){
            if(key.key=='Enter'){
                okX.click()
            }
        })
        controlbarX.append(okX)
        alertX.append(mestitleX,messageX,maininput,controlbarX)
        alertX.setAttribute('user','')
        alertX.setAttribute('hiddenA','')
        document.body.append(alertX)
        await sleep(200)
        alertX.removeAttribute('hiddenA')
    }
    if(!localStorage.getItem('user')){
        let alertX=document.createElement('alert')
        let controlbarX=document.createElement('controls')
        let okX=document.createElement('button')
        okX.innerText='Enter'
        let messageX=document.createElement('p')
        let mestitleX=document.createElement('h3')
        mestitleX.innerText="Terms and conditions"
        messageX.innerHTML='I have read and agree to the <a href="legal/#tos">OpenFlix terms of service</a> and acknowledge <a href="legal/#privacy">the privacy policy</a>.'
        const check=document.createElement('input')
        check.type='checkbox'
        const agreed=new Date()
        okX.addEventListener('click',async function(){
            if(check.checked){
                 window.loader('creating profile','s')
                 const {error}=await window.supabase.from('OpenFlix_useragreements').insert([{
                    username:localStorage.getItem('username'),
                    agreement_text:messageX.innerText,
                    localtime:agreed
                 }])      
                if(error){
                    window.fail('an error occured')
                }
                else{
                    alertX.setAttribute('hiddenA','')
                    await sleep(300)
                    alertX.remove()
                    localStorage.setItem('user',agreed) 
                }
                window.loader('h','h')
            }
            else{
                alertX.setAttribute('error','')
                await sleep(300)
                alertX.removeAttribute('error')
            }
        })
        controlbarX.append(okX)
        const flex=document.createElement('flxR')
        flex.addEventListener('click',(ev)=>{
            check.click()
        })
        flex.append(check,messageX)
        alertX.append(mestitleX,flex,controlbarX)
        alertX.setAttribute('legal','')
        alertX.setAttribute('hiddenA','')
        document.body.append(alertX)
        await sleep(200)
        alertX.removeAttribute('hiddenA')
    }
    window.profiledata='openflix/web/profile'
})