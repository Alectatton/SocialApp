"use client"

import Image from 'next/image'
import { deleteThreadById } from "@/lib/actions/thread.actions"
import { usePathname } from "next/navigation"

interface Props {
    threadId: string;
}

const DeleteThreadButton: React.FC<Props> = ({ threadId }) => {
    const pathname = usePathname();

    const handleDeleteThread = async () => {
        await deleteThreadById(threadId, pathname );
    }

    return (
        <Image 
            src="/assets/delete.svg"
            className="filter grayscale hover:grayscale-0 transition cursor-pointer duration-300"
            alt="delete"
            width={16}
            height={16}
            onClick={handleDeleteThread}                     
        />
    )
}

export default DeleteThreadButton

