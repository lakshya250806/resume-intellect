import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext';

interface ATSBreakdownProps {
  data: {
    formatting: number;
    sections: number;
    contact_info: number;
    skills_match: number;
    experience_impact: number;
  };
}

export default function ATSBreakdown({ data }: ATSBreakdownProps) {
  const { theme } = useTheme();

  const chartData = [
    { name: 'Formatting', Score: data.formatting },
    { name: 'Sections', Score: data.sections },
    { name: 'Contact Info', Score: data.contact_info },
    { name: 'Skills Match', Score: data.skills_match },
    { name: 'Exp Impact', Score: data.experience_impact },
  ];

  // Colors adapted for light/dark theme
  const tickColor = theme === 'dark' ? '#a1a1aa' : '#52525b';
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';
  const tooltipBg = theme === 'dark' ? '#18181b' : '#ffffff';
  const tooltipBorder = theme === 'dark' ? '#27272a' : '#e4e4e7';
  const tooltipText = theme === 'dark' ? '#f4f4f5' : '#18181b';

  return (
    <div className="w-full h-[260px] text-left">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="name"
            stroke={tickColor}
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke={tickColor}
            fontSize={11}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
          />
          <Tooltip
            contentStyle={{
              background: tooltipBg,
              border: `1px solid ${tooltipBorder}`,
              borderRadius: '8px',
              fontSize: '11px',
              color: tooltipText,
            }}
            cursor={{ fill: 'rgba(255,255,255,0.02)' }}
          />
          <Bar
            dataKey="Score"
            fill="url(#barGradient)"
            radius={[4, 4, 0, 0]}
            maxBarSize={30}
          />
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#f472b6" stopOpacity={0.15} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
