interface StatsCardProps {
  title: string;
  value: number | string;
  icon?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatsCard({ title, value, icon, trend }: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          
          {trend && (
            <p className={`text-sm mt-2 ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              <span className="text-gray-500 ml-1">vs last month</span>
            </p>
          )}
        </div>
        
        {icon && (
          <div className="text-4xl opacity-20">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
