"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import TableOfContent from "../Toc";
import { NavSidebar } from "../NavigationSidebar";

const InvestmentRisks = () => {
  const sections = [
    { id: "investment-risk", title: "Investment Risk" },
    { id: "business-closure", title: "Business Closure" },
    { id: "no-return", title: "No Return on Investment" },
    { id: "market-conditions", title: "Market Conditions" },
    { id: "regulatory-risk", title: "Regulatory Risk" },
    { id: "liquidity-risk", title: "Liquidity Risk" },
    { id: "economic-factors", title: "Economic Factors" },
    { id: "mitigation-strategies", title: "Mitigation Strategies" },
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
            <CardTitle className="text-3xl text-blue-600 dark:text-blue-400">Investment Risks</CardTitle>
            <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
              Last Updated: November 17, 2024
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert text-gray-800 dark:text-gray-200">
              <p>
                Investing in opportunities through our platform carries inherent risks. It is important that you fully
                understand these risks before proceeding with any investment. This page outlines some of the potential
                risks associated with investing in businesses listed on our platform.
              </p>

              <h2 id="investment-risk">1. Investment Risk</h2>
              <p>
                All investments carry risk. The value of your investment may fluctuate, and there is a possibility that
                you could lose the entire amount invested. You should only invest money that you can afford to lose.
              </p>

              <h2 id="business-closure">2. Business Closure</h2>
              <p>
                The businesses listed on our platform may face financial difficulties or other challenges that could
                lead to their closure. In the event of a business closing, investors may lose their entire investment,
                and there may be no recourse for recovering the invested funds.
              </p>

              <h2 id="no-return">3. No Return on Investment</h2>
              <p>
                While some businesses may generate returns, there is no guarantee that you will receive a return on your
                investment. If a business does not succeed or fails to generate profits, you may not receive any return
                on your investment.
              </p>

              <h2 id="market-conditions">4. Market Conditions</h2>
              <p>
                Economic and market conditions can affect the success of a business. Factors such as changes in demand,
                competition, or overall market downturns can negatively impact the business’s ability to generate
                revenue and, consequently, affect your investment return.
              </p>

              <h2 id="regulatory-risk">5. Regulatory Risk</h2>
              <p>
                Changes in laws or regulations could affect the operations of a business and impact its ability to
                operate successfully. Businesses may face additional compliance costs or regulatory restrictions, which
                can negatively impact their profitability and the value of your investment.
              </p>

              <h2 id="liquidity-risk">6. Liquidity Risk</h2>
              <p>
                Investment opportunities on our platform may lack liquidity. This means you may not be able to easily
                sell or exit your investment when you wish. The inability to quickly liquidate an investment may impact
                your ability to access your funds.
              </p>

              <h2 id="economic-factors">7. Economic Factors</h2>
              <p>
                Broader economic factors, such as inflation, unemployment, and interest rates, can influence business
                performance and impact your investment. Negative economic shifts can lead to a decline in investment
                value.
              </p>

              <h2 id="mitigation-strategies">8. Mitigation Strategies</h2>
              <p>
                While we cannot eliminate all risks, we recommend conducting thorough due diligence before investing.
                Additionally, diversifying your investment portfolio and staying informed about market trends and
                business performance can help mitigate some of these risks.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center"></CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default InvestmentRisks;
