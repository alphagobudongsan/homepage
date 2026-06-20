"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ComposedChart,
} from "recharts";

interface PriceDataPoint {
  month: string;
  [key: string]: number | string;
}

interface PriceChartProps {
  data: PriceDataPoint[];
  lines: { key: string; label: string; color: string }[];
  unit?: string;
}

export function PriceTrendChart({ data, lines, unit = "만원" }: PriceChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E0DBD3" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: "#5C5C5C" }}
          tickLine={false}
          axisLine={{ stroke: "#E2D9CE" }}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#5C5C5C" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${(v / 10000).toFixed(0)}억`}
        />
        <Tooltip
          contentStyle={{
            background: "#161616",
            border: "none",
            borderRadius: "4px",
            color: "#fff",
            fontSize: "12px",
          }}
          formatter={(value) => [`${Number(value).toLocaleString()}${unit}`, ""]}
        />
        <Legend
          wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
        />
        {lines.map((l) => (
          <Line
            key={l.key}
            type="monotone"
            dataKey={l.key}
            name={l.label}
            stroke={l.color}
            strokeWidth={2}
            dot={{ r: 3, fill: l.color }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

interface BarDataPoint {
  month: string;
  count: number;
}

export function VolumeBarChart({ data }: { data: BarDataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E0DBD3" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: "#5C5C5C" }}
          tickLine={false}
          axisLine={{ stroke: "#E2D9CE" }}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#5C5C5C" }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "#161616",
            border: "none",
            borderRadius: "4px",
            color: "#fff",
            fontSize: "12px",
          }}
          formatter={(value) => [`${value}건`, "거래량"]}
        />
        <Bar dataKey="count" name="거래량" fill="#E60028" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface AptTrendPoint {
  label: string;
  매매?: number;
  전세?: number;
  거래량: number;
}

// 단지 상세: 매매/전세 시세 라인 + 거래량 막대 (이중 축)
export function AptComposedChart({ data }: { data: AptTrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data} margin={{ top: 5, right: 10, left: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E0DBD3" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "#5C5C5C" }}
          tickLine={false}
          axisLine={{ stroke: "#E2D9CE" }}
        />
        <YAxis
          yAxisId="price"
          tick={{ fontSize: 11, fill: "#5C5C5C" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${(v / 10000).toFixed(1)}억`}
        />
        <YAxis
          yAxisId="vol"
          orientation="right"
          tick={{ fontSize: 11, fill: "#94A3B8" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${v}건`}
        />
        <Tooltip
          contentStyle={{
            background: "#161616",
            border: "none",
            borderRadius: "4px",
            color: "#fff",
            fontSize: "12px",
          }}
          formatter={(value, name) => {
            if (name === "거래량") return [`${value}건`, name];
            return [`${Number(value).toLocaleString()}만원`, name];
          }}
        />
        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
        <Bar
          yAxisId="vol"
          dataKey="거래량"
          name="거래량"
          fill="#D8D3CB"
          radius={[2, 2, 0, 0]}
          barSize={14}
        />
        <Line
          yAxisId="price"
          type="monotone"
          dataKey="매매"
          name="매매 평균"
          stroke="#E60028"
          strokeWidth={2.5}
          dot={{ r: 2.5, fill: "#E60028" }}
          activeDot={{ r: 5 }}
          connectNulls
        />
        <Line
          yAxisId="price"
          type="monotone"
          dataKey="전세"
          name="전세 평균"
          stroke="#161616"
          strokeWidth={2.5}
          dot={{ r: 2.5, fill: "#161616" }}
          activeDot={{ r: 5 }}
          connectNulls
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
