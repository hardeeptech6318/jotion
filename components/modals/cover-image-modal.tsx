"use client"

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog'
import { useSettings } from '@/hooks/use-setting'
import { Label } from '../ui/label'
import { ModeToggle } from '../mode-toggle'
import { useCoverImage } from '@/hooks/use-cover-image'
import { useEdgeStore } from '@/lib/edgestore'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useParams } from 'next/navigation'
import { Id } from '@/convex/_generated/dataModel'
import { SingleImageDropzone } from '../single-image-dropzone'

function CoverImageModal() {
    const coverImage=useCoverImage()
    const params= useParams()
    const [file,setFile]=useState<File>()
    const [isSubmitting,setIsSubmitting]=useState(false)
    const {edgestore}=useEdgeStore()
    const update=useMutation(api.documents.update)

    const onClose=()=>{
        setFile(undefined)
        setIsSubmitting(false)
        coverImage.onClose()
    }
    
    
    const onChange=async (file?:File)=>{
        if(file) {
            setIsSubmitting(true)
            setFile(file)
            


            
             const   res=await edgestore.publicFiles.upload({
                    file,
                    options:{
                        replaceTargetUrl:coverImage.url
                    }
                })
          

            await update({
                id:params.documentId as Id<"documents">,
                coverImage:res.url
            })

            onClose()



        }
    }
  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
        <DialogContent>
            <DialogHeader >
                <h2 className='text-center text-lg font-semibold'>
                    Cover Image
                </h2>
            </DialogHeader>
          <SingleImageDropzone 
          className='w-full outline-none'
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
          />
        </DialogContent>
    </Dialog>
  )
}

export default CoverImageModal