window.addEventListener('DOMContentLoaded',function(){
    const error=new URLSearchParams(window.location.search)
    if(error.get('message')){
        document.querySelector('[fill=message]').innerText=error.get('message')
    }
    else if(error.get('error')){
        document.querySelector('[fill=message]').innerText=error.get('error')
    }
    else{
        document.querySelector('[fill=message]').innerText=`couldn't find the item you were looking for.`
    }
    if(error.get('code')){
        document.querySelector('[fill=code]').innerText=error.get('code')
    }
    if(error.get('error')){
        document.querySelector('[fill=error]').innerText=error.get('error')
    }
    document.querySelector('[back]').addEventListener('click',()=>{window.history.back()})
})