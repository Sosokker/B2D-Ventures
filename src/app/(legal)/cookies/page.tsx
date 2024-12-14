"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import TableOfContent from "../Toc";
import { NavSidebar } from "../NavigationSidebar";

const UseOfCookies = () => {
  const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "what-are-cookies", title: "What Are Cookies?" },
    { id: "types-of-cookies", title: "Types of Cookies We Use" },
    { id: "why-we-use-cookies", title: "Why We Use Cookies" },
    { id: "managing-cookies", title: "Managing Your Cookie Preferences" },
    { id: "third-party-cookies", title: "Third-Party Cookies" },
    { id: "changes", title: "Changes to Cookie Policy" },
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
            <CardTitle className="text-3xl text-blue-600 dark:text-blue-400">Use of Cookies</CardTitle>
            <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
              Last Updated: November 17, 2024
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert text-gray-800 dark:text-gray-200">
              <h2 id="introduction">1. Introduction</h2>
              <p>
                Our Website uses cookies to improve functionality, analyze performance, and personalize your experience.
                This policy explains what cookies are, how we use them, and your options for managing them.
              </p>

              <h2 id="what-are-cookies">2. What Are Cookies?</h2>
              <p>
                Cookies are small text files stored on your device when you visit a website. They help the website
                remember your preferences, improve functionality, and provide analytical insights.
              </p>

              <h2 id="types-of-cookies">3. Types of Cookies We Use</h2>
              <ul>
                <li>
                  <span className="font-bold">Essential Cookies </span>Required for the core functionality of the
                  Website, such as navigating pages and accessing secure areas.
                </li>
                <li>
                  <span className="font-bold">Analytics Cookies </span>
                  Collect data on user behavior to improve Website performance and user experience.
                </li>
                <li>
                  <span className="font-bold">Personalization Cookies </span>Tailor content and features to match your
                  preferences.
                </li>
              </ul>

              <h2 id="why-we-use-cookies">4. Why We Use Cookies</h2>
              <span>
                We use cookies to:
                <ul>
                  <li>Ensure the Website functions properly.</li>
                  <li>Understand and analyze user behavior.</li>
                  <li>Provide a personalized browsing experience.</li>
                  <li>Deliver relevant advertisements and content.</li>
                </ul>
              </span>

              <h2 id="managing-cookies">5. Managing Your Cookie Preferences</h2>
              <p>
                You can manage or disable cookies through your browser settings. Note that disabling cookies may affect
                your experience on our Website. For detailed instructions, refer to your browser&apos;s help section.
              </p>

              <h2 id="third-party-cookies">6. Third-Party Cookies</h2>
              <p>
                Some cookies are set by third-party services we use, such as analytics or advertising platforms. These
                cookies are subject to the policies of the respective third parties.
              </p>

              <h2 id="changes">7. Changes to Cookie Policy</h2>
              <p>
                We may update this cookie policy periodically to reflect changes in technology or legal requirements.
                Any updates will be posted on this page with the updated date.
              </p>

              <h2 id="contact">8. Contact Information</h2>
              <p>For questions about this policy or to exercise your rights, contact us at privacy@b2dventure.com.</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center"></CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default UseOfCookies;
