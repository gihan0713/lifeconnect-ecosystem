import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp, Building2, DollarSign } from "lucide-react";

const IncomeTracking = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, city: 0, recent: [] });

  useEffect(() => {
    fetchIncomeData();
  }, []);

  const fetchIncomeData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch user transactions
    const { data } = await supabase
      .from("income_transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const userTransactions = data || [];
    setTransactions(userTransactions);

    // Calculate stats (user transactions are only "user" type in the current schema)
    const projectIncome = userTransactions
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // City contributions are tracked separately, not in user transactions
    const cityContributions = 0;

    setStats({
      total: projectIncome,
      city: cityContributions,
      recent: userTransactions.slice(0, 5)
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Income Tracking</h2>
        <p className="text-muted-foreground">Monitor your earnings and contributions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Earnings (85%)</CardDescription>
            <CardTitle className="text-3xl">${stats.total.toFixed(2)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wallet className="h-4 w-4" />
              <span>Your share from projects</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>City Contributions (10%)</CardDescription>
            <CardTitle className="text-3xl">${(stats.total * 0.10 / 0.85).toFixed(2)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>Supporting your community</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Platform Fee (5%)</CardDescription>
            <CardTitle className="text-3xl">${(stats.total * 0.05 / 0.85).toFixed(2)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Keeping the platform running</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest income activities</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recent.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {stats.recent.map((transaction: any) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-primary">
                    +${Number(transaction.amount).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IncomeTracking;