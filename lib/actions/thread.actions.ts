"use server"

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import mongoose, { Types } from "mongoose";

interface Params {
    text: string;
    author: string;
    path: string,
}

export async function createThread({
    text, author, path,
}: Params) {
    try {
        connectToDB();

        const createdThread = await Thread.create({
            text,
            author,
        });

        const ObjectId = Types.ObjectId;
        const authorId: Types.ObjectId = new ObjectId(author);

        await User.findByIdAndUpdate(authorId, {
            $push: { 
                threads: createdThread._id
            }
        })

    
        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Failed to create thread: ${error.message}`);
    }

};

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
    try {
        connectToDB();

        const skip = pageSize * (pageNumber - 1);

        const postsQuery = Thread.find(
            { 
                parentId: { 
                    $in: [null, undefined] 
                } 
            })
            .sort({ createdAt: 'desc' })
            .skip(skip)
            .limit(pageSize)
            .populate({ path: 'author', model: User })
            .populate({ 
                path: 'children', 
                populate: {
                    path: 'author',
                    model: User,
                    select: "_id name parentId image"
                }
            });

        const postsCount = await Thread.countDocuments(            
            { 
            parentId: { 
                $in: [null, undefined] 
            }}
        );

        const posts = await postsQuery.exec();

        const isNext = postsCount > skip + posts.length;

        return { posts, isNext };
    } catch (error: any) {
        throw new Error(`Failed to fetch posts: ${error.message}`);
    }
}

export async function fetchThreadById(id: string) {
    connectToDB();

    try {
        const thread = await Thread.findById(id)
            .populate({ 
                path: 'author', 
                model: User,
                select: "_id name image" 
            })
            .populate({
                path: 'children',
                populate: [
                    {
                        path: 'author',
                        model: User,
                        select: "_id id name parentId image"
                    },
                    {
                        path: 'children',
                        model: Thread,
                        populate: {
                            path: 'author',
                            model: User,
                            select: "_id id name parentId image"
                        }
                    }
                ]
            }).exec();

            return thread;
    } catch (error: any) {
        throw new Error(`Failed to fetch thread: ${error.message}`);
    }
}

export async function addCommentToThread(
    threadId: string,
    commentText: string,
    userId: string,
    path: string,
) {
    connectToDB();

    try {
        const originalThread = await Thread.findById(threadId);

        if(!originalThread) {
            throw new Error("Thread not found");
        }

        // Create a new thread with the comment text
        const commentThread = new Thread({
            text: commentText,
            author: userId,
            parentId: threadId,
        })

        // Save the new thread
        const savedCommentThread = await commentThread.save();

        originalThread.children.push(savedCommentThread._id);

        await originalThread.save();

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Failed to add comment to thread: ${error.message}`);
    }
}

export async function deleteThreadById(
    id: string,
    path: string, 
) {
    try {
        connectToDB();

        const thread = await Thread.findById(id);

        if(!thread) {
            throw new Error("Thread not found");
        }

        await thread.deleteOne();

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Failed to delete thread: ${error.message}`);
    }
}

export async function likeThreadById(
    threadId: string,
    userId: string,
    path: string,
) {
    try {
        connectToDB();

        const thread = await Thread.findById(threadId);
        const user = await User.findOne({userId});

        console.log("Thread: ", thread, " User: ", user);

        if(!thread) {
            throw new Error("Thread not found");
        }

        if(!user) {
            throw new Error("User not found");
        }

        const isLiked = thread.likedBy.includes(user._id);

        if(isLiked) {
            thread.likedBy.pull(user._id);

            await thread.save();
            revalidatePath(path);

            return;
        }

        thread.likedBy.push(user._id);

        await thread.save();
        revalidatePath(path);

        return;
    } catch (error: any) {
        throw new Error(`Failed to like thread: ${error.message}`);
    }
}

export async function unlikeThreadById(
    threadId: string,
    userId: string,
    path: string,
) {

}