"use server";

export const getClasses = async (query, id) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CLIENT_URL}/api/get-classes?${query}&id=${id}`,
  );
  return res.json();
};
