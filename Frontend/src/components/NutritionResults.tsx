import { Flame } from "lucide-react";
import { Button } from "./ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion } from "motion/react";

export interface NutritionItem {
  name: string;
  quantity?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealName: string;
  items?: NutritionItem[];
}

interface NutritionResultsProps {
  data: NutritionData;
  onReset: () => void;
}

export function NutritionResults({ data, onReset }: NutritionResultsProps) {
  const chartData = [
    { name: "Protein", value: data.protein, color: "#3b82f6" },
    { name: "Carbs", value: data.carbs, color: "#f97316" },
    { name: "Fat", value: data.fat, color: "#a855f7" }
  ];

  const totalMacros = Math.max(0, (data.protein || 0) + (data.carbs || 0) + (data.fat || 0));

  // Formatting helpers
  const formatNumber = (n: number) => {
    const value = Number(n) || 0;
    return value % 1 === 0 ? value.toString() : value.toFixed(1);
  };

  const formatG = (n: number) => `${formatNumber(n)}g`;

  const derivedTotals = (data.items ?? []).reduce(
    (acc, it) => {
      acc.calories += it.calories || 0;
      acc.protein += it.protein || 0;
      acc.carbs += it.carbs || 0;
      acc.fat += it.fat || 0;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="px-6 max-w-3xl mx-auto space-y-6"
    >
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="text-center mb-8"
        >
          <h2 className="mb-3 text-3xl">{data.mealName}</h2>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full shadow-lg">
            <Flame className="w-6 h-6" />
            <span className="text-2xl">{data.calories}</span>
            <span className="text-lg">calories</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mb-8"
        >
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center -mt-4">
            <p className="text-muted-foreground">Total Macros</p>
            <p className="text-3xl">{totalMacros}g</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl"
          >
            <p className="text-blue-100 mb-1">Protein</p>
            <p className="text-5xl mb-2">{data.protein}g</p>
            <div className="text-blue-100">
              {totalMacros > 0 ? ((data.protein / totalMacros) * 100).toFixed(0) : 0}% of macros
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl"
          >
            <p className="text-orange-100 mb-1">Carbs</p>
            <p className="text-5xl mb-2">{data.carbs}g</p>
            <div className="text-orange-100">
              {totalMacros > 0 ? ((data.carbs / totalMacros) * 100).toFixed(0) : 0}% of macros
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl"
          >
            <p className="text-purple-100 mb-1">Fat</p>
            <p className="text-5xl mb-2">{data.fat}g</p>
            <div className="text-purple-100">
              {totalMacros > 0 ? ((data.fat / totalMacros) * 100).toFixed(0) : 0}% of macros
            </div>
          </motion.div>
        </div>
      </div>

      {data.items && data.items.length > 0 && (
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-0 shadow-2xl overflow-hidden">
          <div className="px-6 pt-6">
            <h3 className="text-xl mb-4">Itemized Breakdown</h3>
          </div>
          <div className="overflow-auto max-h-[420px]">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-white/80 backdrop-blur border-b z-10">
                <tr>
                  <th className="w-[40%] py-3 pl-6 pr-4 text-left font-medium text-muted-foreground">Item</th>
                  <th className="w-[15%] py-3 pr-4 text-right font-medium text-muted-foreground">Qty</th>
                  <th className="w-[15%] py-3 pr-4 text-right font-medium text-muted-foreground">Cal</th>
                  <th className="w-[10%] py-3 pr-4 text-right font-medium text-muted-foreground">Protein</th>
                  <th className="w-[10%] py-3 pr-4 text-right font-medium text-muted-foreground">Carbs</th>
                  <th className="w-[10%] py-3 pr-6 text-right font-medium text-muted-foreground">Fat</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-black/[0.02]"}>
                    <td className="py-3 pl-6 pr-4">{item.name}</td>
                    <td className="py-3 pr-4 text-right text-muted-foreground">{item.quantity ?? "-"}</td>
                    <td className="py-3 pr-4 text-right font-mono tabular-nums">{formatNumber(item.calories)}</td>
                    <td className="py-3 pr-4 text-right font-mono tabular-nums">{formatG(item.protein)}</td>
                    <td className="py-3 pr-4 text-right font-mono tabular-nums">{formatG(item.carbs)}</td>
                    <td className="py-3 pr-6 text-right font-mono tabular-nums">{formatG(item.fat)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="sticky bottom-0 bg-white/90 backdrop-blur border-t">
                <tr>
                  <td className="py-3 pl-6 pr-4 font-semibold">Total</td>
                  <td className="py-3 pr-4 text-right text-muted-foreground font-semibold">—</td>
                  <td className="py-3 pr-4 text-right font-semibold font-mono tabular-nums">{formatNumber(derivedTotals.calories)}</td>
                  <td className="py-3 pr-4 text-right font-semibold font-mono tabular-nums">{formatG(derivedTotals.protein)}</td>
                  <td className="py-3 pr-4 text-right font-semibold font-mono tabular-nums">{formatG(derivedTotals.carbs)}</td>
                  <td className="py-3 pr-6 text-right font-semibold font-mono tabular-nums">{formatG(derivedTotals.fat)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      <Button 
        onClick={onReset} 
        variant="outline" 
        className="w-full border-2 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-lg py-6" 
        size="lg"
      >
        Analyze Another Meal 🍽️
      </Button>
    </motion.div>
  );
}
