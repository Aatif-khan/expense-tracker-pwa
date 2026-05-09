import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, Wallet } from "lucide-react";

export default function Home() {
  return (
    <div className="p-4 space-y-6">
      <header className="flex items-center justify-between mt-4">
        <div>
          <h1 className="text-2xl font-bold">Hello!</h1>
          <p className="text-muted-foreground text-sm">Welcome back to your tracker</p>
        </div>
        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
          <Wallet className="text-primary h-5 w-5" />
        </div>
      </header>

      <Card className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground border-none shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-primary-foreground/80">Total Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mb-4">$0.00</div>
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <div className="bg-white/20 p-1 rounded-full">
                <ArrowDownIcon className="h-3 w-3" />
              </div>
              <div>
                <div className="text-xs text-primary-foreground/80">Income</div>
                <div className="text-sm font-semibold">$0.00</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="bg-white/20 p-1 rounded-full">
                <ArrowUpIcon className="h-3 w-3" />
              </div>
              <div>
                <div className="text-xs text-primary-foreground/80">Expense</div>
                <div className="text-sm font-semibold">$0.00</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          <button className="text-sm text-primary font-medium">See All</button>
        </div>
        
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
          <p className="text-sm">No transactions yet.</p>
          <p className="text-xs mt-1">Tap + to add a new expense.</p>
        </div>
      </div>
    </div>
  );
}
