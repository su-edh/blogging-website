import { Hono } from "hono";
import { sign } from 'hono/jwt';
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { signinInput, signupInput } from "@wisejoker/bloggingwebsite-common";

export const userRouter = new Hono<{
    Bindings:{
        DATABASE_URL: string,
        JWT_SECRET: string,
    }
}>();

userRouter.post('/signup', async (c) => {
    const body = await c.req.json();
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
  
    //zod validation start---------------
    const validInput = signupInput.safeParse(body);
    if(!validInput.success){
      c.status(411);
      return c.json({
        message:`invalid input zod`
      })
    }
    //zod validation end--------------
  
    try{
      const user = await prisma.user.create({
        data:{
          email: body.email,
          name: body.name,
          password: body.password,
        }
      })
  
      //jwt token generation-------------
      const jwtToken = await sign({
        id: user.id,
      },c.env.JWT_SECRET);
      c.status(200);
      // window.localStorage.setItem("token",jwtToken)
      return c.text(jwtToken);
    }catch(e){
      c.status(403)
      return c.text(`Invalid`);
    }
  })
  
  userRouter.post('/signin', async (c) => {
    const body = await c.req.json();
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
  
    //zod validation start---------------
    const validInput = signinInput.safeParse(body);
    if(!validInput.success){
      c.status(403)
      return c.text(`invalid input zod`)
    }
    //zod validation end--------------
  
    try{
      const user = await prisma.user.findFirst({
        where:{
          email: body.email,
          password: body.password,
        }
      })
      if(!user){
        c.status(403); //unauthorized
        return c.text(`invalid email or password`);
      }
  
      //jwt token generation-------------
      const jwtToken = await sign({
        id: user.id,
      },c.env.JWT_SECRET);
      c.status(200);
      // window.localStorage.setItem("token",jwtToken)
      return c.text(jwtToken);
    }catch(e){
      c.status(403)
      return c.text(`Invalid`);
    }
  })