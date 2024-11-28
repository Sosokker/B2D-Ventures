import Link from "next/link";
import { Table, TableHeader, TableRow, TableCell, TableBody, TableHead } from "@/components/ui/table";

interface Business {
  id: any;
  location: any;
  business_name: any;
  business_type: any;
  joined_date: any;
  user_id: number;
  username: string;
  full_name: string;
  email: string;
}

interface BusinessTableProps {
  businesses: Business[] | null;
}

const BusinessTable = ({ businesses }: BusinessTableProps) => {
  if (!businesses) return <div>No data available</div>;

  return (
    <div>
      <Table className="min-w-full border-2 border-border">
        <TableHeader>
          <TableRow>
            <TableHead>Business Name</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Business Type</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Joined Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {businesses.map((business) => (
            <TableRow key={business.id}>
              <TableCell>
                <Link href={`/admin/business/${business.id}/projects`}>
                  <p className="text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-700 border border-transparent hover:border-blue-300 rounded-md px-2 py-1 cursor-pointer transition duration-200">
                    {business.business_name}
                  </p>
                </Link>
              </TableCell>
              <TableCell>
                <Link href={`/profile/${business.user_id}`}>
                  <p className="text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-700 border border-transparent hover:border-blue-300 rounded-md px-2 py-1 cursor-pointer transition duration-200">
                    {business.username}
                  </p>
                </Link>
              </TableCell>
              <TableCell>{business.business_type}</TableCell>
              <TableCell>{business.location}</TableCell>
              <TableCell>{new Date(business.joined_date).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BusinessTable;
