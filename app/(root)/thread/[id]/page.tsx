import ThreadCard from "@/components/cards/ThreadCard";
import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/lib/actions/user.actions";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { redirect } from "next/navigation";
import Comment from "@/components/forms/Comment";
import Thread from "@/lib/models/thread.model";

const Page = async ({ params }: { params: { id:string }}) => {
    if(!params.id) return null;

    const user = await currentUser();
    if(!user) return null;

    const userInfo = await fetchUser(user.id);
    if(!userInfo?.onboarded) redirect('/onboarding');
    const currentUserObjectId = userInfo?._id;

    const thread = await fetchThreadById(params.id);

    return (
    <section className="relative">
        <div>
            <ThreadCard 
                key={thread._id}
                id={thread._id}
                currentUserId={user?.id || ""}
                parentId={thread.parentId}
                content={thread.text}
                author={thread.author}
                createdAt={thread.createdAt}
                comments={thread.children}
                likedBy={thread.likedBy}
                currentUserObjectId={currentUserObjectId}
            />
        </div>

        <div className="mt-7">
            <Comment 
                threadId={thread.id}
                currentUserImg={userInfo.image}
                currentUserId={JSON.stringify(userInfo._id)}
            />
        </div>

        <div className="mt-10">
            {thread.children.map((childItem: any) => (
                <ThreadCard 
                    key={childItem._id}
                    id={childItem._id}
                    currentUserId={user?.id || ""}
                    parentId={childItem.parentId}
                    content={childItem.text}
                    author={childItem.author}
                    createdAt={childItem.createdAt}
                    comments={childItem.children}
                    isComment
                    likedBy={childItem.likedBy}
                    currentUserObjectId={currentUserObjectId}
                />
            ))}
        </div>
    </section>
    )
}

export default Page;