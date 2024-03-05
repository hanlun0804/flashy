"use client";

import { useRouter } from "next/navigation";
import { getAdmins } from "@/actions/admin-actions";
import { AdminTable } from "@/components/adminpanel/admintable";
import { columns } from "@/components/adminpanel/columns";
import { useQuery } from "@tanstack/react-query";
import { setUserType } from "@/actions/admin-actions";
import CreateAdminDialog from "@/components/adminpanel/new-admin-dialog";
import { Toaster } from "@/components/ui/toaster";

const adminpanel = () => {
  const { data: admins } = useQuery({
    queryKey: ["admins"],
    queryFn: () => getAdmins(),
  });

  console.log(admins);

  if (!admins) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen px-20">
        <div>
          <AdminTable columns={columns} data={admins} />
        </div>

        <div>
          <div className="mt-8 justify-center">
            <CreateAdminDialog />
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default adminpanel;
