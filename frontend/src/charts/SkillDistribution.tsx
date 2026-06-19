import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext';

interface SkillDistributionProps {
  radarData?: {
    programming: number;
    ai_ml: number;
    web_development: number;
    databases: number;
    communication: number;
  };
}

export default function SkillDistribution({ radarData }: SkillDistributionProps) {
  const { theme } = useTheme();
  
  const chartData = [
    { subject: 'Programming', Value: radarData?.programming || 0 },
    { subject: 'AI / ML', Value: radarData?.ai_ml || 0 },
    { subject: 'Web Dev', Value: radarData?.web_development || 0 },
    { subject: 'Databases', Value: radarData?.databases || 0 },
    { subject: 'Communication', Value: radarData?.communication || 0 },
  ];

  // Theme-specific colors
  const tickColor = theme === 'dark' ? '#a1a1aa' : '#52525b';
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';
  const radiusColor = theme === 'dark' ? '#3f3f46' : '#a1a1aa';

  return (
    <div className="w-full h-[260px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
          <PolarGrid stroke={gridColor} />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: tickColor, fontSize: 10, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: radiusColor, fontSize: 8 }}
            axisLine={false}
          />
          <Radar
            name="Skills Coverage"
            dataKey="Value"
            stroke="#a78bfa"
            fill="#a78bfa"
            fillOpacity={theme === 'dark' ? 0.15 : 0.22}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
