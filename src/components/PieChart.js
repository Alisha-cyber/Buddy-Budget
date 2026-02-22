import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { G, Path, Circle } from "react-native-svg";
import { COLORS } from "../constants/theme";

function polarToCartesian(cx, cy, r, angleDeg) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function arcPath(cx, cy, rOuter, rInner, startAngle, endAngle) {
  const startOuter = polarToCartesian(cx, cy, rOuter, endAngle);
  const endOuter = polarToCartesian(cx, cy, rOuter, startAngle);
  const startInner = polarToCartesian(cx, cy, rInner, startAngle);
  const endInner = polarToCartesian(cx, cy, rInner, endAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArcFlag} 0 ${endOuter.x} ${endOuter.y}`,
    `L ${startInner.x} ${startInner.y}`,
    `A ${rInner} ${rInner} 0 ${largeArcFlag} 1 ${endInner.x} ${endInner.y}`,
    "Z",
  ].join(" ");
}

export default function PieChart({
  size = 170,
  strokeWidth = 22,
  data = [],
  centerTitle = "Spent",
  centerValue = "$0",
  subtitle = "This month",
}) {
  const total = data.reduce((sum, d) => sum + (d.value || 0), 0) || 1;

  const radius = size / 2;
  const rOuter = radius - strokeWidth / 2;
  const rInner = rOuter - strokeWidth;

  let startAngle = 0;

  return (
    <View style={styles.wrap}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <G>
            {/* subtle ring background */}
            <Circle
              cx={radius}
              cy={radius}
              r={rOuter}
              fill="transparent"
              stroke="#F7D6E8"
              strokeWidth={strokeWidth}
            />

            {data.map((slice, idx) => {
              const angle = (slice.value / total) * 360;
              const endAngle = startAngle + angle;

              const d = arcPath(
                radius,
                radius,
                rOuter,
                rInner,
                startAngle,
                endAngle
              );
              const path = (
                <Path
                  key={`${slice.label}-${idx}`}
                  d={d}
                  fill={slice.color}
                  strokeLinejoin="round"
                />
              );

              startAngle = endAngle;
              return path;
            })}
          </G>
        </Svg>

        {/* Center labels */}
        <View style={styles.center}>
          <Text style={styles.centerTitle}>{centerTitle}</Text>
          <Text style={styles.centerValue}>{centerValue}</Text>
          <Text style={styles.centerSub}>{subtitle}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  centerTitle: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: 2,
  },
  centerValue: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
  },
  centerSub: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 2,
  },
});
