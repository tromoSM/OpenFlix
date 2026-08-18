window.addEventListener('DOMContentLoaded',function(){
 window.fileIncidentReport=async (report,Iscritical,fetchsource,docname,pagename)=>{
    const SUPABASE_URL="https://unalxdcdbgrqvveetxsn.supabase.co"
    const SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuYWx4ZGNkYmdycXZ2ZWV0eHNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MDkyNTUsImV4cCI6MjA4NjE4NTI1NX0.8o5IZ_bs-8HaX70sP-e5_OUQfm5jyzXP6XMII1BoGSw"
    window.supabase=supabase.createClient(
     SUPABASE_URL,
     SUPABASE_ANON_KEY
    )
    if(report&&Iscritical&&fetchsource&&docname&&pagename){
        console.log(`filing incident report :\n   critical : ${Iscritical}\n   page : ${pagename}`)
        const {error}=await supabase
                .from("Openflix_errors")
                .insert([{
                    error:report,
                    critical:Iscritical,
                    fetchsource:fetchsource,
                    from:'no names yet',
                    docname:docname,
                    page:pagename
                }])
                if(error){
                 console.error(`Failed to file incident report\n   Error : ${error}`)
                 return 'couldnt be'
                }
                else{
                    console.log('incident report was filed')
                    return 'was'
                }
    }
    else{
        console.warn('Error when filing incident report : required values are missing to file an incident report')
        return 'couldnt be'
    }
}
})