import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";
import { createBlogInput, updateBlogInput } from "@wisejoker/bloggingwebsite-common";
export const blogRouter = new Hono<{
    Bindings:{
        DATABASE_URL: string,
        JWT_SECRET: string,
    },
    Variables:{
      userId: string,
    }
}>();

blogRouter.use("/*",async (c, next) => {
    const authHeader = c.req.header("authorization") || "";
    try{
      const user = await verify(authHeader,c.env.JWT_SECRET);
      if(user){
        c.set('userId',String(user.id));
        await next();
      }else{
        c.status(403);
        return c.json({
          message: "you are not logged in",
        })
      }
    }catch(e){
      c.status(403);
      return c.json({
        message: "you are not logged in",
      })
    }
})


blogRouter.post('/', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const body = await c.req.json();
    const { success } = createBlogInput.safeParse(body);
    if(!success){
      c.status(411);
      return c.json({
        message: "Input not Correct"
      })
    }
    const authorId = c.get("userId");
    const blog = await prisma.blog.create({
      data:{
        title: body.title,
        description: body.description,
        authorId: Number(authorId),
      }
    })
    return c.json({
      id: blog.id,
    })
})
  
  blogRouter.put('/', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const body = await c.req.json();
    const validation = updateBlogInput.safeParse(body);
    if(!validation.success){
      c.status(411);
      return c.json({
        message: "Input not Correct"
      })
    }
    const blog = await prisma.blog.update({
      where:{
        id: body.id,
      },
      data:{
        title: body.title,
        description: body.description,
      }
    })
    return c.json({
      blog
    })
  })
  
  // Todo: add pagination
  blogRouter.get('/bulk',async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    
    const blogs= await prisma.blog.findMany({
      select:{
        description: true,
        title: true,
        id: true,
        author: {
          select: {
            name: true
          }
        }
      }
    });
    return c.json({blogs})
  })

  blogRouter.get('/:id', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const id = c.req.param("id")
    try{
        const blog = await prisma.blog.findFirst({
        where:{
          id: Number(id),
        },
        select: {
          id: true,
          title: true,
          description: true,
          author: {
            select: {
              name: true
            }
          }
        }
      })
      return c.json({
        blog
      })
    }catch(e){
      c.status(411);
      return c.json({
        'msg':'error while fetching blog post'
      });
    }
  })
  

  