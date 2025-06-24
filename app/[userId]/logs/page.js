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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {  useEffect, useState,use } from "react";
import axios from "axios";
function TableDemo({ params }) {
  const [loadedLogs, setLoadedLogs] = useState({logs:[]});
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
const {userId} = use(params);
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${userId}/getLogs`);
        setLoadedLogs(response.data);
        console.log("Fetched data:", response.data);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    fetchLogs();
  }, []);
  const filteredLogs = loadedLogs.logs?.filter((log) => {
    const logDate = new Date(log.date);
    return logDate.getMonth().toString() === selectedMonth && 
           logDate.getFullYear().toString() === selectedYear;
  })||[];
  return (
     <div className="space-y-4">
      <div className="flex justify-center gap-2 p-5">
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {[
              "January", "February", "March", "April",
              "May", "June", "July", "August",
              "September", "October", "November", "December"
            ].map((month, index) => (
              <SelectItem key={index} value={index.toString()}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {[
              new Date().getFullYear(),
              new Date().getFullYear() - 1,
              new Date().getFullYear() - 2
            ].map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

    <Table>
      <TableHeader>
        <TableRow   className="hover:bg-transparent ">
          <TableHead>Date</TableHead>
          <TableHead>Check-In </TableHead>
          <TableHead>Check-Out</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredLogs?.map((log) => (
          <TableRow key={log.date}>
            <TableCell>{log.date}</TableCell>
            <TableCell>
              {log.checkIn ? new Date(log.checkIn).toLocaleTimeString() : '-'}
            </TableCell>
            <TableCell>
              {log.checkOut ? new Date(log.checkOut).toLocaleTimeString() : '-'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    {filteredLogs.length === 0 && (
        <div className="text-center text-gray-500 py-4">
          No logs found for selected month and year
        </div>
      )}
    </div>
  );
}
export default TableDemo;
