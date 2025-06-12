import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sun, Gift, PenLine, BookOpen, User, Edit3, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DailyMindBoost() {
  const [quotes, setQuotes] = useState([]);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [activeScreen, setActiveScreen] = useState("home");
  const [reflection, setReflection] = useState(() => localStorage.getItem("reflection") || "");
  const [themeUnlocked, setThemeUnlocked] = useState(false);

  useEffect(() => {
    fetch("https://type.fit/api/quotes")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((quote) => quote.text.length < 120);
        setQuotes(filtered.slice(0, 10));
      });
  }, []);

  const handleNextQuote = () => {
    setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
  };

  const handleSaveReflection = () => {
    localStorage.setItem("reflection", reflection);
    alert("Reflection saved!");
  };

  const handleUnlockTheme = () => {
    alert("Watch a rewarded ad to unlock this theme!");
    // Simulate ad success
    setTimeout(() => setThemeUnlocked(true), 2000);
  };

  const currentQuote = quotes[currentQuoteIndex]?.text || "Loading inspirational quote...";

  const screenVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${themeUnlocked ? "bg-yellow-50" : "bg-gradient-to-b from-indigo-100 to-white"} p-6 flex flex-col items-center`}>
      <div className="flex justify-between w-full max-w-md mb-4 gap-2">
        <Button variant="ghost" onClick={() => setActiveScreen("home")}>Home</Button>
        <Button variant="ghost" onClick={() => setActiveScreen("explore")}> <BookOpen className="w-5 h-5 mr-1" /> Explore </Button>
        <Button variant="ghost" onClick={() => setActiveScreen("reflect")}> <Edit3 className="w-5 h-5 mr-1" /> Reflect </Button>
        <Button variant="ghost" onClick={() => setActiveScreen("profile")}> <User className="w-5 h-5 mr-1" /> Profile </Button>
      </div>

      <AnimatePresence mode="wait">
        {activeScreen === "home" && (
          <motion.div key="home" {...screenVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-md">
            <h1 className="text-2xl font-bold mb-4 text-indigo-700">Good Morning, Sarah!</h1>

            <Card className="shadow-xl mb-4">
              <CardContent className="p-6 text-center">
                <p className="text-lg italic text-gray-700">"{currentQuote}"</p>
              </CardContent>
            </Card>

            <div className="flex gap-4 mb-6">
              <Button variant="outline" className="flex gap-2" onClick={handleNextQuote}>
                <Sun className="w-4 h-4" /> Next Quote
              </Button>
              <Button variant="outline" className="flex gap-2" onClick={() => setActiveScreen("reflect")}> 
                <PenLine className="w-4 h-4" /> Reflect
              </Button>
              <Button variant="default" className="flex gap-2" onClick={handleUnlockTheme}>
                <Gift className="w-4 h-4" /> Unlock More
              </Button>
            </div>

            <div className="rounded-xl shadow bg-gray-100 p-4 text-center text-sm text-gray-500">
              [Ad Banner Placeholder]
            </div>
          </motion.div>
        )}

        {activeScreen === "explore" && (
          <motion.div key="explore" {...screenVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-md mt-4">
            <h2 className="text-xl font-semibold text-indigo-600 mb-2">Explore Quotes</h2>
            <div className="grid gap-3">
              {quotes.map((quote, index) => (
                <Card key={index}>
                  <CardContent className="p-4 text-sm text-gray-700 italic">"{quote.text}"</CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {activeScreen === "reflect" && (
          <motion.div key="reflect" {...screenVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-md mt-4">
            <h2 className="text-xl font-semibold text-indigo-600 mb-2">Reflection Journal</h2>
            <textarea
              className="w-full h-32 p-4 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
              placeholder="Write a quick reflection here..."
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
            />
            <Button className="mt-3 w-full" onClick={handleSaveReflection}>Save Reflection</Button>
          </motion.div>
        )}

        {activeScreen === "profile" && (
          <motion.div key="profile" {...screenVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-md mt-4">
            <h2 className="text-xl font-semibold text-indigo-600 mb-2">Profile Settings</h2>
            <div className="p-4 bg-white rounded-xl shadow text-sm text-gray-600">
              {themeUnlocked ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Sparkles className="w-4 h-4" /> Theme Unlocked!
                </div>
              ) : (
                "Coming soon: Reminder settings, theme preferences, and more!"
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
