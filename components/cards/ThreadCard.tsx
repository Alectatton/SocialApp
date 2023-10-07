import Image from "next/image";
import Link from "next/link";

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
}: Props) => {
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
                                className="cursor-pointed rounded-full"
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
                                <Image 
                                    src="/assets/heart-gray.svg" 
                                    alt="heart" 
                                    width={24} 
                                    height={24} 
                                    className="cursor-pointer object-contain"
                                />

                                <Link href={`/thread/${id}`}>
                                    <Image 
                                        src="/assets/reply.svg" 
                                        alt="reply" 
                                        width={24} 
                                        height={24} 
                                        className="cursor-pointer object-contain"
                                    />
                                </Link>
                            </div>

                            {
                                isComment && comments.length > 0 && (
                                    <Link href={`/thread/${id}`}>
                                        <p className="mt-1 text-subtle-medium text-gray-1">
                                            {comments.length} replies
                                        </p>
                                    </Link>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>

            <p className="mr-2 text-subtle-medium text-gray-1 mt-5 ml-5">
                {new Date(createdAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })}
                {' - '}
                {new Date(createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>

            {/* TODO: delete */}
            {/* TODO: show comment logos */}
            {/* TODO: Implement search bar */}
            {/* TODO: Implement suggested users */}

            <div>

            </div>
        </article>
    )
}

export default ThreadCard;