import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserX, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center">
              <UserX className="h-8 w-8 text-slate-600" />
            </div>
          </div>
          <CardTitle className="text-xl">Profile Not Found</CardTitle>
          <CardDescription>
            We could not find the profile you are looking for.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-sm text-slate-600">
          <p>The profile may have been deleted or you might not have permission to view it.</p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}