"use client";

import { useState } from "react";
import { uploadImageToImgBB } from "@/utils/uploadImage";
import { FaCloudUploadAlt, FaBolt } from "react-icons/fa";
import Image from "next/image";
import { postClass } from "@/lib/actions/classMutation";
import { authClient } from "@/lib/auth-client";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function AddClassPage() {
  const [selectedDays, setSelectedDays] = useState(["Tue", "Thu"]);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession();

  const trainerId = session?.user?.id;

  const handleImagePreview = (file) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUploading(true);

      const form = e.target;

      const imageFile = form.image.files[0];

      let imageUrl = "";

      if (imageFile) {
        imageUrl = await uploadImageToImgBB(imageFile);
      }

      const classData = {
        name: form.name.value,
        category: form.category.value,
        difficulty: form.difficulty.value,
        description: form.description.value,
        duration: Number(form.duration.value),
        price: Number(form.price.value),
        startTime: form.startTime.value,
        endTime: form.endTime.value,
        image: imageUrl,
        schedule: selectedDays,
        trainerId: trainerId,
      };

      const res = await postClass(classData);

      console.log(res);

      alert("Class Created Successfully");

      form.reset();
      setPreview(null);
      setSelectedDays([]);
    } catch (error) {
      console.error(error);
      alert("Image Upload Failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#131313] text-white p-4 md:p-6 lg:p-8">
      <div className="max-w-full mx-auto">
        {/* HEADER */}

        <div className="mb-8">
          <p className="text-[#D2F000] uppercase tracking-[3px] text-xs font-bold">
            New Training Asset
          </p>

          <h1 className="text-3xl md:text-5xl font-black mt-2">
            Elevate the{" "}
            <span className="text-[#D2F000] italic">Standards.</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* LEFT COLUMN */}

            <div className="lg:col-span-2 space-y-6">
              {/* CLASS DNA */}

              <div className="bg-[#1C1B1B] border border-white/5 rounded-3xl p-6">
                <h2 className="text-xl font-bold mb-1">Class DNA</h2>

                <p className="text-sm text-[#C6C9AB] mb-6">
                  Define the core identity of your workout session.
                </p>

                <div className="space-y-5">
                  <div>
                    <label className="text-xs text-[#C6C9AB] uppercase">
                      Class Name
                    </label>

                    <input
                      name="name"
                      required
                      className="w-full mt-2 bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#D2F000]"
                      placeholder="e.g. Kettlebell Vortex"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#C6C9AB] uppercase">
                        Category
                      </label>

                      <select
                        name="category"
                        className="w-full mt-2 bg-black border border-white/10 rounded-xl px-4 py-3"
                      >
                        <option>Yoga</option>
                        <option>Cardio</option>
                        <option>Strength</option>
                        <option>HIIT</option>
                        <option>Mindfulness</option>
                        <option>Hypertrophy</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-[#C6C9AB] uppercase">
                        Difficulty
                      </label>

                      <select
                        name="difficulty"
                        className="w-full mt-2 bg-black border border-white/10 rounded-xl px-4 py-3"
                      >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-[#C6C9AB] uppercase">
                      Description
                    </label>

                    <textarea
                      name="description"
                      rows={5}
                      className="w-full mt-2 bg-black border border-white/10 rounded-xl px-4 py-3 resize-none"
                      placeholder="Describe the energy, the challenge, and the results..."
                    />
                  </div>
                </div>
              </div>

              {/* SESSION LOGISTICS */}

              <div className="bg-[#1C1B1B] border border-white/5 rounded-3xl p-6">
                <h2 className="text-xl font-bold">Session Logistics</h2>
                <p className="text-sm text-[#C6C9AB] mb-6">
                  Manage scheduling and technical details.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-xs uppercase text-[#C6C9AB]">
                      Duration
                    </label>

                    <div className="relative">
                      <input
                        name="duration"
                        type="number"
                        className="w-full mt-2 bg-black border border-white/10 rounded-xl px-4 py-3"
                      />

                      <span className="absolute right-4 top-1/2 text-xs text-[#C6C9AB]">
                        MIN
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs uppercase text-[#C6C9AB]">
                      Price
                    </label>

                    <div className="relative">
                      <input
                        name="price"
                        type="number"
                        className="w-full mt-2 bg-black border border-white/10 rounded-xl px-4 py-3"
                      />

                      <span className="absolute right-4 top-1/2 text-xs text-[#C6C9AB]">
                        $
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs uppercase text-[#C6C9AB]">
                    Weekly Schedule
                  </label>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {days.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                          selectedDays.includes(day)
                            ? "bg-[#D2F000] text-black"
                            : "bg-black text-[#C6C9AB]"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6 mt-9">
                  <div>
                    <label className="text-xs uppercase text-[#C6C9AB]">
                      Start Time
                    </label>

                    <div className="relative">
                      <input
                        name="startTime"
                        type="time"
                        className="bg-black border border-white/10 rounded-xl px-4 py-3 w-full mt-2"
                      />

                      {/* <span className="absolute right-4 top-1/2 text-xs text-[#C6C9AB]">
                        MIN
                      </span> */}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs uppercase text-[#C6C9AB]">
                      End Time
                    </label>

                    <div className="relative">
                      <input
                        name="endTime"
                        type="time"
                        className="bg-black border border-white/10 rounded-xl px-4 py-3 w-full mt-2"
                      />

                      {/* <span className="absolute right-4 top-1/2 text-xs text-[#C6C9AB]">
                        $
                      </span> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}

            <div className="space-y-6">
              {/* VISUAL HOOK */}

              <div className="bg-[#1C1B1B] border border-white/5 rounded-3xl p-6">
                <h2 className="font-bold text-xl mb-5">Visual Hook</h2>

                <label className="cursor-pointer">
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    hidden
                    onChange={(e) => handleImagePreview(e.target.files[0])}
                  />

                  <div className="border-2 border-dashed border-white/10 rounded-2xl h-64 flex flex-col items-center justify-center overflow-hidden">
                    {preview ? (
                      <div className="relative w-full h-64">
                        <Image
                          src={preview}
                          alt="Preview"
                          fill
                          className="object-cover rounded-2xl"
                        />
                      </div>
                    ) : (
                      <>
                        <FaCloudUploadAlt
                          size={40}
                          className="text-[#D2F000]"
                        />

                        <p className="text-sm text-center mt-3 text-[#C6C9AB]">
                          Upload Class Banner
                        </p>
                      </>
                    )}
                  </div>
                </label>
              </div>

              {/* TIP CARD */}

              <div className="bg-[#1C1B1B] border-l-4 border-[#00E0FF] rounded-3xl p-5">
                <div className="flex gap-3">
                  <FaBolt className="text-[#00E0FF] mt-1" />

                  <div>
                    <h3 className="font-bold mb-2">Efficiency Tip</h3>

                    <p className="text-sm text-[#C6C9AB]">
                      Classes with high-quality imagery and clear descriptions
                      perform significantly better.
                    </p>
                  </div>
                </div>
              </div>

              {/* BUTTONS */}

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-[#D2F000] text-black font-black py-5 rounded-2xl hover:scale-[1.02] transition-all"
              >
                {uploading ? "UPLOADING..." : "DEPLOY CLASS"}
              </button>

              <button
                type="button"
                className="w-full border border-white/10 py-4 rounded-2xl text-[#C6C9AB]"
              >
                Save as Draft
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
