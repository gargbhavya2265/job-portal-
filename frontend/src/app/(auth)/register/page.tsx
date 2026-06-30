"use client";

import { useAppData } from "@/context/AppContext";
import { API } from "@/config/api";
import axios from "axios";
import React, { FormEvent, useState, useEffect } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { Label } from "@/components/ui/label";
import { ArrowRight, Briefcase, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loading from "@/components/loading";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const { isAuth, setUser, loading, setIsAuth } = useAppData();
  const router = useRouter();

  // ✅ safe redirect
  useEffect(() => {
    if (isAuth) {
      router.push("/");
    }
  }, [isAuth, router]);

  if (loading) return <Loading />;
  if (isAuth) return null;

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setBtnLoading(true);

    const formData = new FormData();
    formData.append("role", role);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("phoneNumber", phoneNumber);

    if (role === "jobseeker") {
      formData.append("bio", bio);
      if (resume) {
        formData.append("file", resume);
      }
    }

    try {
      const { data } = await axios.post(
        `${API.AUTH}/api/auth/register`,
        formData
      );

      toast.success(data.message);

      Cookies.set("token", data.token, {
        expires: 15,
        secure: false,
        path: "/",
      });

      setUser(data.registeredUser);
      setIsAuth(true);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      setIsAuth(false);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Join HireHeaven</h1>
          <p className="text-sm opacity-70">
            Create your account to start a new journey
          </p>
        </div>

        <div className="border border-gray-400 rounded-2xl p-8 shadow-lg backdrop-blur-sm">

          <form onSubmit={submitHandler} className="space-y-5">

            {/* ROLE */}
            <div className="space-y-2">
              <Label>I want to</Label>
              <div className="relative">
                <Briefcase className="icon-style" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 border rounded-md bg-transparent"
                  required
                >
                  <option value="">Select role</option>
                  <option value="jobseeker">Find a Job</option>
                  <option value="recruiter">Hire Talent</option>
                </select>
              </div>
            </div>

            {role && (
              <>
                {/* NAME */}
                <div>
                  <Label>Full Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                {/* EMAIL */}
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                {/* PASSWORD */}
                <div>
                  <Label>Password</Label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                {/* PHONE */}
                <div>
                  <Label>Phone</Label>
                  <Input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                </div>

                {/* JOBSEEKER EXTRA */}
                {role === "jobseeker" && (
                  <>
                    <div>
                      <Label>Resume</Label>
                      <Input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) =>
                          setResume(e.target.files ? e.target.files[0] : null)
                        }
                      />
                    </div>

                    <div>
                      <Label>Bio</Label>
                      <Input value={bio} onChange={(e) => setBio(e.target.value)} />
                    </div>
                  </>
                )}

                {/* BUTTON */}
                <Button disabled={btnLoading} className="w-full">
                  {btnLoading ? "Please Wait..." : "Register"}
                  <ArrowRight size={18} />
                </Button>
              </>
            )}

          </form>

          {/* LOGIN LINK FIXED */}
          <div className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;