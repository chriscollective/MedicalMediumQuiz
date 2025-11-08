import React from "react";
import { motion } from "motion/react";

export function CeleryJuiceLoading() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* 西芹汁杯子 */}
      <div style={{ position: "relative", width: "128px", height: "160px" }}>
        {/* 西芹汁液體（使用絕對定位和動畫填滿） - 放在最底層 */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "85%",
            width: "100%",
            overflow: "hidden",
            clipPath: "polygon(25% 0%, 22% 75%, 22% 88%, 29% 93%, 71% 93%, 78% 88%, 78% 75%, 75% 0%)",
            zIndex: 1,
          }}
        >
          <motion.div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "linear-gradient(to top, #7CB342 0%, #9CCC65 50%, #AED581 100%)",
            }}
            initial={{ height: "0%" }}
            animate={{ height: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* 液體表面波紋效果 */}
            <motion.div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "12px",
                background: "linear-gradient(to bottom, rgba(174, 213, 129, 0.8), transparent)",
                borderRadius: "50%",
              }}
              animate={{
                scaleX: [1, 1.05, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </div>

        {/* 氣泡動畫 - 在液體上層 */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              borderRadius: "50%",
              width: `${4 + Math.random() * 4}px`,
              height: `${4 + Math.random() * 4}px`,
              left: `${30 + Math.random() * 40}%`,
              bottom: "10%",
              backgroundColor: "rgba(255, 255, 255, 0.4)",
              zIndex: 2,
            }}
            animate={{
              y: [-120, 0],
              opacity: [0, 0.6, 0],
              scale: [0.5, 1, 0.8],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeOut",
            }}
          />
        ))}

        {/* 杯子外框 - 在最上層 */}
        <svg
          viewBox="0 0 120 160"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))",
            zIndex: 3,
          }}
        >
          {/* 杯子輪廓 */}
          <defs>
            <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: "#ffffff", stopOpacity: 0.3 }} />
              <stop offset="50%" style={{ stopColor: "#ffffff", stopOpacity: 0.1 }} />
              <stop offset="100%" style={{ stopColor: "#ffffff", stopOpacity: 0.3 }} />
            </linearGradient>
          </defs>

          {/* 杯子主體 */}
          <path
            d="M 30 20 L 25 140 Q 25 150 35 150 L 85 150 Q 95 150 95 140 L 90 20 Z"
            fill="url(#glassGradient)"
            stroke="#A8CBB7"
            strokeWidth="3"
            opacity="0.6"
          />

          {/* 杯子高光 */}
          <path
            d="M 35 25 L 32 130 Q 32 135 37 135 L 45 135"
            fill="none"
            stroke="white"
            strokeWidth="2"
            opacity="0.4"
          />
        </svg>
      </div>

      {/* 載入文字 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <p style={{ color: "#636e72", fontSize: "1.125rem", fontWeight: 500 }}>
          正在載入題目...
        </p>
      </motion.div>
    </div>
  );
}
