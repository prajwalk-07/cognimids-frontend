"use client";
import { useFingerprint } from '@/app/context/fingerPrint';
import { useContext, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { AuthContext } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

function UserSignup() {
  const { fingerprintId, isScanning, error: sensorError, getFingerprintData, clearFingerprint } = useFingerprint();
  const [unauthorized, setUnauthorized] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { role, token } = useContext(AuthContext);

  // Check if the user is an admin on component mount
  useEffect(() => {
    if (role !== "Admin") {
      setUnauthorized(true);
      const timer = setTimeout(() => {
        router.push("/"); // Redirect to home or login page
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [role, router]);

  const handleScanFingerprint = async () => {
    console.log("Requesting fingerprint scan...");
    try {
      const id = await getFingerprintData();
      if (id) {
        setSuccess("Fingerprint scanned successfully!");
      } else {
        setError("Failed to scan fingerprint");
      }
    } catch (err) {
      console.error("Scan error:", err);
      setError("Failed to connect to ESP32");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!fingerprintId) {
      setError("Please scan a fingerprint first");
      return;
    }

    const formData = new FormData(event.target);
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/create-user`,
        {
          userId: formData.get("userId"),
          name: formData.get("name"),
          email: formData.get("email"),
          password: formData.get("password"),
          fingerprintId, // Send fingerprintId to backend
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        setSuccess("User created successfully!");
        clearFingerprint();
        setTimeout(() => {
          router.push("/admin/dashboard"); // Redirect to admin dashboard after success
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create user");
    } finally {
      setIsLoading(false);
    }
  };

  // If unauthorized, show message and redirect
  if (unauthorized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-[350px] bg-black text-white border-zinc-800 text-center">
          <CardHeader>
            <CardTitle>Unauthorized Access</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You are not authorized to view this page. Redirecting in 5 seconds...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="w-[350px] bg-black text-white border-zinc-800 text-center mx-auto flex mt-20">
      <CardHeader>
        <CardTitle>Create New User</CardTitle>
      </CardHeader>
      <CardContent>
      <form onSubmit={handleSubmit}>
  <div className="grid w-full items-center gap-4">
    {/* User ID Field */}
    <div className="flex flex-col space-y-1.5">
      <Label htmlFor="userId">User ID</Label>
      <Input
        id="userId"
        name="userId"
        placeholder="Enter UserID"
        className="border-zinc-800 focus:border-zinc-600"
        required
      />
    </div>

    {/* Name Field */}
    <div className="flex flex-col space-y-1.5">
      <Label htmlFor="name">Name</Label>
      <Input
        id="name"
        name="name"
        placeholder="Enter Name"
        className="border-zinc-800 focus:border-zinc-600"
        required
      />
    </div>

    {/* Email Field */}
    <div className="flex flex-col space-y-1.5">
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        name="email"
        type="email"
        placeholder="Enter Email"
        className="border-zinc-800 focus:border-zinc-600"
        required
      />
    </div>

    {/* Password Field */}
    <div className="flex flex-col space-y-1.5">
      <Label htmlFor="password">Password</Label>
      <Input
        id="password"
        name="password"
        type="password"
        placeholder="Enter Password"
        className="border-zinc-800 focus:border-zinc-600"
        required
      />
    </div>

    {/* Fingerprint Field */}
    <div className="flex flex-col space-y-1.5">
      <Label htmlFor="fingerPrintId">Fingerprint</Label>
      <div className="relative">
        <Input
          id="fingerPrintId"
          name="fingerPrintId"
          value={fingerprintId || ""}
          placeholder={isScanning ? "Place finger on sensor..." : "Click 'Scan Fingerprint' to begin"}
          className="border-zinc-800 pr-20"
          readOnly
        />
        {fingerprintId && (
          <button
            type="button"
            onClick={clearFingerprint}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>
      <Button
        type="button"
        onClick={handleScanFingerprint}
        disabled={isScanning}
        className="bg-zinc-700 hover:bg-zinc-600"
      >
        {isScanning ? "Scanning..." : "Scan Fingerprint"}
      </Button>
      {sensorError && (
        <div className="text-red-500 text-sm">
          {sensorError}
        </div>
      )}
    </div>

    {/* Error Message */}
    {error && (
      <div className="text-red-500 text-sm mt-2 p-2 border border-red-500 rounded">
        {error}
      </div>
    )}

    {/* Success Message */}
    {success && (
      <div className="text-green-500 text-sm mt-2 p-2 border border-green-500 rounded">
        User created successfully! Redirecting...
      </div>
    )}

    {/* Submit Button */}
    <Button
      type="submit"
      className="bg-zinc-800 text-white hover:bg-zinc-700 border-zinc-800 border-1"
      disabled={isLoading || !fingerprintId}
    >
      {isLoading ? "Creating..." : "Create User"}
    </Button>
  </div>
</form>
      </CardContent>
    </Card>
  );
}

export default UserSignup;