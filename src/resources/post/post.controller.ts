import { Router, Request, Response, NextFunction } from "express";
import Controller from "@/utils/interfaces/controller.interface";
import validationMiddleware from "@/middleware/validation.middleware";
import validation from "@/resources/post/post.validation"
import PostService from "@/resources/post/post.service";
import { StatusCodes } from "http-status-codes";
import { AuthenticatedAdminMiddleware, AuthenticatedMiddleware, AuthenticatedUserMiddleware } from "@/middleware/authenticated.middleware";
import NotFoundException from "@/utils/exceptions/not-found.exception";

class PostController implements Controller {
    public path = '/posts'
    public router = Router()
    private postService = new PostService()

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.post(
            `${this.path}`,
            AuthenticatedMiddleware,
            AuthenticatedAdminMiddleware,
            validationMiddleware(validation.create),
            this.createPost
        )

        this.router.patch(
            `${this.path}/:id`,
            AuthenticatedMiddleware,
            AuthenticatedAdminMiddleware,
            validationMiddleware(validation.update),
            this.updatePost
        )

        this.router.delete(
            `${this.path}/:id`,
            AuthenticatedMiddleware,
            AuthenticatedAdminMiddleware,
            this.deletePost
        )

        this.router.get(
            `${this.path}/my/posts`,
            AuthenticatedMiddleware,
            AuthenticatedAdminMiddleware,
            this.getMyPosts
        )

        this.router.get(
            `${this.path}`,
            this.getPosts
        )

        this.router.get(
            `${this.path}/:id`,
            this.getPost
        )

        this.router.post(
            `${this.path}/favorites`,
            AuthenticatedMiddleware,
            validationMiddleware(validation.favorite),
            this.addToFavorites
        )

        this.router.get(
            `${this.path}/my/favorites`,
            AuthenticatedMiddleware,
            this.getMyFavorites
        )
    }

    private createPost = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { title, description, url } = req.body

            const post = await this.postService.createPost({
                title,
                description,
                url,
                authorId: req.user.id
            })

            res.status(StatusCodes.OK).json(post)

        } catch (error: any) {
            next(error)
        }
    }

    private updatePost = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const post = await this.postService.updatePost(req)

            res.status(StatusCodes.OK).json(post)
        } catch (error) {
            next(error)
        }
    }

    private deletePost = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const msg = await this.postService.deletePost(req.params.id)

            res.status(StatusCodes.OK).json({
                status: "Success",
                msg
            })
        } catch (error) {
            next(error)
        }
    }

    private getMyPosts = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            if(!req.user) {
                return next(new NotFoundException("No logged in user"))
            }
    
            const posts = await this.postService.getMyPosts(req.user.id)
    
            res.status(200).json(posts)
        } catch (error) {
            next(error)
        }
    }

    private getPosts = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            
            const posts = await this.postService.getPosts()
    
            res.status(200).json(posts)
        } catch (error) {
            next(error)
        }
    }

    private getPost = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            
            const post = await this.postService.getPost(req.params.id)
    
            res.status(200).json(post)
        } catch (error) {
            next(error)
        }
    }

    private addToFavorites = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { postId } = req.body

            const msg = await this.postService.addToFavorites(postId, req.user.id)

            res.status(StatusCodes.OK).json({
                status: "Success",
                msg
            })

        } catch (error: any) {
            next(error)
        }
    }

    private getMyFavorites = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const posts = await this.postService.getMyFavorites(req.user.id)

            res.status(StatusCodes.OK).json(posts)

        } catch (error: any) {
            next(error)
        }
    }

}

export default PostController