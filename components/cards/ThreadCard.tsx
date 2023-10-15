import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import LikeButton from "../forms/LikeButton";
import { fetchUser } from "@/lib/actions/user.actions";

const DeleteThreadButton = dynamic(() => import("@/components/forms/DeleteThreadButton"), {
    ssr: false,
});

interface Props {
    id: string;
    currentUserId: string;
    parentId: string | null;
    content: string;
    author: {
        name: string;
        image: string;
        id: string;
    };
    createdAt: string;
    comments: {
        author: {
            image: string;
        }
    }[];
    isComment?: boolean;
    likedBy: string[];
    currentUserObjectId: string;
}

const ThreadCard = ({
    id,
    currentUserId,
    parentId,
    content,
    author,
    createdAt,
    comments,
    isComment,
    likedBy,
    currentUserObjectId,
}: Props) => {
    const commentAuthorsImages = comments.map(comment => comment.author.image);
    const uniqueAuthorImages = commentAuthorsImages.filter(
        (image, index) => commentAuthorsImages.indexOf(image) === index
    );

    const threadId = id.toString();

    const isLiked = likedBy.includes(currentUserObjectId);

    return (
        <article className={`flex w-full flex-col rounded-xl ${isComment ? 'px-0 xs:px-7 py-2' : 'bg-dark-2 p-7'}`}>
            <div className="flex items-start justify-between">
                <div className="flex w-full flex-1 flex-row gap-4">
                    <div className="flex flex-col items-center ">
                        <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
                            <Image 
                                src={author.image}
                                alt="Profile image"
                                fill
                                className="cursor-pointer rounded-full"
                            />
                        </Link>

                        <div className="thread-card_bar"/>
                    </div>

                    <div className="flex w-full flex-col">
                        <Link href={`/profile/${author.id}`} className="w-fit">
                            <h4 className="cursor-pointer text-base-semibold text-light-1">
                                {author.name}
                            </h4>
                        </Link>

                        <p className="mt-2 text-small-regular text-light-2">
                           {content} 
                        </p>

                        <div className={`${isComment && 'mb-10'} mt-5 flex flex-col gap-3`}>
                            <div className="flex gap-3.5">
                                { /** TODO: Implement like functionality */}
                                { /** TODO: Implement "Replies" tab on profile page */ }

                                <LikeButton 
                                    threadId={threadId}
                                    userId={currentUserId}
                                    isLiked={isLiked}
                                />

                                {
                                    !isComment && (
                                        <Link href={`/thread/${id}`}>
                                            <Image 
                                                src="/assets/reply.svg" 
                                                alt="reply" 
                                                width={24} 
                                                height={24} 
                                                className="cursor-pointer object-contain opacity-50 hover:opacity-100 transition-opacity"
                                            />
                                        </Link>
                                    )
                                }

                            </div>
                            
                            <div className="flex items-center">
                            {
                                !isComment && uniqueAuthorImages.length > 0 && (
                                    <div className="flex">
                                        {
                                            uniqueAuthorImages.map((image, index) => (
                                                <Image 
                                                    key={index}
                                                    src={image} 
                                                    alt="comment author" 
                                                    width={24} 
                                                    height={24} 
                                                    className="cursor-pointer object-contain rounded-full"
                                                />
                                            ))
                                        }
                                    </div>
                                )
                            }

                            {
                                !isComment && comments.length > 0 && (
                                    <Link href={`/thread/${id}`}>
                                        <p className="ml-2 mt-1 text-subtle-medium text-gray-1 hover:text-gray-400">
                                            {comments.length} replies
                                        </p>
                                    </Link>
                                )
                            }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between">
                { !isComment && (
                    <p className="mx-5 text-subtle-medium text-gray-1 mt-5">
                        {new Date(createdAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })}
                        {' - '}
                        {new Date(createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                )}

                {
                    currentUserId == author.id && !isComment && (
                        <DeleteThreadButton 
                            threadId={threadId}
                        />
                    )
                }
            </div>
        </article>
    )
}

export default ThreadCard;