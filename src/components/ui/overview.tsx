"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, LineChart, Line } from "recharts";

interface OverViewProps {
  graphType: string;
  graphData: Record<string, number>; // Object with month-year as keys and sum as value
}

export function Overview(props: OverViewProps) {
    // Transform the grouped data into the format for the chart
    const chartData = Object.entries(props.graphData).map(([monthYear, totalArray]) => ({
      name: monthYear,
      total: totalArray, // Get the total amount for the month
    }));

    return (
        <ResponsiveContainer width="100%" height={350}>
          {props.graphType === 'line' ? (
            <LineChart data={chartData}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Line
                dataKey="total"
                fill="currentColor"
                className="fill-primary"
              />
            </LineChart>
          ) : (
            <BarChart data={chartData}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Bar
                dataKey="total"
                fill="currentColor"
                className="fill-primary"
              />
            </BarChart>
          )}
        </ResponsiveContainer>
    );
}
