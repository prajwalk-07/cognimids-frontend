"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/context/AuthContext";
function UsersTable() {
  const router = useRouter();

  const { token, role } = useContext(AuthContext);
  const [loadedUsers, setLoadedUsers] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    if (role !== "Admin") {
      setUnauthorized(true);
      // Redirect after 5 seconds
      const timer = setTimeout(() => {
        router.push("/");
      }, 5000);
      
      return () => clearTimeout(timer);
    }

    const fetchLogs = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setLoadedUsers(response.data.user);
      } catch (error) {
        console.error("Error fetching Users:", error);
        if (error.response?.status === 401) {
          router.push("/login");
        }
      }
    };

    fetchLogs();
  }, [token, role, router]);

  if (unauthorized) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-red-500 mb-4">
          You are not Authorized to View this page
        </h1>
        <p className="text-gray-400">
          Redirecting back to Home page in 5 seconds...
        </p>
      </div>
    );
  }
  const filteredUsers = loadedUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      user.email.toLowerCase().includes(searchUser.toLowerCase()) ||
      user.userId.toLowerCase().includes(searchUser.toLowerCase())
  );
  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-2 p-5">
        <Input
          placeholder="Search users..."
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent ">
            <TableHead>userID</TableHead>
            <TableHead>Name </TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <TableRow
                key={user.userId}
                onClick={() =>
                  router.push(`/${user.userId.split("#")[1]}/logs`)
                }
                className="cursor-pointer hover:bg-zinc-900"
              >
                <TableCell>{user.userId}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-gray-500">
                No users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
export default UsersTable;
