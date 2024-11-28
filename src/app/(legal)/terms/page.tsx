"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import TableOfContent from "../Toc";
import { NavSidebar } from "../NavigationSidebar";

const TermsOfService = () => {
  const sections = [
    { id: "eligibility", title: "Eligibility" },
    { id: "user-accounts", title: "User Accounts" },
    { id: "user-content", title: "User Content" },
    { id: "investment-activity", title: "Investment Activity" },
    { id: "disclaimers", title: "Disclaimers" },
    { id: "limitation-of-liability", title: "Limitation of Liability" },
    { id: "indemnification", title: "Indemnification" },
    { id: "termination", title: "Termination" },
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
            <CardTitle className="text-3xl text-blue-600 dark:text-blue-400">Terms of Service</CardTitle>
            <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
              Last Updated: November 17, 2024
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert text-gray-800 dark:text-gray-200">
              <p>
                These Terms of Service (&quot;Terms&quot;) govern your access to and use of the Website, which is owned
                and operated by B2DVenture Company LLC (&quot;B2DVenture&quot;, &quot;we&quot;, &quot;us&quot;, or
                &quot;our&quot;).
              </p>

              <h2 id="eligibility">1. Eligibility</h2>
              <p>
                You must be at least 18 years old and have the legal capacity to enter into a binding agreement in order
                to use the Website. You may not access or use the Website if you are not qualified.
              </p>

              <h2 id="user-accounts">2. User Accounts</h2>
              <p>
                In order to access certain features of the Website, such as uploading investment opportunities or making
                investments, you may be required to create an account.
              </p>
              <p>
                You are responsible for maintaining the confidentiality of your account information, including your
                username and password. You are also responsible for all activity that occurs under your account.
              </p>

              <h2 id="user-content">3. User Content</h2>
              <p>
                The Website allows users to upload content, including images, videos, and text (collectively, &quot;User
                Content&quot;). You retain all ownership rights in your User Content. However, by uploading User Content
                to the Website, you grant B2DVenture a non-exclusive, royalty-free, worldwide license to use, reproduce,
                modify, publish, and distribute your User Content in connection with the Website and our business.
              </p>

              <h2 id="investment-activity">4. Investment Activity</h2>
              <p>
                The Website is a platform that connects businesses seeking funding (the &quot;Issuers&quot;) with
                potential investors (the &quot;Investors&quot;). B2DVenture does not act as a financial advisor, broker,
                or dealer. We do not recommend or endorse any particular investment opportunity.
              </p>

              <h2 id="disclaimers">5. Disclaimers</h2>
              <p>
                The Website and the information contained herein are provided for informational purposes only and should
                not be considered as investment advice.
              </p>

              <h2 id="limitation-of-liability">6. Limitation of Liability</h2>
              <p>
                B2DVenture shall not be liable for any damages arising out of or in connection with your use of the
                Website, including but not limited to, direct, indirect, incidental, consequential, or punitive damages.
              </p>

              <h2 id="indemnification">7. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless B2DVenture, its officers, directors, employees, agents, and
                licensors from and against any and all claims, demands, losses, liabilities, costs, or expenses
                (including attorneys&quot; fees) arising out of or in connection with your use of the Website or your
                violation of these Terms.
              </p>

              <h2 id="termination">8. Termination</h2>
              <p>
                We may terminate your access to the Website for any reason, at any time, without notice. This includes
                if you violate any of these Terms, or if we believe that your use of the Website is harmful to us or to
                any other user.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center"></CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;
