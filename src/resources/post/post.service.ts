import { PrismaClient } from "@prisma/client";
import Post from '@/resources/post/post.interface'
import InternalServerException from "@/utils/exceptions/internal-server.exception";
import { Request } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import NotFoundException from "@/utils/exceptions/not-found.exception";
import { count } from "console";

class PostService {
    private prisma = new PrismaClient()

    /**
     * Create user
     */
    public async createPost(dto: Post): Promise<Post | Error> {
        try {
            const post: Post = await this.prisma.post.create({
                data: dto
            })

            return post
        } catch (error) {
            throw new InternalServerException()
        }
    }


    /**
     * Get all users
     */
    // public async getUsers(): Promise<User[] | Error> {
    //     try {
    //         const users: User[] = await this.prisma.user.findMany({
    //             select: {
    //                 id: true,
    //                 email: true,
    //                 firstName: true,
    //                 lastName: true,
    //                 role: true
    //             }
    //         })

    //         return users
    //     } catch (error) {
    //         throw new InternalServerException()
    //     }
    // }

    /**
     * Update post
     */
    public async updatePost(req: Request): Promise<Post | Error> {
        try {
            const post = await this.prisma.post.update({
                where: {
                  id: req.params.id,
                },
                data: req.body,
              });
              
              return post    
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError) {
                if(error.code === 'P2025') {
                    throw new NotFoundException(`No post with ${req.params.id}`)
                }
            }

            throw new InternalServerException()
        }
    }

    /**
     * Delete post
     */
    public async deletePost(id: string): Promise<string | Error> {
        try {
            await this.prisma.post.delete({
                where: {
                    id: id
                }
            })
            return `Successfully delete post ${id}`

        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError) {
                if(error.code === 'P2025') {
                    throw new NotFoundException(`No post with ${id}`)
                }
            }

            throw new InternalServerException()
        }
    }

    /**
     * Get post by user id
     */
    public async getMyPosts(id: string): Promise<Post[] | Error> {
        try {
            const posts = await this.prisma.post.findMany({
                where: {
                    authorId: id
                }
            })

            if(posts.length === 0) {
                throw new NotFoundException(`You don't have any posts`)
            }

            return posts
        } catch (error) {
            throw new InternalServerException()
        }
    }

    /**
     * Get All posts
     */
    public async getPosts(): Promise<Post[] | Error> {
        try {
            const posts = await this.prisma.post.findMany({
                select: {
                    id: true,
                    title: true,
                    description: true,
                    url: true,
                    authorId: true,
                    author: {
                        select: {
                            firstName: true,
                            lastName: true
                        }
                    },
                    _count: {
                        select: {
                            favorites: true
                        }
                    }
                }
            })

            return posts
        } catch (error) {
            throw new InternalServerException()
        }
    }

     /**
     * Get post by id
     */
    public async getPost(id: string): Promise<Post | Error | null> {
        try {
            const post = await this.prisma.post.findUnique({
                where: {
                    id: id
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    url: true,
                    authorId: true,
                    author: {
                        select: {
                            firstName: true,
                            lastName: true
                        }
                    }
                }
            })

            if(!post) {
                throw new NotFoundException(`No post with id ${id}`)
            }

            return post
        } catch (error) {
            if(error instanceof NotFoundException) {
                throw error
            }
            throw new InternalServerException()
        }
    }

    /**
     * Add to favotites
     */
    public async addToFavorites(postId: string, userId: string): Promise<string | Error> {
        try {
            const post = await this.prisma.post.findUnique({
                where: {
                    id: postId
                }
            })

            if(!post) {
                throw new NotFoundException(`No post found with id ${postId}`)
            }

            await this.prisma.favorite.create({
                data: {
                    userId,
                    postId,
                }
            })

            return `${postId} Successfully Added to favorites`
        } catch (error) {
            if(error instanceof NotFoundException){
                throw error
            }

            throw new InternalServerException()
        }
    }

    /**
     * Get my favorites
     */
    public async getMyFavorites(userId: string): Promise<Post[] | Error> {
        try {
            const favs = await this.prisma.favorite.findMany({
                where: {
                    userId
                },
                select: {
                    post: true
                }
            })

            const posts = favs.map(fav => fav.post)

            return posts
        } catch (error) {
            throw new InternalServerException()
        }
    }

}

export default PostService