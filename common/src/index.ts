import z, { string } from "zod";

export const signupInput = z.object({
    email:z.string().email(),
    name: z.string().optional(),
    password: z.string().min(4),
})

export const signinInput = z.object({
    email:z.string().email(),
    password: z.string().min(4),
})

export const createBlogInput = z.object({
    title: z.string(),
    description: z.string(),
})

export const updateBlogInput = z.object({
    title: z.string(),
    description: z.string(),
    id: z.number(),
})

export type SignupInputType = z.infer<typeof signupInput>
export type SigninInputType = z.infer<typeof signinInput>
export type CreateBlogInput = z.infer<typeof createBlogInput>
export type UpdateBlogInput = z.infer<typeof updateBlogInput>