import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BusinessCard } from "@/components/BusinessCard";
import { BusinessCardProps } from "@/types/BusinessCard";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface BusinessSectionProps extends BusinessCardProps {
  user_id: string;
}

export function BusinessSection({ businessData }: { businessData: BusinessSectionProps[] }) {
  if (!businessData || businessData.length === 0) {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle>No Business Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Sorry, we could not find any businesses matching your search criteria.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div id="project-card">
        <Card>
          <CardHeader>
            <CardTitle>Businesses</CardTitle>
            <CardDescription>Found {businessData.length} projects!</CardDescription>
          </CardHeader>
          <Separator className="my-3" />
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {businessData.map((business) => (
                <div key={business.business_id}>
                  <Link href={`/profile/${business.user_id}`}>
                    <BusinessCard
                      business_id={business.business_id}
                      business_name={business.business_name}
                      joined_date={business.joined_date}
                      location={business.location}
                      business_type={business.business_type}
                    />
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
