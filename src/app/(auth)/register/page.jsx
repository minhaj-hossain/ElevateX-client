"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiUser,
  FiCamera,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { GiBottledBolt } from "react-icons/gi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

// 1 line: Import your reusable utility block
import { uploadImageToImgBB } from "@/utils/uploadImage";
import { authClient } from "@/lib/auth-client";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setSelectedFileName(file.name);
    } else {
      setAvatarFile(null);
      setSelectedFileName("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const fullName = e.target.elements["full-name"].value;
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;

    try {
      // 2 lines: Reusably call your utility loop and receive the final destination URL
      const finalUploadedUrl = await uploadImageToImgBB(avatarFile);
      if (avatarFile && !finalUploadedUrl)
        throw new Error("Image upload pipeline dropped.");

      console.log("Form Submitted to Database:", {
        fullName,
        email,
        password,
        image: finalUploadedUrl || "No image uploaded",
      });

      await authClient.signUp.email(
        {
          email,
          password,
          name: fullName,
          image: finalUploadedUrl,
          role: "user",
        },
        {
          onSuccess: (ctx) => {
            //redirect to the dashboard or sign in page
            console.log("success");
          },
          onError: (ctx) => {
            // display the error message
            alert(ctx.error.message);
          },
        },
      );

      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Critical execution pipeline error:", error);
      alert("Registration failed during media provisioning.");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#131313] text-[#e5e2e1] antialiased overflow-x-hidden min-h-screen relative font-sans">
      <div className="fixed inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center scale-105"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDAC-aajEAF2bQiCDFg7J8zQsCg_Q2DemxQylVETqHMnvCdA5b26xucqRWBny1mOf8cl4aBb5bB40BmAt1oIJUHS07ddyhyWIb38xTplAbsZgJQTCcHK9kjQpRgKOPInfYnX8i23nLvKqMcfuGXcuvQCeaAl40uVl7Pr5ip4AgHoObdzTgBltFjU1AUp8xIE1hjCFt35zl7Z4rdnWbmsYrp883HlRv_9TjA1VdwGAbTGoBFlOkRsiJK1WVJJ7hq4ikuazj1uQXjfFwM')`,
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#131313] via-[#131313]/60 to-transparent" />
      </div>

      <main className="relative z-10 min-h-screen flex items-center justify-center px-5 md:px-10 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-120"
        >
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter italic uppercase text-[#d2f000]">
              Elevate
              <span className="bg-linear-to-r from-[#dfff00] to-[#00daf8] bg-clip-text text-transparent">
                X
              </span>
            </h1>
            <p className="text-sm text-[#c6c9ab] mt-2 tracking-widest uppercase">
              Uncompromising Performance
            </p>
          </div>

          <div className="bg-[#1e1e1e]/70 backdrop-blur-xl border border-white/10 rounded-xl p-8 md:p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#d2f000]/10 rounded-full blur-3xl group-hover:bg-[#d2f000]/20 transition-colors duration-500" />

            <div className="relative z-10">
              <h2 className="text-2xl font-semibold text-[#ffffff] mb-2">
                Join the Elite
              </h2>
              <p className="text-sm text-[#c6c9ab] mb-8">
                Initialize your high-performance credentials.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 relative border-b border-transparent focus-within:border-[#dfff00] transition-colors duration-300">
                    <label
                      className="text-xs font-semibold text-[#c6c9ab] uppercase ml-1"
                      htmlFor="full-name"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c6c9ab] text-[20px]" />
                      <input
                        className="w-full bg-[#0e0e0e] border-none rounded-lg py-4 pl-12 pr-4 text-[#e5e2e1] focus:ring-2 focus:ring-[#d2f000]/30 focus:shadow-[0_0_15px_rgba(223,255,0,0.2)] transition-all placeholder:text-[#353534] outline-none text-sm"
                        id="full-name"
                        name="full-name"
                        placeholder="Your name"
                        required
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 relative border-b border-transparent focus-within:border-[#dfff00] transition-colors duration-300">
                    <label
                      className="text-xs font-semibold text-[#c6c9ab] uppercase ml-1"
                      htmlFor="avatar-file"
                    >
                      Profile Avatar
                    </label>
                    <div className="relative">
                      <input
                        className="hidden"
                        id="avatar-file"
                        name="avatar-file"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <label
                        htmlFor="avatar-file"
                        className="w-full bg-[#0e0e0e] rounded-lg py-4 pl-12 pr-4 text-left transition-all placeholder:text-[#353534] cursor-pointer flex items-center group/file focus-within:ring-2 focus-within:ring-[#d2f000]/30 border-none"
                      >
                        <FiCamera className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c6c9ab] text-[20px] group-hover/file:text-white transition-colors" />
                        <span
                          className={`text-sm truncate select-none ${selectedFileName ? "text-[#e5e2e1]" : "text-[#353534]"}`}
                        >
                          {selectedFileName || "Choose Image"}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 relative border-b border-transparent focus-within:border-[#dfff00] transition-colors duration-300">
                  <label
                    className="text-xs font-semibold text-[#c6c9ab] uppercase ml-1"
                    htmlFor="email"
                  >
                    Work Email
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c6c9ab] text-[20px]" />
                    <input
                      className="w-full bg-[#0e0e0e] border-none rounded-lg py-4 pl-12 pr-4 text-[#e5e2e1] focus:ring-2 focus:ring-[#d2f000]/30 focus:shadow-[0_0_15px_rgba(223,255,0,0.2)] transition-all placeholder:text-[#353534] outline-none text-sm"
                      id="email"
                      name="email"
                      placeholder="name@elevatex.fit"
                      required
                      type="email"
                    />
                  </div>
                </div>

                <div className="space-y-2 relative border-b border-transparent focus-within:border-[#dfff00] transition-colors duration-300">
                  <label
                    className="text-xs font-semibold text-[#c6c9ab] uppercase ml-1"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c6c9ab] text-[20px]" />
                    <input
                      className="w-full bg-[#0e0e0e] border-none rounded-lg py-4 pl-12 pr-12 text-[#e5e2e1] focus:ring-2 focus:ring-[#d2f000]/30 focus:shadow-[0_0_15px_rgba(223,255,0,0.2)] transition-all placeholder:text-[#353534] outline-none text-sm"
                      id="password"
                      name="password"
                      placeholder="••••••••"
                      required
                      type={showPassword ? "text" : "password"}
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#c6c9ab] hover:text-white transition-colors"
                      type="button"
                    >
                      {showPassword ? (
                        <FiEyeOff className="text-lg" />
                      ) : (
                        <FiEye className="text-lg" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <input
                    className="mt-1 rounded bg-[#0e0e0e] border-none text-[#d2f000] focus:ring-0 focus:outline-none w-4 h-4 cursor-pointer"
                    id="terms"
                    name="terms"
                    required
                    type="checkbox"
                  />
                  <label
                    className="text-xs text-[#c6c9ab] leading-normal cursor-pointer"
                    htmlFor="terms"
                  >
                    I agree to the{" "}
                    <a
                      className="text-white hover:text-[#d2f000] underline underline-offset-2 transition-colors"
                      href="#"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      className="text-white hover:text-[#d2f000] underline underline-offset-2 transition-colors"
                      href="#"
                    >
                      Privacy Policy
                    </a>
                    .
                  </label>
                </div>

                <button
                  className="w-full bg-[#d2f000] text-[#191e00] font-semibold py-4 rounded-lg mt-4 flex items-center justify-center gap-2 hover:bg-[#00e0ff] active:scale-[0.98] transition-all group overflow-hidden relative disabled:opacity-70 cursor-pointer"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <AiOutlineLoading3Quarters className="animate-spin text-base" />
                      <span className="relative z-10">
                        INITIALIZING PROFILE...
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="relative z-10">CREATE ACCOUNT</span>
                      <GiBottledBolt className="relative z-10 group-hover:translate-x-1 transition-transform text-lg" />
                    </>
                  )}
                  <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out skew-x-12" />
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-[#c6c9ab]">
                  Already have an account?
                  <a
                    className="text-[#d2f000] font-semibold hover:underline underline-offset-4 decoration-2 transition-all ml-1"
                    href="#"
                  >
                    Sign In
                  </a>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
