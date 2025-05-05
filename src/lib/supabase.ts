import { createClient } from '@supabase/supabase-js';

// These would typically be environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getInvestments() {
  // This is a mock function that would typically fetch data from Supabase
  // In a real application, you would use something like:
  // const { data, error } = await supabase.from('investments').select('*');
  
  // For now, we'll return mock data
  return [
    {
      id: "tech-growth-fund",
      title: "Tech Growth Fund",
      description: "Invest in a portfolio of high-growth technology companies with strong potential for returns.",
      expectedReturn: "12-15% annually",
      minimumInvestment: "$10,000",
      category: "Technology",
      risk: "Moderate",
    },
    {
      id: "real-estate-portfolio",
      title: "Real Estate Portfolio",
      description: "Diversify with our premium real estate investments in high-growth urban markets.",
      expectedReturn: "8-10% annually",
      minimumInvestment: "$25,000",
      category: "Real Estate",
      risk: "Low",
    },
    {
      id: "sustainable-energy-fund",
      title: "Sustainable Energy Fund",
      description: "Invest in renewable energy projects with strong environmental impact and financial returns.",
      expectedReturn: "9-12% annually",
      minimumInvestment: "$15,000",
      category: "Energy",
      risk: "Moderate",
    },
    {
      id: "global-markets-fund",
      title: "Global Markets Fund",
      description: "Access international markets with our diversified global investment portfolio.",
      expectedReturn: "10-14% annually",
      minimumInvestment: "$20,000",
      category: "Global",
      risk: "Moderate-High",
    },
    {
      id: "healthcare-innovation-fund",
      title: "Healthcare Innovation Fund",
      description: "Invest in cutting-edge healthcare companies developing breakthrough treatments and technologies.",
      expectedReturn: "13-16% annually",
      minimumInvestment: "$15,000",
      category: "Healthcare",
      risk: "High",
    },
    {
      id: "income-generation-portfolio",
      title: "Income Generation Portfolio",
      description: "Focus on stable income with our dividend-paying stocks and fixed income securities.",
      expectedReturn: "6-8% annually",
      minimumInvestment: "$10,000",
      category: "Income",
      risk: "Low",
    },
  ];
}
