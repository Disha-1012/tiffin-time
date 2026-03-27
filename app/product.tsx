import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withRepeat,
  withDelay,
  Easing,
} from "react-native-reanimated";

/* ✅ TYPE FOR SPICE BUTTON */
type SpiceButtonProps = {
  level: string;
  selected: boolean;
  onPress: () => void;
  delay: number;
};

/* ✅ IMAGE GETTER */
const getImage = (name: string) => {
  switch (name) {
    case "Peyara Makha":
      return require("../assets/images/P7.png");
    case "Kancha Aam Mix":
      return require("../assets/images/P6.png");
    case "Candy Mix":
      return require("../assets/images/P4.png");
    case "Mixed Chaat":
      return require("../assets/images/P3.png");
    default:
      return require("../assets/images/P5.png");
  }
};

/* 🔶 PULSING DIVIDER DOT */
function PulsingDot() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.7);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.7, { duration: 950, easing: Easing.inOut(Easing.sin) }),
        withTiming(1.0, { duration: 950, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 950 }),
        withTiming(0.4, { duration: 950 })
      ),
      -1,
      true
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.dividerDot, animStyle]} />;
}

/* ✅ SPICE BUTTON */
function SpiceButton({ level, selected, onPress, delay }: SpiceButtonProps) {
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    if (selected) {
      glowOpacity.value = withTiming(1, { duration: 300 });
    } else {
      glowOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [selected]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value * 0.08,
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withTiming(0.9, { duration: 80 }),
      withSpring(1, { damping: 8, stiffness: 200 })
    );
    onPress();
  };

  return (
    <Animated.View entering={FadeIn.delay(delay)} style={animStyle}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.85}
        style={[styles.optionButton, selected && styles.optionButtonActive]}
      >
        <Animated.View style={[styles.buttonGlow, glowStyle]} />
        <Text style={[styles.optionText, selected && styles.optionTextActive]}>
          {level}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function Product() {
  const params = useLocalSearchParams();
  const router = useRouter();

  /* ✅ SAFE PARAMS */
  const productName =
    typeof params.name === "string"
      ? params.name
      : Array.isArray(params.name)
      ? params.name[0]
      : "";

  const basePrice = Number(params.price || 0);
  const isCandy = params.noSpice === "true";

  const [spice, setSpice] = useState("Medium");
  const [extra, setExtra] = useState(false);

  const totalPrice = isCandy ? basePrice : extra ? basePrice + 5 : basePrice;

  /* 🔶 Animations */
  const ringScale = useSharedValue(1);
  const ringOpacity = useSharedValue(0.5);
  const extraScale = useSharedValue(1);
  const totalScale = useSharedValue(1);
  const shimmerX = useSharedValue(-100);
  const headerY = useSharedValue(-30);
  const headerOpacity = useSharedValue(0);

  useEffect(() => {
    headerY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) });
    headerOpacity.value = withTiming(1, { duration: 600 });

    ringScale.value = withRepeat(
      withSequence(
        withTiming(1.18, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
        withTiming(1.0, { duration: 1400, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
    ringOpacity.value = withRepeat(
      withSequence(
        withTiming(0.9, { duration: 1400 }),
        withTiming(0.3, { duration: 1400 })
      ),
      -1,
      true
    );

    shimmerX.value = withDelay(
      1600,
      withRepeat(
        withTiming(340, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
        -1,
        false
      )
    );
  }, []);

  const headerAnimStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerY.value }],
  }));

  const ringAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  const extraAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: extraScale.value }],
  }));

  const totalAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: totalScale.value }],
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerX.value }],
  }));

  const popTotal = () => {
    totalScale.value = withSequence(
      withTiming(1.18, { duration: 110 }),
      withSpring(1, { damping: 6, stiffness: 220 })
    );
  };

  const handleSpiceSelect = (level: string) => {
    setSpice(level);
    popTotal();
  };

  const handleExtraPress = () => {
    extraScale.value = withSequence(
      withTiming(0.92, { duration: 80 }),
      withSpring(1, { damping: 8, stiffness: 200 })
    );
    setExtra(!extra);
    popTotal();
  };

  return (
    <View style={styles.container}>

      {/* 🔶 Gold top accent strip */}
      <View style={styles.topStrip} />

      {/* 🔝 HEADER */}
      <Animated.View style={[styles.header, headerAnimStyle]}>
        <View style={styles.logoRing}>
          <Image
            source={require("../assets/images/Logo.png")}
            style={styles.logo}
          />
        </View>
        <Text style={styles.headerText}>Tiffin Time</Text>
      </Animated.View>

      {/* 🔶 MAIN CARD */}
      <Animated.View
        entering={FadeIn.delay(200).duration(600)}
        style={styles.card}
      >

        {/* 🔶 PRODUCT HEADER */}
        <View style={styles.productHeader}>
          <View style={styles.imageWrapper}>
            <Animated.View style={[styles.imageRing, ringAnimStyle]} />
            <Image source={getImage(productName)} style={styles.productImage} />
          </View>
          <Text style={styles.productName}>{productName}</Text>
        </View>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <PulsingDot />
          <View style={styles.dividerLine} />
        </View>

        {/* PRICE BADGE */}
        <Animated.View
          entering={FadeIn.delay(300).duration(600)}
          style={styles.priceBadge}
        >
          {/* 🔶 Brighter Base Price label */}
          <Text style={styles.priceBadgeLabel}>BASE PRICE</Text>
          <Text style={styles.priceBadgeValue}>₹{basePrice}</Text>
        </Animated.View>

        {/* ❌ HIDE FOR CANDY */}
        {!isCandy && (
          <>
            <Animated.Text
              entering={FadeIn.delay(350).duration(600)}
              style={styles.label}
            >
              Choose Spice Level 🌶️
            </Animated.Text>

            {["Low", "Medium", "High"].map((level, index) => (
              <SpiceButton
                key={level}
                level={level}
                selected={spice === level}
                onPress={() => handleSpiceSelect(level)}
                delay={index * 150}
              />
            ))}

            {/* EXTRA */}
            <Animated.View
              entering={FadeIn.delay(700).duration(600)}
              style={extraAnimStyle}
            >
              <TouchableOpacity
                onPress={handleExtraPress}
                activeOpacity={0.85}
                style={[
                  styles.optionButton,
                  styles.extraButton,
                  extra && styles.optionButtonActive,
                ]}
              >
                {extra && <View style={styles.buttonGlowStatic} />}
                <Text style={[styles.optionText, extra && styles.optionTextActive]}>
                  Extra Masala (+₹5)
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </>
        )}

        {/* Divider before total */}
        <View style={[styles.dividerRow, { marginTop: 18 }]}>
          <View style={styles.dividerLine} />
          <PulsingDot />
          <View style={styles.dividerLine} />
        </View>

        {/* TOTAL */}
        <Animated.View
          entering={FadeIn.delay(900).duration(600)}
          style={styles.totalRow}
        >
          {/* 🔶 Brighter Total label */}
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Animated.Text style={[styles.total, totalAnimStyle]}>
            ₹{totalPrice}
          </Animated.Text>
        </Animated.View>

        {/* CTA */}
        <Animated.View entering={FadeIn.delay(1100).duration(600)}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.88}
            onPress={() =>
              router.push({
                pathname: "/cart",
                params: {
                  ...params,
                  spice: isCandy ? "N/A" : spice,
                  extra: isCandy ? "No" : extra ? "Yes" : "No",
                  totalPrice,
                },
              })
            }
          >
            <View style={styles.ctaTopShine} />
            <Animated.View style={[styles.ctaShimmer, shimmerStyle]} />
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>
        </Animated.View>

      </Animated.View>
    </View>
  );
}

/* 🎨 STYLES */
const GOLD = "#C9A96E";
const GOLD_BRIGHT = "#FFE5A0";
const GOLD_LIGHT = "#F0D9A8";
const DARK = "#1A120B";
const CARD = "#221810";
const SURFACE = "#2A1F14";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK,
    padding: 20,
  },
  topStrip: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: GOLD,
    opacity: 0.9,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
    marginTop: 10,
  },
  logoRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: GOLD,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#C9A96E66",
    shadowColor: GOLD,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 19,
    resizeMode: "contain",
  },
  headerText: {
    color: GOLD,
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: 1.2,
  },
  card: {
    backgroundColor: CARD,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#C9A96E1A",
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.65,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
  },
  productHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  imageWrapper: {
    width: 58,
    height: 58,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  imageRing: {
    position: "absolute",
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    borderColor: GOLD,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: GOLD,
  },
  productName: {
    fontSize: 24,
    color: GOLD,
    fontWeight: "bold",
    letterSpacing: 0.4,
    flex: 1,
    flexWrap: "wrap",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#C9A96E2A",
  },
  dividerDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: GOLD,
    marginHorizontal: 8,
  },
  priceBadge: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: SURFACE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#C9A96E1A",
    paddingHorizontal: 16,
    paddingVertical: 11,
    marginBottom: 6,
  },

  // 🔶 Brighter: was "#C9A96E77", now "#C9A96E" full gold
  priceBadgeLabel: {
    color: "#D4AA72",
    fontSize: 12,
    letterSpacing: 1,
    fontWeight: "700",
  },

  priceBadgeValue: {
    color: GOLD_BRIGHT,
    fontSize: 18,
    fontWeight: "bold",
  },
  label: {
    color: GOLD,
    marginTop: 14,
    marginBottom: 4,
    fontSize: 13,
    letterSpacing: 0.7,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  optionButton: {
    backgroundColor: SURFACE,
    padding: 13,
    marginVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#C9A96E2E",
    overflow: "hidden",
    position: "relative",
  },
  optionButtonActive: {
    backgroundColor: "#3B2912",
    borderColor: GOLD,
    borderWidth: 1.5,
  },
  extraButton: {
    marginTop: 6,
    borderStyle: "dashed",
  },
  buttonGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: GOLD,
    borderRadius: 12,
  },
  buttonGlowStatic: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: GOLD,
    opacity: 0.07,
    borderRadius: 12,
  },
  optionText: {
    textAlign: "center",
    color: "#D6BB87",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.4,
  },
  optionTextActive: {
    color: GOLD_BRIGHT,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 2,
    marginBottom: 2,
  },

  // 🔶 Brighter: was "#C9A96E77", now solid warm gold
  totalLabel: {
    color: "#D4AA72",
    fontSize: 13,
    letterSpacing: 1.2,
    fontWeight: "700",
  },

  total: {
    fontSize: 22,
    color: GOLD_BRIGHT,
    fontWeight: "bold",
    textAlign: "right",
  },

  button: {
    backgroundColor: GOLD,
    padding: 16,
    borderRadius: 14,
    marginTop: 20,
    overflow: "hidden",
    position: "relative",
    shadowColor: GOLD,
    shadowOpacity: 0.4,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
  },
  ctaTopShine: {
    position: "absolute",
    top: 0,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: "#fff",
    opacity: 0.3,
    borderRadius: 1,
  },
  ctaShimmer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 55,
    backgroundColor: "#fff",
    opacity: 0.13,
    borderRadius: 4,
    transform: [{ skewX: "-18deg" }],
  },
  buttonText: {
    textAlign: "center",
    color: "#1A120B",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.8,
  },
});