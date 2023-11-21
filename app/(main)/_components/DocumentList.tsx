"use client"

import { Doc, Id } from "@/convex/_generated/dataModel"
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {useQuery} from 'convex/react'
import { api } from "@/convex/_generated/api";
import Item from "./Item";
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";


interface DocumentListProps {
    parentDocumentId?:Id<"documents">;
    level?:number;
    data?:Doc<"documents">[];
}

function DocumentList({parentDocumentId,level}:DocumentListProps) {

  const params=useParams();
  const router=useRouter();
  const [expanded,setExpanded]=useState<Record<string,boolean>>({})
  const onExpand=(documnetId:string)=>{
    setExpanded(prevExpanded=>({
      ...prevExpanded,[documnetId]:!prevExpanded[documnetId]
    }))
  };

  const documnets=useQuery(api.documents.getSidebar,{
    parentDocument:parentDocumentId
  });

  const onRedirect=(documentId:string)=>{
    router.push(`/documents/${documentId}`)
  }

  if(documnets === undefined){
    return (
      <>
      <Item.Skeleton level={level}/>
      {level===0 && (
        <>
        <Item.Skeleton level={level}/>
        <Item.Skeleton level={level}/>
        </>
      )}
      </>
    )
  }

  return (
    <>
    <p
    style={{
      paddingLeft:level ? `${(level*12)+25}px`: undefined
    }}
    className={cn("hidden text-sm font-medium text-muted-foreground/80",
    expanded && "last:block",level===0 && "hidden")
    }
>
      No pages inside
    </p>
    {
      documnets.map((document)=>(
        <div key={document._id}>
          <Item id={document._id}
          onClick={()=>onRedirect(document._id)}
          label={document.title}
          Icon={FileIcon}
          documentIcon={document.icon}
          active={params.documentId === document._id}
          level={level}
          onExpand={()=>onExpand(document._id)}
          expanded={expanded[document._id]}
          />
        {expanded[document._id] && (
          <DocumentList
          parentDocumentId={document._id}
          level={(level || 0)+1}
          />
        ) }
        </div>
      ))
    }
    </>
  )
}

export default DocumentList