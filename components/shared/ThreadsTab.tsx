import { fetchUserPosts, fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";

interface Props {
    currentUserId: string;
    accountId: string;
    accountType: string;
}

const ThreadsTab = async ({ currentUserId, accountId, accountType}: Props) => {
    let result = await fetchUserPosts(accountId);

    const userInfo = await fetchUser(accountId);
    const currentUserObjectId = userInfo?._id;

    if(!result) redirect('/');

    if(!result.threads) return (<p>This user has not posted yet</p>)

    return (
        <section className="mt-9 flex flex-col gap-10">
            {
                result.threads.map((thread: any) => (
                    <ThreadCard 
                        key={thread._id}
                        id={thread._id}
                        currentUserId={currentUserId}
                        parentId={thread.parentId}
                        content={thread.text}
                        author={
                            accountType === 'User' ? { 
                                name: result.name,
                                image: result.image, 
                                id: result.id
                            } : {
                                name: thread.author.name,
                                image: thread.author.image,
                                id: thread.author.id
                            }}
                        createdAt={thread.createdAt}
                        comments={thread.children}
                        likedBy={thread.likedBy}
                        currentUserObjectId={currentUserObjectId}
                />
                ))
            }
        </section>
    )
}

export default ThreadsTab;