"use client"

import Image from 'next/image'
import { likeThreadById } from "@/lib/actions/thread.actions";
import { usePathname } from "next/navigation"
import { currentUser } from "@clerk/nextjs";

interface Props {
    threadId: string;
    userId: string;
    isLiked: boolean;
}

function LikeButton ({ 
    threadId,
    userId, 
    isLiked,
}: Props) {
    const handleLikeThread = async () => {
        console.log('handleLikeThread')

        try {
            await likeThreadById(
                threadId, 
                userId,
                '/', // pathname,
            );
        } catch (error) {
            console.error(error);
        }
    }

    return (
        isLiked ? (
            <Image  
                src="/assets/heart-gray.svg" 
                alt="heart" 
                width={24} 
                height={24} 
                className="object-contain opacity-50 hover:opacity-100 transition-opacity"
                onClick={handleLikeThread}
            />
        ) : (
            <Image  
                src="/assets/heart-filled.svg" 
                alt="heart" 
                width={24} 
                height={24} 
                className="object-contain opacity-50 hover:opacity-100 transition-opacity"
                onClick={handleLikeThread}
            />
        )
    )
}

export default LikeButton;
