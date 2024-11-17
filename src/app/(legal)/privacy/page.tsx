"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import TableOfContent from "../Toc";
import { NavSidebar } from "../NavigationSidebar";

const PrivacyPolicy = () => {
  const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "data-collection", title: "Data Collection" },
    { id: "data-usage", title: "Data Usage" },
    { id: "data-sharing", title: "Data Sharing" },
    { id: "data-security", title: "Data Security" },
    { id: "user-rights", title: "User Rights" },
    { id: "changes", title: "Changes to Privacy Policy" },
    { id: "contact", title: "Contact Information" },
  ];

  return (
    <div className="container max-w-screen-xl flex mt-5">
      <div className="flex gap-2">
        <NavSidebar />
        <TableOfContent sections={sections} />
      </div>

      <div className="flex-1 ml-4">
        <Card className="w-full max-w-3xl bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-3xl text-blue-600 dark:text-blue-400">Privacy Policy</CardTitle>
            <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
              Last Updated: November 17, 2024
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert text-gray-800 dark:text-gray-200">
              <p>
                This Privacy Policy (&quot;Policy&quot;) describes how we collect, use, and share your personal
                information when you access and use our Website.
              </p>

              <h2 id="introduction">1. Introduction</h2>
              <p>
                We value your privacy. This Policy explains how we collect, use, and protect your personal data when you
                use our services.
              </p>

              <h2 id="data-collection">2. Data Collection</h2>
              <p>
                We collect various types of information when you use our Website, including personal information,
                technical data, and usage data. This includes your name, email address, IP address, and device
                information.
              </p>

              <h2 id="data-usage">3. Data Usage</h2>
              <p>
                The data we collect is used to improve our services, personalize your experience, and ensure the
                functionality of our Website. We may also use your data for marketing purposes and to communicate with
                you.
              </p>

              <h2 id="data-sharing">4. Data Sharing</h2>
              <p>
                We do not sell your personal data to third parties. However, we may share your data with trusted
                partners for the purpose of providing our services, complying with legal obligations, or protecting our
                rights.
              </p>

              <h2 id="data-security">5. Data Security</h2>
              <p>
                We take reasonable measures to secure your personal data and protect it from unauthorized access,
                alteration, disclosure, or destruction. However, no data transmission over the Internet can be
                guaranteed as 100% secure.
              </p>

              <h2 id="user-rights">6. User Rights</h2>
              <p>
                You have the right to access, update, or delete your personal information. You may also object to the
                processing of your data or request a restriction on how we process your data.
              </p>

              <h2 id="changes">7. Changes to Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Any changes will be posted on this page, and the
                updated date will be reflected at the top of the page. We encourage you to review this Policy regularly.
              </p>

              <h2 id="contact">8. Contact Information</h2>
              <p>
                If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us
                at privacy@b2dventure.com.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center"></CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
