import React from 'react'
import Input from './components/input'

const App = () => { 
 

  return ( 
    
        
   
    <div className='relative min-h-screen w-full overflow-hidden bg-slate-950 px-4 py-12 text-slate-200 sm:px-6 lg:px-8'>   
     
     <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute top-20 -right-20 h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-slate-900/50 blur-[80px]" />
     
     <div className="relative mx-auto max-w-3xl">
    
        <div className="mb-12 text-center animate-fade-in">
          {/* logo */}
          <h1 className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl md:text-6xl">
            Shorten Your Links
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-slate-400">
            Transform long, ugly links into short, memorable ones. Track clicks and share with style.
          </p>
        </div> 
         
         </div>
             <Input/>
        
    </div>
    
  )
}

export default App