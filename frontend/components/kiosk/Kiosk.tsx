"use client";

import { useState, useEffect } from "react";
import { kioskQueueMock } from "./MockData";

interface Counter {
  counterId: number;
  status: "busy" | "serving" | "idle";
  currentToken: string | null;
}

interface KioskData {
  queueId: string;
  queueName: string;
  location: string;
  nowServing: {
    tokenNumber: string;
    counter: number;
  };
  nextTokens: string[];
  counters: Counter[];
  lastUpdated: string;
}

// Simulate data updates by slightly modifying the mock data
function getUpdatedMockData(): KioskData {
  const base: KioskData = {
    ...kioskQueueMock,
    counters: kioskQueueMock.counters.map((c): Counter => ({
      counterId: c.counterId,
      status: c.status as "busy" | "serving" | "idle",
      currentToken: c.currentToken,
    })),
  };
  
  // Simulate token progression - move next token to now serving occasionally
  // This is just for demonstration - in real app, this would come from WebSocket
  const random = Math.random();
  if (random > 0.7 && base.nextTokens.length > 0) {
    // Move first next token to now serving
    base.nowServing.tokenNumber = base.nextTokens[0];
    base.nextTokens = base.nextTokens.slice(1);
    // Add a new token to the end
    const lastTokenNum = parseInt(base.nextTokens[base.nextTokens.length - 1]?.split("-")[1] || "046");
    base.nextTokens.push(`T-${String(lastTokenNum + 1).padStart(3, "0")}`);
  }
  
  // Update counter statuses
  base.counters = base.counters.map((counter): Counter => {
    if (counter.counterId === base.nowServing.counter) {
      return { ...counter, status: "serving" as const, currentToken: base.nowServing.tokenNumber };
    } else if (counter.status === "serving") {
      return { ...counter, status: "busy" as const, currentToken: counter.currentToken };
    }
    return counter;
  });
  
  base.lastUpdated = new Date().toISOString();
  return base;
}

export default function Kiosk() {
  const initialData: KioskData = {
    ...kioskQueueMock,
    counters: kioskQueueMock.counters.map((c): Counter => ({
      counterId: c.counterId,
      status: c.status as "busy" | "serving" | "idle",
      currentToken: c.currentToken,
    })),
  };
  const [data, setData] = useState<KioskData>(initialData);
  const [formattedTime, setFormattedTime] = useState<string>("");

  useEffect(() => {
    // Format time on client side only to avoid hydration mismatch
    setFormattedTime(new Date(data.lastUpdated).toLocaleTimeString());

    // Update mock data every 5 seconds to simulate live updates
    const interval = setInterval(() => {
      const newData = getUpdatedMockData();
      setData(newData);
      setFormattedTime(new Date(newData.lastUpdated).toLocaleTimeString());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getCounterStatusColor = (status: string) => {
    switch (status) {
      case "serving":
        return "bg-green-500";
      case "busy":
        return "bg-yellow-500";
      case "idle":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const getCounterStatusText = (status: string) => {
    switch (status) {
      case "serving":
        return "Serving";
      case "busy":
        return "Busy";
      case "idle":
        return "Available";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
      <div className="h-full flex flex-col">
        {/* Top 20% - Header Section */}
        <div className="h-[20vh] flex items-center px-6 md:px-8 lg:px-12">
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
              {data.queueName}
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-blue-200">
              {data.location}
            </p>
          </div>
          <div className="flex items-center">
            <div className="text-sm md:text-base lg:text-lg text-blue-300 whitespace-nowrap">
              Last updated: {formattedTime || "—"}
            </div>
          </div>
        </div>

        {/* Middle 50% - Counter Details Section */}
        <div className="h-[50vh] flex gap-4 md:gap-6 lg:gap-8 px-6 md:px-8 lg:px-12">
          {/* Now Serving Section - Left Side (2/3 width) */}
          <div className="flex-[2] flex flex-col justify-center h-full">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 lg:p-8 border-2 border-white/20 shadow-2xl h-full flex flex-col justify-center">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-blue-200 mb-3 md:mb-4 lg:mb-5">
                  NOW SERVING
                </h2>
                <div className="bg-white rounded-xl p-4 md:p-6 shadow-2xl">
                  <div className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-blue-900 tracking-wider">
                    {data.nowServing.tokenNumber}
                  </div>
                  <div className="mt-3 md:mt-4 lg:mt-5 text-xl md:text-2xl lg:text-3xl font-semibold text-gray-700">
                    Counter {data.nowServing.counter}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Tokens Section - Right Side (1/3 width) */}
          <div className="flex-1 flex flex-col h-full">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4 text-center lg:text-left">
              NEXT TOKENS
            </h2>
            <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-5 border-2 border-white/20 shadow-xl overflow-y-auto">
              <div className="space-y-2 md:space-y-3">
                {data.nextTokens.length > 0 ? (
                  data.nextTokens.slice(0, 8).map((token, index) => (
                    <div
                      key={token}
                      className="bg-white/20 rounded-lg p-3 md:p-4 text-center border border-white/30"
                    >
                      <div className="text-xl md:text-2xl lg:text-3xl font-bold">
                        {token}
                      </div>
                      <div className="text-xs md:text-sm lg:text-base text-blue-200 mt-1">
                        #{index + 1} in queue
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-base md:text-lg text-blue-200 py-6">
                    No upcoming tokens
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom 30% - Counter Status Section */}
        <div className="h-[30vh] flex flex-col px-6 md:px-8 lg:px-12 p-4 md:p-6">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3">COUNTER STATUS</h2>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {data.counters.map((counter) => (
              <div
                key={counter.counterId}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 md:px-5 md:py-4 border-2 border-white/20 shadow-lg flex flex-col justify-center"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xl md:text-2xl lg:text-3xl font-bold">
                    Counter {counter.counterId}
                  </div>
                  <div
                    className={`${getCounterStatusColor(
                      counter.status
                    )} px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-semibold text-white`}
                  >
                    {getCounterStatusText(counter.status)}
                  </div>
                </div>
                {counter.currentToken && (
                  <div className="text-base md:text-lg lg:text-xl font-semibold text-blue-200">
                    Token: {counter.currentToken}
                  </div>
                )}
                {!counter.currentToken && (
                  <div className="text-sm md:text-base lg:text-lg text-blue-300">Available</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}