"use server"

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
    text: string;
    author: string;
    communityId: string | null;
    path: string,
}

export async function createThread({
    text, author, communityId, path,
}: Params) {
    try {
        connectToDB();

        const createdThread = await Thread.create({
            text,
            author,
            community: null,
        });
    
        // Update user model
        await User.findByIdAndUpdate(author, {
            $push: { thread: createThread._id }
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