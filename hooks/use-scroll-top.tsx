
import { useState ,useEffect} from "react"


function useScrollTop(thresold=10) {
    const [scrolled,setScrolled]=useState(false)

    useEffect(()=>{
            const handleScroll=()=>{
                if(window.scrollY > thresold){
                    setScrolled(true)
                }else{
                    setScrolled(false)
                }
            }
                
                
            window.addEventListener('scroll',handleScroll)
            return ()=>window.removeEventListener('scroll',handleScroll)
        },[thresold])

  return scrolled
}

export default useScrollTop