import { fetchPosts } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/lib/actions/user.actions";
import ThreadCard from "@/components/cards/ThreadCard";

export default async function Home() {
    const posts = await fetchPosts(1, 30);
    const user = await currentUser();
    const userInfo = await fetchUser(user?.id || "");
    const currentUserObjectId = userInfo?._id;

    return (
        <>
            <h1 className="head-text text-left">Welcome back, {user?.firstName}</h1>

            <section className="mt-9 flex flex-col gap-10">
                {
                    posts.posts.length === 0 ? (
                        <p className="no-result">No posts found</p>
                    ) : (
                        <>
                            {
                                posts.posts.map((post) => (
                                    <ThreadCard 
                                        key={post._id}
                                        id={post._id}
                                        currentUserId={user?.id || ""}
                                        parentId={post.parentId}
                                        content={post.text}
                                        author={post.author}
                                        createdAt={post.createdAt}
                                        comments={post.children}
                                        likedBy={post.likedBy}
                                        currentUserObjectId={currentUserObjectId}
                                    />
                            ))}
                        </>
                    )
                }
            </section>
        </>
    )
}
