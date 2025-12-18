
import {useState} from 'react' 
import z from 'zod' 
import HistoryItem from './historyItem'




const Input = () => { 
     const [error, setError] = useState(null as string | null)  
     const [longUrl, setLongUrl] = useState("")     
     const [urlData, setUrlData] = useState([] as Array<{ id: string; longUrl: string; shortUrl: string, clickCount: string }>)
     

     const urlSchema = z.string().url().startsWith('http')  

    const handleSubmit = async (longUrl: string) => {

    const result = urlSchema.safeParse(longUrl); 
    console.log(result) 

  

  if (!result.success) {
    setError("Please enter a valid URL starting with http:// or https://");
    return; 
  }  

  try {
     const response =  await fetch(import.meta.env.VITE_API_BASE_URL, { 
        method: 'POST', 
        headers :{ 
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({ long_url: longUrl }),
     }); 
       
     if(!response.ok ){
        throw new Error("Failed to shorten URL");
     }
     const data =   await response.json(); 
      setUrlData(prev => [data, ...prev]); 
      setError(null)
     console.log(data)  
     console.log(urlData)

  } catch (error) {
      setError("An error occurred while shortening the URL. Please try again."); 
      console.log(error)
  }
   
} 

  return ( 
    <div>
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-2 backdrop-blur-xl shadow-2xl animate-slide-up">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-600/5" />
          
          <div className="relative p-6 sm:p-8">
            
              <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  
                </div>
                <input
                 onChange={(e) => setLongUrl(e.target.value) } 

                  type="text"
                 
                  
                  placeholder = {`Paste your long link here...`}
                  className ={`w-full rounded-xl border bg-slate-950/50 py-4 pl-11 pr-4 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all  
                    ${error ? 'border-red-500/50 focus:ring-red-500/50' : 'border-slate-700 focus:border-cyan-500 focus:ring-cyan-500'}`} 
                />
              </div>  
                 <div>
               {error && (
                  <p className=" mt-2 text-xs font-medium text-red-400 animate-fade-in">
                    {error}
                  </p>
                )} 
                 </div>

              <button onClick={() => handleSubmit(longUrl)} className='w-full mt-5 p-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl hover:to-blue-500'> Shorten</button>
                   
     </div>   
     </div> 

       {urlData.length > 0 && (
          <div className="mt-12 animate-fade-in">
            <div className="mb-6 flex items-center justify-between px-2">
              <h2 className="text-lg font-semibold text-slate-200">Recent Links</h2>
              <button 
                onClick={() => setUrlData([])}
                className="text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors"
              >
                Clear History
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {urlData.map((url) => (
                <HistoryItem 
                  key={url.id} 
                  item={url} 
                  onDelete={() => setUrlData(prev => prev.filter(item => item.id !== url.id))}/>
              ))}
            </div>
          </div>
        )}
      
     
     </div>
  )
}

export default Input