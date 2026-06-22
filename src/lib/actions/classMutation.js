"use server";

export const postClass = async (data) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/classes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};
