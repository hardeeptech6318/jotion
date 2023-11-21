"use client"
import {useState,useEffect} from "react"
import { useUser } from '@clerk/clerk-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import {  useQuery } from "convex/react"
import { api } from '@/convex/_generated/api'
import { useSearch } from '@/hooks/use-search'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command"
import { File } from "lucide-react"

function SearchCommand() {
    const {user}=useUser()
    const router =useRouter()
    const documents=useQuery(api.documents.getSearch)

    const [isMounted,setMounted]=useState(false)
  
    const toggle=useSearch((store)=>store.toggle)
    const isOpen=useSearch((store)=>store.isOpen)
    const onClose=useSearch((store)=>store.onClose)

    useEffect(()=>{
setMounted(true)
    },[])

    useEffect(()=>{

        const down=(e:KeyboardEvent)=>{
            if(e.key === "k" && (e.metaKey || e.ctrlKey)){
                e.preventDefault()
                toggle()
            }
        }

        document.addEventListener("keydown",down)

        return ()=>document.removeEventListener("keydown",down)

    },[])

    const onSelect=(id:string)=>{
        router.push(`/documents/${id}`)
        onClose()
    }

    if(!isMounted) return null

    return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
        <CommandInput placeholder={`Search ${user?.fullName !== null?user?.fullName:user?.username}'s Jotion...`}/>
<CommandList>
    <CommandEmpty>
        No result found
    </CommandEmpty>

    <CommandGroup heading="Documents">
        {documents?.map((document)=>(
            <CommandItem key={document._id}
            value={`${document._id}-${document.title}`}
            title={document.title}
            onSelect={onSelect}

            >
            {document.icon?(
                <p className="mr-2 text-[18px]">{document.icon}</p>
            ):
            <File className="mr-2 h-4 w-4"/>
            }
            <span>
                {document.title}
            </span>
            </CommandItem>
        ))}

    </CommandGroup>

</CommandList>
        

    </CommandDialog>
  )
}

export default SearchCommand