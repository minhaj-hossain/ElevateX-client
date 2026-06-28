"use client";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { MdTimer, MdAttachMoney } from "react-icons/md";

export default function EditClass() {
  const params = useParams();
  const classId = params?.classId;

  const router = useRouter();

  // Single source of truth for form data based on database schema
  const [formData, setFormData] = useState({
    name: "",
    category: "Yoga",
    difficulty: "Beginner",
    description: "",
    duration: 0,
    price: 0,
    startTime: "",
    endTime: "",
    image: "",
    schedule: [],
  });

  // Fetch data on mount and update state
  useEffect(() => {
    if (!classId) return;

    const fetchClassData = async () => {
      const { data: tokenData } = await authClient.token();

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/getClass/${classId}`,
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${tokenData?.token}`,
            },
          },
        );
        const data = await response.json();
        if (data) {
          // Fill state with DB data or fallback to defaults if blank
          setFormData({
            name: data.name || "",
            category: data.category || "Yoga",
            difficulty: data.difficulty || "Beginner",
            description: data.description || "",
            duration: data.duration || 0,
            price: data.price || 0,
            startTime: data.startTime || "",
            endTime: data.endTime || "",
            image: data.image || "https://i.ibb.co/spGHsw6r/OIP.jpg",
            schedule: data.schedule || [],
          });
        }
      } catch (error) {
        console.error("Error fetching class data:", error);
      }
    };

    fetchClassData();
  }, [classId]);

  // Generic change handler for standard inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Toggles 3-letter day codes matching the DB array format
  const toggleDay = (day) => {
    setFormData((prev) => {
      const updatedSchedule = prev.schedule.includes(day)
        ? prev.schedule.filter((d) => d !== day)
        : [...prev.schedule, day];
      return { ...prev, schedule: updatedSchedule };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data: tokenData } = await authClient.token();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/updateClass/${classId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${tokenData?.token}`,
          },
          body: JSON.stringify(formData),
        },
      );
      const result = await response.json();
      console.log("Class updated successfully:", result);
      router.push("/dashboard/trainer/my-classes");
    } catch (error) {
      console.error("Error updating class data:", error);
    }
  };

  console.log(formData.image);

  return (
    <div className="bg-[#131313] text-[#e5e2e1] min-h-screen p-10 flex justify-center items-center">
      <main className="w-full max-w-5xl bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md shadow-xl">
        {/* Dynamic Header Block */}
        <div className="mb-8 flex items-center gap-6 bg-black/20 p-4 rounded-xl border border-white/5">
          {formData.image && (
            <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
              <Image
                src={formData.image}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <span className="text-xs bg-[#d2f000] text-[#191e00] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Live Configuration
            </span>
            <h1 className="text-2xl font-bold text-white mt-1">
              {formData.name || "Unnamed Class"} ({formData.category})
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1: Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#c6c9ab] uppercase mb-1">
                  Class Title / Instructor
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#d2f000] outline-none"
                  placeholder="e.g. Emma W"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#c6c9ab] uppercase mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#d2f000] outline-none"
                  >
                    <option value="Cardio">Cardio</option>
                    <option value="Strength">Strength</option>
                    <option value="Yoga">Yoga</option>
                    <option value="Recovery">Recovery</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#c6c9ab] uppercase mb-1">
                    Difficulty
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#d2f000] outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#c6c9ab] uppercase mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#d2f000] outline-none"
                />
              </div>
            </div>

            {/* Column 2: Logistics */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#c6c9ab] uppercase mb-1">
                    Duration (min)
                  </label>
                  <div className="relative flex items-center">
                    <MdTimer className="absolute left-3 text-[#c6c9ab]" />
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl pl-9 pr-4 py-3 text-white focus:border-[#d2f000] outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#c6c9ab] uppercase mb-1">
                    Price ($)
                  </label>
                  <div className="relative flex items-center">
                    <MdAttachMoney className="absolute left-3 text-[#c6c9ab]" />
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl pl-9 pr-4 py-3 text-white focus:border-[#d2f000] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#c6c9ab] uppercase mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#d2f000] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#c6c9ab] uppercase mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#d2f000] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Select Blocks */}
          <div className="bg-black/20 border border-white/5 p-4 rounded-xl">
            <label className="text-xs font-bold text-[#c6c9ab] uppercase block mb-2">
              Weekly Routine ({formData.schedule.length} days active)
            </label>
            <div className="flex flex-wrap gap-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
                const isSelected = formData.schedule.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-4 py-2 rounded-xl font-semibold text-xs tracking-wide transition-all border ${
                      isSelected
                        ? "bg-[#d2f000] text-[#191e00] border-[#d2f000]"
                        : "bg-[#1c1b1b] border-white/10 text-[#c6c9ab] hover:border-[#d2f000]"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description Textarea */}
          <div>
            <label className="block text-xs font-bold text-[#c6c9ab] uppercase mb-1">
              Class Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#d2f000] outline-none resize-none"
              placeholder="Provide clean instructions details..."
            />
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              className="px-6 py-2.5 rounded-full border border-white/20 text-sm font-bold text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 rounded-full bg-[#d2f000] text-[#191e00] text-sm font-bold shadow-lg transition-all hover:opacity-90"
            >
              Save Changes
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
