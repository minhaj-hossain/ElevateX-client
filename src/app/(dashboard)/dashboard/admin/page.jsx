import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const AdminDashboard = async () => {
  // const data = await auth.api.getSession({
  //   headers: await headers(),
  // });

  console.log(data);

  return <div>this is admin dashboard</div>;
};

export default AdminDashboard;
