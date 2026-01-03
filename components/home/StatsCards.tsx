import { Card } from '@/components/ui/Card';

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Jobs Progress Card */}
      <Card withWindowDots className="md:col-span-2">
        <h3 className="text-white font-semibold mb-4">Jobs Progress</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-white/70 mb-1">
              <span>Task 1</span>
              <span>30%</span>
            </div>
            <div className="w-full bg-[#0A2640] rounded-full h-2">
              <div
                className="bg-[#69E6A6] h-2 rounded-full"
                style={{ width: '30%' }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm text-white/70 mb-1">
              <span>Task 2</span>
              <span>80%</span>
            </div>
            <div className="w-full bg-[#0A2640] rounded-full h-2">
              <div
                className="bg-[#4A9EFF] h-2 rounded-full"
                style={{ width: '80%' }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm text-white/70 mb-1">
              <span>Task 3</span>
              <span>100%</span>
            </div>
            <div className="w-full bg-[#0A2640] rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full"
                style={{ width: '100%' }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm text-white/70 mb-1">
              <span>Task 4</span>
              <span>75%</span>
            </div>
            <div className="w-full bg-[#0A2640] rounded-full h-2">
              <div
                className="bg-[#69E6A6] h-2 rounded-full"
                style={{ width: '75%' }}
              ></div>
            </div>
          </div>
        </div>
      </Card>

      {/* Bookings Card */}
      <Card withWindowDots>
        <h3 className="text-white font-semibold mb-4">Bookings</h3>
        <div className="space-y-2">
          {[60, 45, 80, 50, 70, 55].map((height, index) => (
            <div key={index} className="flex items-end space-x-1">
              <div
                className="bg-[#4A9EFF] rounded-t"
                style={{ width: '20px', height: `${height}px` }}
              ></div>
            </div>
          ))}
        </div>
      </Card>

      {/* Ratings Card */}
      <Card withWindowDots className="md:col-span-1">
        <h3 className="text-white font-semibold mb-4">Ratings</h3>
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            {/* Donut Chart - Simple CSS version */}
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#0A2640"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#69E6A6"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 40 * 0.75} ${2 * Math.PI * 40}`}
                strokeLinecap="round"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#4A9EFF"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 40 * 0.25} ${2 * Math.PI * 40}`}
                strokeDashoffset={`-${2 * Math.PI * 40 * 0.75}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-white text-2xl font-bold">4.8</div>
                <div className="text-white/70 text-xs">Rating</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

