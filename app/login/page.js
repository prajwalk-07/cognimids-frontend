'use client'
import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";
function CardWithForm() {
  const router=useRouter()
  const { login: authLogin } = useContext(AuthContext);
  const [error,setError]=useState(null)
  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    try {
      const formData = new FormData(event.target);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`,{
        email:formData.get("email"),
        password:formData.get("password")
      });
      console.log(response.data.userId,response.data.token )
      if(response.data.userId&&response.data.token && response.data.role){
        authLogin(response.data.userId,response.data.token,response.data.role)
       
      }
      router.push("/")
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
    }
  }
  return (
    <Card className="w-[350px] bg-black text-white border-zinc-800 text-center mx-auto flex mt-20">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4 ">
            <div className="flex flex-col space-y-1.5 ">
              <Label htmlFor="email ">Email</Label>
              <Input
              type="text"
                id="email"
                name="email"
                placeholder="Enter Email"
                className="border-zinc-800"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
              type="password"
                id="password"
                name="password"
                placeholder="Enter Password"
                className="border-zinc-800"
              />
            </div>
            <Button className="bg-black-800 text-white hover:bg-zinc-800 border-zinc-800 border-1">
              Submit
            </Button>
          </div>
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
export default CardWithForm;
